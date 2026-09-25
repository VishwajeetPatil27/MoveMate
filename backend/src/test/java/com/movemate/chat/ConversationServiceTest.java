package com.movemate.chat;

import com.movemate.chat.dto.ConversationDto;
import com.movemate.chat.entity.Conversation;
import com.movemate.chat.entity.ConversationMember;
import com.movemate.chat.entity.ConversationType;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.chat.service.ConversationService;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConversationServiceTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private ConversationMemberRepository conversationMemberRepository;

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ConversationService conversationService;

    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        userA = new User("userA@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        userA.setId(1L);

        userB = new User("userB@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        userB.setId(2L);
    }

    @Test
    void createOrGetDirectConversation_CreatesNew_WhenDoesNotExist() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(userB));
        when(conversationRepository.findDirectConversationBetweenUsers(1L, 2L)).thenReturn(Optional.empty());

        Conversation newConv = new Conversation(ConversationType.DIRECT);
        newConv.setId(10L);
        when(conversationRepository.save(any(Conversation.class))).thenReturn(newConv);

        ConversationDto result = conversationService.createOrGetDirectConversation(userA, 2L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        verify(conversationRepository).save(any(Conversation.class));
        verify(conversationMemberRepository, times(2)).save(any(ConversationMember.class));
    }

    @Test
    void createOrGetDirectConversation_ReturnsExisting_WhenAlreadyExists() {
        Conversation existing = new Conversation(ConversationType.DIRECT);
        existing.setId(5L);

        when(userRepository.findById(2L)).thenReturn(Optional.of(userB));
        when(conversationRepository.findDirectConversationBetweenUsers(1L, 2L)).thenReturn(Optional.of(existing));

        ConversationDto result = conversationService.createOrGetDirectConversation(userA, 2L);

        assertNotNull(result);
        assertEquals(5L, result.getId());
        verify(conversationRepository, never()).save(any(Conversation.class));
    }

    @Test
    void createOrGetDirectConversation_ThrowsBadRequest_WhenSelfConversation() {
        assertThrows(ResponseStatusException.class, () -> conversationService.createOrGetDirectConversation(userA, 1L));
    }
}
