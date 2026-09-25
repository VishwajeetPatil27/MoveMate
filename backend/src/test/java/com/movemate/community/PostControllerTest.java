package com.movemate.community;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.community.dto.CreateCommentRequest;
import com.movemate.community.dto.CreatePostRequest;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.repository.LikeRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommunityMemberRepository communityMemberRepository;

    @Autowired
    private com.movemate.chat.repository.MessageRepository messageRepository;

    @Autowired
    private com.movemate.chat.repository.ConversationMemberRepository conversationMemberRepository;

    @Autowired
    private com.movemate.chat.repository.ConversationRepository conversationRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private com.movemate.notification.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.movemate.event.repository.EventMemberRepository eventMemberRepository;

    @Autowired
    private com.movemate.event.repository.EventRepository eventRepository;

    @Autowired
    private com.movemate.admin.repository.AuditLogRepository auditLogRepository;

    @Autowired
    private com.movemate.community.repository.ReportRepository reportRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User authorUser;
    private User otherUser;
    private Community testCommunity;
    private Post testPost;

    @BeforeEach
    void setUp() {
        auditLogRepository.deleteAll();
        reportRepository.deleteAll();
        notificationRepository.deleteAll();
        eventMemberRepository.deleteAll();
        eventRepository.deleteAll();
        messageRepository.deleteAll();
        conversationMemberRepository.deleteAll();
        conversationRepository.deleteAll();
        likeRepository.deleteAll();
        commentRepository.deleteAll();
        postRepository.deleteAll();
        communityMemberRepository.deleteAll();
        communityRepository.deleteAll();
        userRepository.deleteAll();

        authorUser = new User("postauthor@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        authorUser = userRepository.save(authorUser);

        otherUser = new User("postother@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        otherUser = userRepository.save(otherUser);

        Location loc1 = locationRepository.save(new Location("India", "Maharashtra", "Sangli", "Center"));
        Location loc2 = locationRepository.save(new Location("India", "Maharashtra", "Pune", "Hinjawadi"));

        testCommunity = new Community("Pune Relocators", "pune-relocators", "Community", loc1, loc2, authorUser);
        testCommunity = communityRepository.save(testCommunity);

        testPost = new Post(authorUser, testCommunity, "Best areas in Hinjewadi", "Where to rent a 1BHK flat?", PostType.QUESTION);
        testPost = postRepository.save(testPost);
    }

    @Test
    void getCommunityPosts_Public_Success() throws Exception {
        mockMvc.perform(get("/api/v1/communities/" + testCommunity.getId() + "/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].title").value("Best areas in Hinjewadi"));
    }

    @Test
    @WithMockUser(username = "postauthor@example.com", roles = {"USER"})
    void createPost_Success() throws Exception {
        CreatePostRequest req = new CreatePostRequest();
        req.setTitle("Tiffin Services in Wakad");
        req.setContent("Looking for healthy homemade tiffin service delivery.");
        req.setPostType(PostType.HELP);

        mockMvc.perform(post("/api/v1/communities/" + testCommunity.getId() + "/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Tiffin Services in Wakad"));
    }

    @Test
    @WithMockUser(username = "postother@example.com", roles = {"USER"})
    void addComment_Success() throws Exception {
        CreateCommentRequest req = new CreateCommentRequest();
        req.setContent("Wakad Phase 1 has great flat options.");

        mockMvc.perform(post("/api/v1/posts/" + testPost.getId() + "/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").value("Wakad Phase 1 has great flat options."));
    }

    @Test
    @WithMockUser(username = "postother@example.com", roles = {"USER"})
    void toggleLike_Success() throws Exception {
        mockMvc.perform(post("/api/v1/posts/" + testPost.getId() + "/like"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.likedByCurrentUser").value(true))
                .andExpect(jsonPath("$.data.likeCount").value(1));
    }

    @Test
    @WithMockUser(username = "postother@example.com", roles = {"USER"})
    void deletePost_Forbidden_WhenNotAuthor() throws Exception {
        mockMvc.perform(delete("/api/v1/posts/" + testPost.getId()))
                .andExpect(status().isForbidden());
    }
}
