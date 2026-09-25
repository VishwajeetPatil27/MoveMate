package com.movemate.housing;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.repository.LikeRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.housing.dto.CreateAccommodationRequest;
import com.movemate.housing.dto.UpdateAccommodationRequest;
import com.movemate.housing.entity.Accommodation;
import com.movemate.housing.entity.AccommodationType;
import com.movemate.housing.repository.AccommodationFavoriteRepository;
import com.movemate.housing.repository.AccommodationImageRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.notification.repository.NotificationRepository;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.security.JwtTokenProvider;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.ProfileRepository;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AccommodationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private RelocationRequestRepository relocationRequestRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private CommunityMemberRepository communityMemberRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationMemberRepository conversationMemberRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private AccommodationRepository accommodationRepository;

    @Autowired
    private AccommodationImageRepository accommodationImageRepository;

    @Autowired
    private AccommodationFavoriteRepository accommodationFavoriteRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private com.movemate.event.repository.EventMemberRepository eventMemberRepository;

    @Autowired
    private com.movemate.event.repository.EventRepository eventRepository;

    @Autowired
    private com.movemate.admin.repository.AuditLogRepository auditLogRepository;

    @Autowired
    private com.movemate.community.repository.ReportRepository reportRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User owner;
    private User otherUser;
    private Location location;
    private Accommodation accommodation;
    private String ownerToken;
    private String otherUserToken;

    @BeforeEach
    void setUp() {
        auditLogRepository.deleteAll();
        reportRepository.deleteAll();
        notificationRepository.deleteAll();
        eventMemberRepository.deleteAll();
        eventRepository.deleteAll();
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

        owner = new User("owner@test.com", passwordEncoder.encode("Password123!"), Role.USER, AccountStatus.ACTIVE);
        owner = userRepository.save(owner);

        otherUser = new User("other@test.com", passwordEncoder.encode("Password123!"), Role.USER, AccountStatus.ACTIVE);
        otherUser = userRepository.save(otherUser);

        location = new Location("India", "Maharashtra", "Pune", "Hinjawadi");
        location = locationRepository.save(location);

        accommodation = new Accommodation(owner, "Spacious 1BHK Flat", "Near Hinjawadi Phase 1", AccommodationType.FLAT, new BigDecimal("14000.00"), new BigDecimal("30000.00"), location);
        accommodation = accommodationRepository.save(accommodation);

        ownerToken = tokenProvider.generateToken(owner.getEmail(), owner.getId(), owner.getRole().name());
        otherUserToken = tokenProvider.generateToken(otherUser.getEmail(), otherUser.getId(), otherUser.getRole().name());
    }

    @Test
    @DisplayName("GET /api/v1/accommodations - Public search returns 200 OK")
    void searchAccommodations_Public_Returns200() throws Exception {
        mockMvc.perform(get("/api/v1/accommodations")
                        .param("city", "Pune")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("Spacious 1BHK Flat"));
    }

    @Test
    @DisplayName("POST /api/v1/accommodations - Creates new accommodation listing returns 201 Created")
    void createAccommodation_Authenticated_Returns201() throws Exception {
        CreateAccommodationRequest req = new CreateAccommodationRequest();
        req.setTitle("Single Room PG");
        req.setDescription("With food & wifi");
        req.setType(AccommodationType.PG);
        req.setRent(new BigDecimal("8000.00"));
        req.setLocationId(location.getId());

        mockMvc.perform(post("/api/v1/accommodations")
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Single Room PG"));
    }

    @Test
    @DisplayName("PUT /api/v1/accommodations/{id} - Returns 403 Forbidden when user is not owner")
    void updateAccommodation_Forbidden_WhenNotOwner() throws Exception {
        UpdateAccommodationRequest updateReq = new UpdateAccommodationRequest();
        updateReq.setTitle("Hacked Title");

        mockMvc.perform(put("/api/v1/accommodations/" + accommodation.getId())
                        .header("Authorization", "Bearer " + otherUserToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /api/v1/accommodations/{id}/favorite - Toggles favorite status")
    void toggleFavorite_Authenticated_Returns200() throws Exception {
        mockMvc.perform(post("/api/v1/accommodations/" + accommodation.getId() + "/favorite")
                        .header("Authorization", "Bearer " + otherUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.isFavorite").value(true));
    }
}
