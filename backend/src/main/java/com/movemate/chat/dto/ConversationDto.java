package com.movemate.chat.dto;

import com.movemate.chat.entity.Conversation;
import com.movemate.chat.entity.ConversationMember;
import com.movemate.chat.entity.ConversationType;
import com.movemate.user.entity.User;

import java.time.LocalDateTime;

public class ConversationDto {

    private Long id;
    private ConversationType type;
    private Long participantId;
    private String participantName;
    private String participantProfession;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
    private LocalDateTime createdAt;

    public ConversationDto() {}

    public ConversationDto(Conversation conversation, User currentUser, MessageDto lastMessageDto, long unreadCount) {
        this.id = conversation.getId();
        this.type = conversation.getType();
        this.createdAt = conversation.getCreatedAt();
        this.unreadCount = unreadCount;

        if (lastMessageDto != null) {
            this.lastMessage = lastMessageDto.getMessage();
            this.lastMessageTime = lastMessageDto.getCreatedAt();
        }

        // Determine counterpart participant details for direct chats
        for (ConversationMember member : conversation.getMembers()) {
            if (currentUser != null && !member.getUser().getId().equals(currentUser.getId())) {
                User other = member.getUser();
                this.participantId = other.getId();
                this.participantName = extractName(other);
                this.participantProfession = extractProfession(other);
                break;
            }
        }
    }

    private String extractName(User user) {
        if (user.getProfile() != null && user.getProfile().getFullName() != null && !user.getProfile().getFullName().isBlank()) {
            return user.getProfile().getFullName();
        }
        return user.getEmail().split("@")[0];
    }

    private String extractProfession(User user) {
        if (user.getProfile() != null) {
            return user.getProfile().getProfession();
        }
        return null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ConversationType getType() { return type; }
    public void setType(ConversationType type) { this.type = type; }

    public Long getParticipantId() { return participantId; }
    public void setParticipantId(Long participantId) { this.participantId = participantId; }

    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }

    public String getParticipantProfession() { return participantProfession; }
    public void setParticipantProfession(String participantProfession) { this.participantProfession = participantProfession; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageTime() { return lastMessageTime; }
    public void setLastMessageTime(LocalDateTime lastMessageTime) { this.lastMessageTime = lastMessageTime; }

    public long getUnreadCount() { return unreadCount; }
    public void setUnreadCount(long unreadCount) { this.unreadCount = unreadCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
