package com.movemate.admin;

import com.movemate.admin.dto.PlatformAnalyticsDto;
import com.movemate.admin.dto.ReportResolutionRequest;
import com.movemate.admin.dto.UserStatusUpdateRequest;
import com.movemate.admin.service.AdminService;
import com.movemate.admin.service.AuditLogService;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.community.entity.Report;
import com.movemate.community.entity.ReportStatus;
import com.movemate.community.entity.ReportTargetType;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.community.repository.ReportRepository;
import com.movemate.event.repository.EventRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.notification.repository.NotificationRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private CommunityRepository communityRepository;
    @Mock private PostRepository postRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private MessageRepository messageRepository;
    @Mock private AccommodationRepository accommodationRepository;
    @Mock private RecommendationRepository recommendationRepository;
    @Mock private EventRepository eventRepository;
    @Mock private ReportRepository reportRepository;
    @Mock private NotificationRepository notificationRepository;
    @Mock private AuditLogService auditLogService;

    @InjectMocks
    private AdminService adminService;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        adminUser = new User("admin@movemate.com", "hash", Role.ADMIN, AccountStatus.ACTIVE);
        adminUser.setId(1L);

        regularUser = new User("user@movemate.com", "hash", Role.USER, AccountStatus.ACTIVE);
        regularUser.setId(2L);
    }

    @Test
    void getPlatformAnalytics_Success() {
        when(userRepository.count()).thenReturn(10L);
        when(userRepository.findAll()).thenReturn(List.of(regularUser));
        when(communityRepository.count()).thenReturn(3L);
        when(postRepository.count()).thenReturn(15L);
        when(commentRepository.count()).thenReturn(25L);
        when(messageRepository.count()).thenReturn(50L);
        when(accommodationRepository.count()).thenReturn(8L);
        when(recommendationRepository.count()).thenReturn(12L);
        when(eventRepository.count()).thenReturn(5L);
        when(reportRepository.countByStatus(ReportStatus.PENDING)).thenReturn(2L);
        when(notificationRepository.count()).thenReturn(30L);

        PlatformAnalyticsDto analytics = adminService.getPlatformAnalytics();

        assertNotNull(analytics);
        assertEquals(10L, analytics.getTotalUsers());
        assertEquals(3L, analytics.getTotalCommunities());
        assertEquals(2L, analytics.getPendingReports());
    }

    @Test
    void updateUserStatus_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(regularUser));
        when(userRepository.save(any(User.class))).thenReturn(regularUser);

        UserStatusUpdateRequest req = new UserStatusUpdateRequest(AccountStatus.SUSPENDED, "Terms violation");
        User result = adminService.updateUserStatus(2L, req, adminUser);

        assertNotNull(result);
        assertEquals(AccountStatus.SUSPENDED, result.getStatus());
        verify(auditLogService, times(1)).recordAction(eq(adminUser), eq("UPDATE_USER_STATUS"), eq("USER"), eq(2L), anyString());
    }

    @Test
    void resolveReport_Success() {
        Report report = new Report(regularUser, ReportTargetType.POST, 100L, "SPAM", "Spam post");
        report.setId(5L);

        when(reportRepository.findById(5L)).thenReturn(Optional.of(report));
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        ReportResolutionRequest req = new ReportResolutionRequest(ReportStatus.RESOLVED, "Post Removed", "Violates guidelines");
        Report resolved = adminService.resolveReport(5L, req, adminUser);

        assertNotNull(resolved);
        assertEquals(ReportStatus.RESOLVED, resolved.getStatus());
        verify(auditLogService, times(1)).recordAction(eq(adminUser), eq("RESOLVE_REPORT"), eq("POST"), eq(100L), anyString());
    }
}
