package com.movemate.chat.service;

import com.movemate.chat.dto.MessageDto;
import com.movemate.chat.dto.SendMessageRequest;
import com.movemate.chat.entity.Conversation;
import com.movemate.chat.entity.ConversationMember;
import com.movemate.chat.entity.Message;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import com.movemate.notification.entity.NotificationType;
import com.movemate.notification.service.NotificationService;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationMemberRepository conversationMemberRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public MessageDto sendMessage(Long conversationId, User currentUser, SendMessageRequest request) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));

        boolean isMember = conversationMemberRepository.existsByConversationIdAndUserId(conversationId, currentUser.getId());
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to send messages in this conversation");
        }

        String sanitizedText = sanitizeHtml(request.getMessage());

        Message message = new Message(conversation, currentUser, sanitizedText, request.getMessageType());
        message = messageRepository.save(message);

        // Update conversation timestamp for dynamic sorting
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        MessageDto dto = new MessageDto(message, currentUser.getId());

        // Real-time broadcast over STOMP WebSocket
        try {
            messagingTemplate.convertAndSend("/topic/conversations." + conversationId, dto);
        } catch (Exception e) {
            // Log & gracefully handle WebSocket broadcast failures without failing database persistence
            System.err.println("WebSocket broadcast error: " + e.getMessage());
        }

        // Trigger NEW_MESSAGE notification for other conversation participants
        List<ConversationMember> members = conversationMemberRepository.findByConversationId(conversationId);
        for (ConversationMember member : members) {
            if (!member.getUser().getId().equals(currentUser.getId())) {
                String senderName = currentUser.getProfile() != null && currentUser.getProfile().getFullName() != null
                        ? currentUser.getProfile().getFullName() : currentUser.getEmail();
                notificationService.createNotification(
                        member.getUser(),
                        NotificationType.NEW_MESSAGE,
                        "New Message from " + senderName,
                        sanitizedText.length() > 60 ? sanitizedText.substring(0, 57) + "..." : sanitizedText,
                        conversationId
                );
            }
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public Page<MessageDto> getConversationMessages(Long conversationId, User currentUser, Pageable pageable) {
        boolean isMember = conversationMemberRepository.existsByConversationIdAndUserId(conversationId, currentUser.getId());
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view messages in this conversation");
        }

        Page<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
        return messages.map(msg -> new MessageDto(msg, currentUser.getId()));
    }

    @Transactional
    public void markConversationAsRead(Long conversationId, User currentUser) {
        ConversationMember member = conversationMemberRepository.findByConversationIdAndUserId(conversationId, currentUser.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not a participant of this conversation"));

        member.setLastReadAt(LocalDateTime.now());
        conversationMemberRepository.save(member);
    }

    private String sanitizeHtml(String text) {
        if (text == null) return "";
        return text.replace("<", "&lt;").replace(">", "&gt;");
    }
}
