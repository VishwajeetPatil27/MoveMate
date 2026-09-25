package com.movemate.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.community.entity.Community;
import com.movemate.community.repository.*;
import com.movemate.event.dto.CreateEventRequest;
import com.movemate.event.dto.UpdateEventRequest;
import com.movemate.event.entity.Event;
import com.movemate.event.repository.EventMemberRepository;
import com.movemate.event.repository.EventRepository;
import com.movemate.housing.repository.AccommodationFavoriteRepository;
import com.movemate.housing.repository.AccommodationImageRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.notification.repository.NotificationRepository;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.security.JwtTokenProvider;
import com.movemate.services.repository.RecommendationFavoriteRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.ProfileRepository;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RelocationRequestRepository relocationRequestRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EventMemberRepository eventMemberRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RecommendationFavoriteRepository recommendationFavoriteRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private AccommodationFavoriteRepository accommodationFavoriteRepository;

    @Autowired
    private AccommodationImageRepository accommodationImageRepository;

    @Autowired
    private AccommodationRepository accommodationRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationMemberRepository conversationMemberRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommunityMemberRepository communityMemberRepository;

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private com.movemate.admin.repository.AuditLogRepository auditLogRepository;

    @Autowired
    private com.movemate.community.repository.ReportRepository reportRepository;

    private User creator;
    private User otherUser;
    private Community community;
    private String creatorToken;
    private String otherUserToken;
    private Event testEvent;

    @BeforeEach
    void setUp() {
        auditLogRepository.deleteAll();
        reportRepository.deleteAll();
        notificationRepository.deleteAll();
        eventMemberRepository.deleteAll();
        eventRepository.deleteAll();
        recommendationFavoriteRepository.deleteAll();
        recommendationRepository.deleteAll();
        accommodationFavoriteRepository.deleteAll();
        accommodationImageRepository.deleteAll();
        accommodationRepository.deleteAll();
        messageRepository.deleteAll();
        conversationMemberRepository.deleteAll();
        conversationRepository.deleteAll();
        likeRepository.deleteAll();
        commentRepository.deleteAll();
        postRepository.deleteAll();
        communityMemberRepository.deleteAll();
        communityRepository.deleteAll();
        relocationRequestRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();

        creator = new User("eventcreator@test.com", passwordEncoder.encode("Password123!"), Role.USER, AccountStatus.ACTIVE);
        creator = userRepository.save(creator);

        otherUser = new User("otheruser@test.com", passwordEncoder.encode("Password123!"), Role.USER, AccountStatus.ACTIVE);
        otherUser = userRepository.save(otherUser);

        Location origin = locationRepository.save(new Location("India", "Maharashtra", "Sangli", "City Center"));
        Location destination = locationRepository.save(new Location("India", "Maharashtra", "Pune", "Hinjawadi"));

        community = new Community();
        community.setName("Sangli to Pune IT Relocators");
        community.setSlug("sangli-to-pune-it-relocators");
        community.setOriginLocation(origin);
        community.setDestinationLocation(destination);
        community.setCreator(creator);
        community = communityRepository.save(community);

        creatorToken = tokenProvider.generateToken(creator.getEmail(), creator.getId(), creator.getRole().name());
        otherUserToken = tokenProvider.generateToken(otherUser.getEmail(), otherUser.getId(), otherUser.getRole().name());

        testEvent = new Event(community, creator, "Pune IT Meetup", "Hinjawadi", LocalDateTime.now().plusDays(5));
        testEvent = eventRepository.save(testEvent);
    }

    @Test
    void searchEvents_Public_Success() throws Exception {
        mockMvc.perform(get("/api/v1/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("Pune IT Meetup"));
    }

    @Test
    void createEvent_Success() throws Exception {
        CreateEventRequest request = new CreateEventRequest();
        request.setCommunityId(community.getId());
        request.setTitle("Weekend Hiking Meetup");
        request.setLocation("Sinhagad Fort, Pune");
        request.setEventDate(LocalDateTime.now().plusDays(10));
        request.setCapacity(30);

        mockMvc.perform(post("/api/v1/events")
                        .header("Authorization", "Bearer " + creatorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Weekend Hiking Meetup"));
    }

    @Test
    void rsvpEvent_Success() throws Exception {
        mockMvc.perform(post("/api/v1/events/" + testEvent.getId() + "/rsvp")
                        .header("Authorization", "Bearer " + otherUserToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.attending").value(true));
    }

    @Test
    void updateEvent_Forbidden_WhenNotCreator() throws Exception {
        UpdateEventRequest request = new UpdateEventRequest();
        request.setTitle("Unauthorized Edit");

        mockMvc.perform(put("/api/v1/events/" + testEvent.getId())
                        .header("Authorization", "Bearer " + otherUserToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
