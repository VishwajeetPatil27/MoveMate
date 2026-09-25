package com.movemate.event.service;

import com.movemate.community.entity.Community;
import com.movemate.community.entity.CommunityMember;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.event.dto.CreateEventRequest;
import com.movemate.event.dto.EventDto;
import com.movemate.event.dto.UpdateEventRequest;
import com.movemate.event.entity.Event;
import com.movemate.event.entity.EventMember;
import com.movemate.event.entity.EventStatus;
import com.movemate.event.entity.RsvpStatus;
import com.movemate.event.repository.EventMemberRepository;
import com.movemate.event.repository.EventRepository;
import com.movemate.notification.entity.NotificationType;
import com.movemate.notification.service.NotificationService;
import com.movemate.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final NotificationService notificationService;

    public EventService(
            EventRepository eventRepository,
            EventMemberRepository eventMemberRepository,
            CommunityRepository communityRepository,
            CommunityMemberRepository communityMemberRepository,
            NotificationService notificationService
    ) {
        this.eventRepository = eventRepository;
        this.eventMemberRepository = eventMemberRepository;
        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public EventDto createEvent(CreateEventRequest req, User currentUser) {
        Community community = communityRepository.findById(req.getCommunityId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found with ID: " + req.getCommunityId()));

        Event event = new Event(community, currentUser, sanitizeHtml(req.getTitle()), sanitizeHtml(req.getLocation()), req.getEventDate());
        event.setDescription(sanitizeHtml(req.getDescription()));
        if (req.getCapacity() != null && req.getCapacity() > 0) {
            event.setCapacity(req.getCapacity());
        }

        Event saved = eventRepository.save(event);

        // Creator automatically joins as ATTENDING
        EventMember creatorMember = new EventMember(saved, currentUser, RsvpStatus.ATTENDING);
        eventMemberRepository.save(creatorMember);

        // Trigger EVENT_CREATED notifications for community members
        List<CommunityMember> members = communityMemberRepository.findActiveMembersByCommunityId(community.getId());
        for (CommunityMember cm : members) {
            if (!cm.getUser().getId().equals(currentUser.getId())) {
                notificationService.createNotification(
                        cm.getUser(),
                        NotificationType.EVENT_CREATED,
                        "New Community Event: " + saved.getTitle(),
                        currentUser.getProfile() != null && currentUser.getProfile().getFullName() != null
                                ? currentUser.getProfile().getFullName() + " created an upcoming event in " + community.getName()
                                : "A new event was created in " + community.getName(),
                        saved.getId()
                );
            }
        }

        return mapToDto(saved, currentUser);
    }

    @Transactional(readOnly = true)
    public Page<EventDto> searchEvents(Long communityId, String city, String search, EventStatus status, User currentUser, Pageable pageable) {
        Page<Event> page = eventRepository.searchEvents(status != null ? status : EventStatus.UPCOMING, communityId, city, search, pageable);
        List<EventDto> dtos = page.getContent().stream()
                .map(e -> mapToDto(e, currentUser))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public EventDto getEventById(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: " + id));

        return mapToDto(event, currentUser);
    }

    @Transactional
    public EventDto updateEvent(Long id, UpdateEventRequest req, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: " + id));

        // Event Creator Ownership Security Authorization Check
        if (!event.getCreator().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to edit this community event");
        }

        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            event.setTitle(sanitizeHtml(req.getTitle()));
        }
        if (req.getDescription() != null) {
            event.setDescription(sanitizeHtml(req.getDescription()));
        }
        if (req.getLocation() != null && !req.getLocation().isBlank()) {
            event.setLocation(sanitizeHtml(req.getLocation()));
        }
        if (req.getEventDate() != null) {
            event.setEventDate(req.getEventDate());
        }
        if (req.getCapacity() != null && req.getCapacity() > 0) {
            event.setCapacity(req.getCapacity());
        }
        if (req.getStatus() != null) {
            event.setStatus(req.getStatus());
        }

        Event updated = eventRepository.save(event);
        return mapToDto(updated, currentUser);
    }

    @Transactional
    public EventDto cancelEvent(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: " + id));

        // Event Creator Ownership Security Authorization Check
        if (!event.getCreator().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to cancel this community event");
        }

        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.save(event);

        return mapToDto(saved, currentUser);
    }

    @Transactional
    public EventDto rsvpEvent(Long id, RsvpStatus rsvpStatus, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: " + id));

        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot join a cancelled event");
        }

        long currentAttendees = eventMemberRepository.countByEventIdAndStatus(id, RsvpStatus.ATTENDING);
        if (rsvpStatus == RsvpStatus.ATTENDING && event.getCapacity() != null && currentAttendees >= event.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event capacity has been reached");
        }

        Optional<EventMember> existing = eventMemberRepository.findByEventIdAndUserId(id, currentUser.getId());
        if (existing.isPresent()) {
            EventMember member = existing.get();
            member.setStatus(rsvpStatus != null ? rsvpStatus : RsvpStatus.ATTENDING);
            eventMemberRepository.save(member);
        } else {
            EventMember newMember = new EventMember(event, currentUser, rsvpStatus != null ? rsvpStatus : RsvpStatus.ATTENDING);
            eventMemberRepository.save(newMember);
        }

        return mapToDto(event, currentUser);
    }

    @Transactional
    public EventDto leaveEvent(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: " + id));

        eventMemberRepository.deleteByEventIdAndUserId(id, currentUser.getId());
        return mapToDto(event, currentUser);
    }

    @Transactional(readOnly = true)
    public Page<EventDto> getUserEvents(User currentUser, Pageable pageable) {
        Page<EventMember> page = eventMemberRepository.findByUserIdOrderByJoinedAtDesc(currentUser.getId(), pageable);
        List<EventDto> dtos = page.getContent().stream()
                .map(em -> mapToDto(em.getEvent(), currentUser))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    public EventDto mapToDto(Event e, User currentUser) {
        EventDto dto = new EventDto();
        dto.setId(e.getId());
        dto.setCommunityId(e.getCommunity().getId());
        dto.setCommunityName(e.getCommunity().getName());
        dto.setCommunitySlug(e.getCommunity().getSlug());

        dto.setCreatorId(e.getCreator().getId());
        dto.setCreatorName(e.getCreator().getProfile() != null && e.getCreator().getProfile().getFullName() != null
                ? e.getCreator().getProfile().getFullName() : e.getCreator().getEmail());

        dto.setTitle(e.getTitle());
        dto.setDescription(e.getDescription());
        dto.setLocation(e.getLocation());
        dto.setEventDate(e.getEventDate());
        dto.setCapacity(e.getCapacity());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());

        long attendeeCount = eventMemberRepository.countByEventIdAndStatus(e.getId(), RsvpStatus.ATTENDING);
        dto.setAttendeeCount(attendeeCount);

        if (currentUser != null) {
            Optional<EventMember> memberOpt = eventMemberRepository.findByEventIdAndUserId(e.getId(), currentUser.getId());
            if (memberOpt.isPresent()) {
                dto.setAttending(memberOpt.get().getStatus() == RsvpStatus.ATTENDING);
                dto.setUserRsvpStatus(memberOpt.get().getStatus());
            } else {
                dto.setAttending(false);
                dto.setUserRsvpStatus(null);
            }
        } else {
            dto.setAttending(false);
            dto.setUserRsvpStatus(null);
        }

        return dto;
    }

    private String sanitizeHtml(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "").trim();
    }
}
