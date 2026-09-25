package com.movemate.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.admin.dto.ReportResolutionRequest;
import com.movemate.admin.dto.UserStatusUpdateRequest;
import com.movemate.admin.repository.AuditLogRepository;
import com.movemate.community.entity.Report;
import com.movemate.community.entity.ReportStatus;
import com.movemate.community.entity.ReportTargetType;
import com.movemate.community.repository.ReportRepository;
import com.movemate.security.JwtTokenProvider;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private ReportRepository reportRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private JwtTokenProvider tokenProvider;
    @Autowired private ObjectMapper objectMapper;

    private User adminUser;
    private User regularUser;
    private String adminToken;
    private String userToken;
    private Report testReport;

    @BeforeEach
    void setUp() {
        auditLogRepository.deleteAll();
        reportRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = new User("admin@movemate.com", "hash", Role.ADMIN, AccountStatus.ACTIVE);
        adminUser = userRepository.save(adminUser);
        adminToken = tokenProvider.generateToken(adminUser.getEmail(), adminUser.getId(), adminUser.getRole().name());

        regularUser = new User("user@movemate.com", "hash", Role.USER, AccountStatus.ACTIVE);
        regularUser = userRepository.save(regularUser);
        userToken = tokenProvider.generateToken(regularUser.getEmail(), regularUser.getId(), regularUser.getRole().name());

        testReport = new Report(regularUser, ReportTargetType.POST, 50L, "SPAM", "Spam discussion");
        testReport = reportRepository.save(testReport);
    }

    @Test
    void getPlatformAnalytics_Admin_Success() throws Exception {
        mockMvc.perform(get("/api/v1/admin/analytics")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalUsers").value(2));
    }

    @Test
    void getPlatformAnalytics_RegularUser_Forbidden() throws Exception {
        mockMvc.perform(get("/api/v1/admin/analytics")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void updateUserStatus_Admin_Success() throws Exception {
        UserStatusUpdateRequest req = new UserStatusUpdateRequest(AccountStatus.SUSPENDED, "Abuse report");

        mockMvc.perform(put("/api/v1/admin/users/" + regularUser.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("SUSPENDED"));
    }

    @Test
    void resolveReport_Admin_Success() throws Exception {
        ReportResolutionRequest req = new ReportResolutionRequest(ReportStatus.RESOLVED, "Post Removed", "Violates rules");

        mockMvc.perform(put("/api/v1/admin/reports/" + testReport.getId() + "/resolve")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("RESOLVED"));
    }
}
