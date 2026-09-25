package com.movemate.notification;

import com.movemate.notification.dto.NotificationDto;
import com.movemate.notification.entity.Notification;
import com.movemate.notification.entity.NotificationType;
import com.movemate.notification.repository.NotificationRepository;
import com.movemate.notification.service.NotificationService;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    private NotificationService notificationService;

    private User recipient;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(notificationRepository, userRepository, messagingTemplate);
        recipient = new User("recipient@test.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        recipient.setId(1L);
    }

    @Test
    void createNotification_Success() {
        Notification savedNotification = new Notification(recipient, NotificationType.POST_LIKED, "Post Liked", "John liked your post", 10L);
        savedNotification.setId(100L);

        when(notificationRepository.save(any(Notification.class))).thenReturn(savedNotification);

        NotificationDto dto = notificationService.createNotification(recipient, NotificationType.POST_LIKED, "Post Liked", "John liked your post", 10L);

        assertNotNull(dto);
        assertEquals(100L, dto.getId());
        assertEquals("Post Liked", dto.getTitle());
        assertFalse(dto.isRead());

        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void markAsRead_Success() {
        Notification notification = new Notification(recipient, NotificationType.POST_LIKED, "Post Liked", "John liked your post", 10L);
        notification.setId(100L);
        notification.setRead(false);

        when(notificationRepository.findById(100L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationDto dto = notificationService.markAsRead(100L, recipient);

        assertNotNull(dto);
        assertTrue(dto.isRead());
    }

    @Test
    void markAsRead_Forbidden_WhenNotRecipient() {
        User otherUser = new User("other@test.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        otherUser.setId(2L);

        Notification notification = new Notification(recipient, NotificationType.POST_LIKED, "Post Liked", "John liked your post", 10L);
        notification.setId(100L);

        when(notificationRepository.findById(100L)).thenReturn(Optional.of(notification));

        assertThrows(ResponseStatusException.class, () -> notificationService.markAsRead(100L, otherUser));
    }
}
