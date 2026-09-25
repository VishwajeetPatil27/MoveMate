package com.movemate.chat.dto;

import com.movemate.chat.entity.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SendMessageRequest {

    @NotBlank(message = "Message content cannot be blank")
    @Size(max = 5000, message = "Message content cannot exceed 5000 characters")
    private String message;

    private MessageType messageType = MessageType.TEXT;

    public SendMessageRequest() {}

    public SendMessageRequest(String message) {
        this.message = message;
        this.messageType = MessageType.TEXT;
    }

    public SendMessageRequest(String message, MessageType messageType) {
        this.message = message;
        this.messageType = messageType != null ? messageType : MessageType.TEXT;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }
}
