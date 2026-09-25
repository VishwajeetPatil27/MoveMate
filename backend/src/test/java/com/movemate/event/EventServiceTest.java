package com.movemate.event;

import com.movemate.community.entity.Community;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.event.dto.CreateEventRequest;
import com.movemate.event.dto.EventDto;
import com.movemate.event.dto.UpdateEventRequest;
import com.movemate.event.entity.Event;
import com.movemate.event.entity.EventMember;
import com.movemate.event.entity.EventStatus;
import com.movemate.event.repository.EventMemberRepository;
import com.movemate.event.repository.EventRepository;
import com.movemate.event.service.EventService;
import com.movemate.notification.service.NotificationService;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private EventMemberRepository eventMemberRepository;

    @Mock
    private CommunityRepository communityRepository;

    @Mock
    private CommunityMemberRepository communityMemberRepository;

    @Mock
    private NotificationService notificationService;

    private EventService eventService;

    private User creator;
    private Community community;

    @BeforeEach
    void setUp() {
        eventService = new EventService(eventRepository, eventMemberRepository, communityRepository, communityMemberRepository, notificationService);

        creator = new User("creator@test.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        creator.setId(1L);

        community = new Community();
        community.setId(10L);
        community.setName("Pune Tech");
    }

    @Test
    void createEvent_Success() {
        CreateEventRequest req = new CreateEventRequest();
        req.setCommunityId(10L);
        req.setTitle("Pune IT Meetup");
        req.setLocation("Hinjawadi Phase 1");
        req.setEventDate(LocalDateTime.now().plusDays(5));
        req.setCapacity(40);

        Event savedEvent = new Event(community, creator, "Pune IT Meetup", "Hinjawadi Phase 1", req.getEventDate());
        savedEvent.setId(100L);

        when(communityRepository.findById(10L)).thenReturn(Optional.of(community));
        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);
        when(communityMemberRepository.findActiveMembersByCommunityId(10L)).thenReturn(Collections.emptyList());

        EventDto dto = eventService.createEvent(req, creator);

        assertNotNull(dto);
        assertEquals(100L, dto.getId());
        assertEquals("Pune IT Meetup", dto.getTitle());

        verify(eventRepository, times(1)).save(any(Event.class));
        verify(eventMemberRepository, times(1)).save(any(EventMember.class));
    }

    @Test
    void updateEvent_Forbidden_WhenNotCreator() {
        User otherUser = new User("other@test.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        otherUser.setId(2L);

        Event event = new Event(community, creator, "Pune IT Meetup", "Hinjawadi", LocalDateTime.now().plusDays(5));
        event.setId(100L);

        when(eventRepository.findById(100L)).thenReturn(Optional.of(event));

        UpdateEventRequest req = new UpdateEventRequest();
        req.setTitle("Updated Title");

        assertThrows(ResponseStatusException.class, () -> eventService.updateEvent(100L, req, otherUser));
    }
}
