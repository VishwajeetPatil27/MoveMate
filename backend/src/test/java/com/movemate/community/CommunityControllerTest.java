package com.movemate.community;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.community.dto.CreateCommunityRequest;
import com.movemate.community.entity.Community;
import com.movemate.community.entity.CommunityCategory;
import com.movemate.community.entity.CommunityMember;
import com.movemate.community.entity.CommunityMemberRole;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.repository.RelocationRequestRepository;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CommunityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RelocationRequestRepository relocationRequestRepository;

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private com.movemate.chat.repository.MessageRepository messageRepository;

    @Autowired
    private com.movemate.chat.repository.ConversationMemberRepository conversationMemberRepository;

    @Autowired
    private com.movemate.chat.repository.ConversationRepository conversationRepository;

    @Autowired
    private CommunityMemberRepository communityMemberRepository;

    @Autowired
    private com.movemate.notification.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.movemate.event.repository.EventMemberRepository eventMemberRepository;

    @Autowired
    private com.movemate.event.repository.EventRepository eventRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.movemate.admin.repository.AuditLogRepository auditLogRepository;

    @Autowired
    private com.movemate.community.repository.ReportRepository reportRepository;

    private User creatorUser;
    private User regularUser;
    private Location originLoc;
    private Location destLoc;
    private Community testCommunity;

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
        communityMemberRepository.deleteAll();
        communityRepository.deleteAll();
        relocationRequestRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();

        creatorUser = new User("commcreator@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        creatorUser = userRepository.save(creatorUser);

        regularUser = new User("commmember@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        regularUser = userRepository.save(regularUser);

        originLoc = locationRepository.findAll().stream().findFirst()
                .orElseGet(() -> locationRepository.save(new Location("India", "Maharashtra", "Sangli", "City Center")));

        destLoc = locationRepository.save(new Location("India", "Maharashtra", "Pune", "Hinjawadi"));

        testCommunity = new Community("Pune Tech Hub", "pune-tech-hub", "Community description", originLoc, destLoc, creatorUser);
        testCommunity.setCategory(CommunityCategory.PROFESSIONAL);
        testCommunity = communityRepository.save(testCommunity);

        CommunityMember leaderMember = new CommunityMember(testCommunity, creatorUser, CommunityMemberRole.LEADER);
        communityMemberRepository.save(leaderMember);
    }

    @Test
    void searchCommunities_Public_Success() throws Exception {
        mockMvc.perform(get("/api/v1/communities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].name").value("Pune Tech Hub"));
    }

    @Test
    @WithMockUser(username = "commcreator@example.com", roles = {"USER"})
    void createCommunity_Success() throws Exception {
        CreateCommunityRequest req = new CreateCommunityRequest();
        req.setName("Mumbai Developers Network");
        req.setDescription("Network for developers moving to Mumbai");
        req.setOriginLocationId(originLoc.getId());
        req.setDestinationLocationId(destLoc.getId());
        req.setCategory(CommunityCategory.PROFESSIONAL);

        mockMvc.perform(post("/api/v1/communities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Mumbai Developers Network"));
    }

    @Test
    @WithMockUser(username = "commmember@example.com", roles = {"USER"})
    void joinCommunity_Success() throws Exception {
        mockMvc.perform(post("/api/v1/communities/" + testCommunity.getId() + "/join"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.joined").value(true));
    }

    @Test
    @WithMockUser(username = "commmember@example.com", roles = {"USER"})
    void leaveCommunity_Success() throws Exception {
        // First join
        CommunityMember m = new CommunityMember(testCommunity, regularUser, CommunityMemberRole.MEMBER);
        communityMemberRepository.save(m);

        mockMvc.perform(delete("/api/v1/communities/" + testCommunity.getId() + "/leave"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.joined").value(false));
    }
}
