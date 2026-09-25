package com.movemate.notification.service;

import com.movemate.notification.dto.NotificationDto;
import com.movemate.notification.entity.Notification;
import com.movemate.notification.entity.NotificationType;
import com.movemate.notification.repository.NotificationRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public NotificationDto createNotification(User recipient, NotificationType type, String title, String message, Long referenceId) {
        if (recipient == null) return null;

        Notification notification = new Notification(recipient, type, sanitizeHtml(title), sanitizeHtml(message), referenceId);
        Notification saved = notificationRepository.save(notification);
        NotificationDto dto = mapToDto(saved);

        // Real-Time WebSocket Delivery over STOMP /user/{email}/queue/notifications
        try {
            messagingTemplate.convertAndSendToUser(
                    recipient.getEmail(),
                    "/queue/notifications",
                    dto
            );
        } catch (Exception e) {
            // Log warning on WebSocket broadcast failure while preserving persistent DB record
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public Page<NotificationDto> getUserNotifications(User recipient, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipient.getId(), pageable);
        List<NotificationDto> dtos = page.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(User recipient) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipient.getId());
    }

    @Transactional
    public NotificationDto markAsRead(Long notificationId, User recipient) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found with ID: " + notificationId));

        if (!notification.getRecipient().getId().equals(recipient.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to modify this notification");
        }

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return mapToDto(updated);
    }

    @Transactional
    public void markAllAsRead(User recipient) {
        notificationRepository.markAllAsReadForUser(recipient.getId());
    }

    @Transactional
    public void deleteNotification(Long notificationId, User recipient) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found with ID: " + notificationId));

        if (!notification.getRecipient().getId().equals(recipient.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this notification");
        }

        notificationRepository.delete(notification);
    }

    public NotificationDto mapToDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setRecipientId(n.getRecipient().getId());
        dto.setType(n.getType());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setReferenceId(n.getReferenceId());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    private String sanitizeHtml(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "").trim();
    }
}
