package com.movemate.chat.service;

import com.movemate.chat.dto.ConversationDto;
import com.movemate.chat.dto.MessageDto;
import com.movemate.chat.entity.Conversation;
import com.movemate.chat.entity.ConversationMember;
import com.movemate.chat.entity.ConversationType;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationMemberRepository conversationMemberRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ConversationDto createOrGetDirectConversation(User currentUser, Long recipientId) {
        if (currentUser.getId().equals(recipientId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot start a conversation with yourself");
        }

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient user not found"));

        Optional<Conversation> existingOpt = conversationRepository.findDirectConversationBetweenUsers(currentUser.getId(), recipientId);
        if (existingOpt.isPresent()) {
            Conversation existing = existingOpt.get();
            return buildConversationDto(existing, currentUser);
        }

        Conversation conversation = new Conversation(ConversationType.DIRECT);
        conversation = conversationRepository.save(conversation);

        ConversationMember member1 = new ConversationMember(conversation, currentUser);
        ConversationMember member2 = new ConversationMember(conversation, recipient);
        conversationMemberRepository.save(member1);
        conversationMemberRepository.save(member2);

        conversation.getMembers().add(member1);
        conversation.getMembers().add(member2);

        return buildConversationDto(conversation, currentUser);
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(User currentUser) {
        List<Conversation> conversations = conversationRepository.findConversationsByUserId(currentUser.getId());
        List<ConversationDto> result = new ArrayList<>();

        for (Conversation conv : conversations) {
            result.add(buildConversationDto(conv, currentUser));
        }

        return result;
    }

    @Transactional(readOnly = true)
    public ConversationDto getConversationById(Long conversationId, User currentUser) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));

        boolean isMember = conversationMemberRepository.existsByConversationIdAndUserId(conversationId, currentUser.getId());
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view this conversation");
        }

        return buildConversationDto(conversation, currentUser);
    }

    public boolean isUserParticipant(Long conversationId, Long userId) {
        return conversationMemberRepository.existsByConversationIdAndUserId(conversationId, userId);
    }

    private ConversationDto buildConversationDto(Conversation conversation, User currentUser) {
        MessageDto lastMessageDto = messageRepository.findTopByConversationIdOrderByCreatedAtDesc(conversation.getId())
                .map(msg -> new MessageDto(msg, currentUser.getId()))
                .orElse(null);

        Optional<ConversationMember> memberOpt = conversationMemberRepository.findByConversationIdAndUserId(conversation.getId(), currentUser.getId());
        LocalDateTime lastReadAt = memberOpt.map(ConversationMember::getLastReadAt).orElse(null);

        long unreadCount = messageRepository.countUnreadMessagesForUser(conversation.getId(), currentUser.getId(), lastReadAt);

        return new ConversationDto(conversation, currentUser, lastMessageDto, unreadCount);
    }
}
