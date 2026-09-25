package com.movemate.chat.controller;

import com.movemate.chat.dto.ConversationDto;
import com.movemate.chat.dto.CreateConversationRequest;
import com.movemate.chat.dto.MessageDto;
import com.movemate.chat.dto.SendMessageRequest;
import com.movemate.chat.service.ConversationService;
import com.movemate.chat.service.MessageService;
import com.movemate.common.response.ApiResponse;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getUserConversations(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<ConversationDto> conversations = conversationService.getUserConversations(currentUser);
        return ResponseEntity.ok(ApiResponse.success(conversations, "Conversations retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ConversationDto>> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        ConversationDto conversation = conversationService.createOrGetDirectConversation(currentUser, request.getRecipientId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(conversation, "Conversation retrieved or created successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ConversationDto>> getConversation(
            @PathVariable("id") Long id,
            Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        ConversationDto conversation = conversationService.getConversationById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(conversation, "Conversation retrieved successfully"));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<Page<MessageDto>>> getConversationMessages(
            @PathVariable("id") Long id,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "30") int size,
            Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        Page<MessageDto> messages = messageService.getConversationMessages(id, currentUser, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(messages, "Messages retrieved successfully"));
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            @PathVariable("id") Long id,
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        MessageDto message = messageService.sendMessage(id, currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(message, "Message sent successfully"));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable("id") Long id,
            Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        messageService.markConversationAsRead(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Conversation marked as read"));
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user not found"));
    }
}
