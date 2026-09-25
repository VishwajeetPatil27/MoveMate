package com.movemate.event.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.event.dto.CreateEventRequest;
import com.movemate.event.dto.EventDto;
import com.movemate.event.dto.UpdateEventRequest;
import com.movemate.event.entity.EventStatus;
import com.movemate.event.entity.RsvpStatus;
import com.movemate.event.service.EventService;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<EventDto>>> searchEvents(
            @RequestParam(required = false) Long communityId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication
    ) {
        User currentUser = getOptionalCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "eventDate"));
        Page<EventDto> events = eventService.searchEvents(communityId, city, search, status, currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(events, "Events retrieved successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<EventDto>>> getUserEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication
    ) {
        User currentUser = getRequiredCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<EventDto> events = eventService.getUserEvents(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(events, "User events retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventDto>> getEventById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = getOptionalCurrentUser(authentication);
        EventDto event = eventService.getEventById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(event, "Event details retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EventDto>> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            Authentication authentication
    ) {
        User currentUser = getRequiredCurrentUser(authentication);
        EventDto event = eventService.createEvent(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(event, "Community event created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventDto>> updateEvent(
            @PathVariable Long id,
            @RequestBody UpdateEventRequest request,
            Authentication authentication
    ) {
        User currentUser = getRequiredCurrentUser(authentication);
        EventDto event = eventService.updateEvent(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(event, "Event updated successfully"));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<EventDto>> cancelEvent(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = getRequiredCurrentUser(authentication);
        EventDto event = eventService.cancelEvent(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(event, "Event cancelled successfully"));
    }

    @PostMapping("/{id}/rsvp")
    public ResponseEntity<ApiResponse<EventDto>> rsvpEvent(
            @PathVariable Long id,
            @RequestParam(defaultValue = "ATTENDING") RsvpStatus status,
            Authentication authentication
    ) {
        User currentUser = getRequiredCurrentUser(authentication);
        EventDto event = eventService.rsvpEvent(id, status, currentUser);
        return ResponseEntity.ok(ApiResponse.success(event, "RSVP status updated successfully"));
    }

    @DeleteMapping("/{id}/rsvp")
    public ResponseEntity<ApiResponse<EventDto>> leaveEvent(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = getRequiredCurrentUser(authentication);
        EventDto event = eventService.leaveEvent(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(event, "Successfully left event"));
    }

    private User getRequiredCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private User getOptionalCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }
}
