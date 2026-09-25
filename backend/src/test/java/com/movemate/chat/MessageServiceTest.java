package com.movemate.chat;

import com.movemate.chat.dto.MessageDto;
import com.movemate.chat.dto.SendMessageRequest;
import com.movemate.chat.entity.Conversation;
import com.movemate.chat.entity.ConversationType;
import com.movemate.chat.entity.Message;
import com.movemate.chat.entity.MessageType;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.chat.service.MessageService;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private ConversationMemberRepository conversationMemberRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private MessageService messageService;

    private User sender;
    private User recipient;
    private Conversation conversation;

    @BeforeEach
    void setUp() {
        sender = new User("sender@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        sender.setId(1L);

        recipient = new User("recipient@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        recipient.setId(2L);

        conversation = new Conversation(ConversationType.DIRECT);
        conversation.setId(100L);
    }

    @Test
    void sendMessage_Success_AndSanitizesHtml() {
        when(conversationRepository.findById(100L)).thenReturn(Optional.of(conversation));
        when(conversationMemberRepository.existsByConversationIdAndUserId(100L, 1L)).thenReturn(true);

        Message savedMsg = new Message(conversation, sender, "&lt;script&gt;alert('xss')&lt;/script&gt; Hello!", MessageType.TEXT);
        savedMsg.setId(500L);
        when(messageRepository.save(any(Message.class))).thenReturn(savedMsg);

        SendMessageRequest request = new SendMessageRequest("<script>alert('xss')</script> Hello!");
        MessageDto result = messageService.sendMessage(100L, sender, request);

        assertNotNull(result);
        assertEquals(500L, result.getId());
        assertTrue(result.getMessage().contains("&lt;script&gt;"));
        verify(messageRepository).save(any(Message.class));
        verify(messagingTemplate).convertAndSend(eq("/topic/conversations.100"), any(MessageDto.class));
    }

    @Test
    void sendMessage_Forbidden_WhenUserNotMember() {
        when(conversationRepository.findById(100L)).thenReturn(Optional.of(conversation));
        when(conversationMemberRepository.existsByConversationIdAndUserId(100L, 1L)).thenReturn(false);

        SendMessageRequest request = new SendMessageRequest("Hello");
        assertThrows(ResponseStatusException.class, () -> messageService.sendMessage(100L, sender, request));
        verify(messageRepository, never()).save(any());
    }
}
