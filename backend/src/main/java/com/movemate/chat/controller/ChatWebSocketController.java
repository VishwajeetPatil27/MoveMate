package com.movemate.chat.controller;

import com.movemate.chat.dto.MessageDto;
import com.movemate.chat.dto.SendMessageRequest;
import com.movemate.chat.service.MessageService;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.sendMessage/{conversationId}")
    public MessageDto sendMessage(
            @DestinationVariable("conversationId") Long conversationId,
            @Payload SendMessageRequest request,
            Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("User must be authenticated to send WebSocket messages");
        }
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        return messageService.sendMessage(conversationId, currentUser, request);
    }
}
