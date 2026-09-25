package com.movemate.chat.dto;

import jakarta.validation.constraints.NotNull;

public class CreateConversationRequest {

    @NotNull(message = "Recipient user ID is required")
    private Long recipientId;

    public CreateConversationRequest() {}

    public CreateConversationRequest(Long recipientId) {
        this.recipientId = recipientId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }
}
