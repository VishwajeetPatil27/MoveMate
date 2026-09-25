package com.movemate.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.user.dto.ProfileUpdateRequest;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Profile;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProfileControllerTest {

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
    private com.movemate.notification.repository.NotificationRepository notificationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private Profile testProfile;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        relocationRequestRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User("profilectrl@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        testUser = userRepository.save(testUser);

        testProfile = new Profile(testUser, "Profile Tester");
        testProfile.setBio("Original bio");
        testProfile.setProfession("Architect");
        testProfile = profileRepository.save(testProfile);
    }

    @Test
    @WithMockUser(username = "profilectrl@example.com", roles = {"USER"})
    void getCurrentUserProfile_Success() throws Exception {
        mockMvc.perform(get("/api/v1/profile/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Profile Tester"))
                .andExpect(jsonPath("$.data.profession").value("Architect"));
    }

    @Test
    void getCurrentUserProfile_Unauthorized_WhenNoToken() throws Exception {
        mockMvc.perform(get("/api/v1/profile/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "profilectrl@example.com", roles = {"USER"})
    void updateCurrentUserProfile_Success() throws Exception {
        ProfileUpdateRequest req = new ProfileUpdateRequest();
        req.setFullName("Updated Profile Tester");
        req.setBio("Updated bio info");
        req.setCompany("Innovative Solutions");

        mockMvc.perform(put("/api/v1/profile/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Updated Profile Tester"))
                .andExpect(jsonPath("$.data.bio").value("Updated bio info"))
                .andExpect(jsonPath("$.data.company").value("Innovative Solutions"));
    }

    @Test
    void getPublicProfile_Success() throws Exception {
        mockMvc.perform(get("/api/v1/users/" + testUser.getId() + "/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Profile Tester"));
    }
}
