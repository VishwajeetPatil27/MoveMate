package com.movemate.chat.dto;

import com.movemate.chat.entity.Message;
import com.movemate.chat.entity.MessageType;
import java.time.LocalDateTime;

public class MessageDto {

    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderProfession;
    private String message;
    private MessageType messageType;
    private Boolean isRead;
    private Boolean isMine;
    private LocalDateTime createdAt;

    public MessageDto() {}

    public MessageDto(Message message, Long currentUserId) {
        this.id = message.getId();
        this.conversationId = message.getConversation().getId();
        this.senderId = message.getSender().getId();
        this.senderName = extractName(message.getSender());
        this.senderProfession = extractProfession(message.getSender());
        this.message = message.getMessage();
        this.messageType = message.getMessageType();
        this.isRead = message.getIsRead();
        this.isMine = currentUserId != null && currentUserId.equals(message.getSender().getId());
        this.createdAt = message.getCreatedAt();
    }

    private String extractName(com.movemate.user.entity.User user) {
        if (user.getProfile() != null && user.getProfile().getFullName() != null && !user.getProfile().getFullName().isBlank()) {
            return user.getProfile().getFullName();
        }
        return user.getEmail().split("@")[0];
    }

    private String extractProfession(com.movemate.user.entity.User user) {
        if (user.getProfile() != null) {
            return user.getProfile().getProfession();
        }
        return null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getConversationId() { return conversationId; }
    public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getSenderProfession() { return senderProfession; }
    public void setSenderProfession(String senderProfession) { this.senderProfession = senderProfession; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public MessageType getMessageType() { return messageType; }
    public void setMessageType(MessageType messageType) { this.messageType = messageType; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public Boolean getIsMine() { return isMine; }
    public void setIsMine(Boolean isMine) { this.isMine = isMine; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
