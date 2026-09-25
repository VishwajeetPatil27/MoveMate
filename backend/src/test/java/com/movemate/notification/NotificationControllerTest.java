package com.movemate.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.community.repository.*;
import com.movemate.event.repository.EventMemberRepository;
import com.movemate.event.repository.EventRepository;
import com.movemate.housing.repository.AccommodationFavoriteRepository;
import com.movemate.housing.repository.AccommodationImageRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.notification.entity.Notification;
import com.movemate.notification.entity.NotificationType;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

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

    private User testUser;
    private String jwtToken;
    private Notification testNotification;

    @BeforeEach
    void setUp() {
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

        testUser = new User("notifuser@test.com", passwordEncoder.encode("Password123!"), Role.USER, AccountStatus.ACTIVE);
        testUser = userRepository.save(testUser);

        jwtToken = tokenProvider.generateToken(testUser.getEmail(), testUser.getId(), testUser.getRole().name());

        testNotification = new Notification(testUser, NotificationType.POST_LIKED, "Post Liked", "Someone liked your post", 1L);
        testNotification = notificationRepository.save(testNotification);
    }

    @Test
    void getUserNotifications_Success() throws Exception {
        mockMvc.perform(get("/api/v1/notifications")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("Post Liked"));
    }

    @Test
    void getUnreadCount_Success() throws Exception {
        mockMvc.perform(get("/api/v1/notifications/unread-count")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.unreadCount").value(1));
    }

    @Test
    void markAsRead_Success() throws Exception {
        mockMvc.perform(put("/api/v1/notifications/" + testNotification.getId() + "/read")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.read").value(true));
    }
}
