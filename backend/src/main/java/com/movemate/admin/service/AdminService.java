package com.movemate.admin.service;

import com.movemate.admin.dto.PlatformAnalyticsDto;
import com.movemate.admin.dto.ReportResolutionRequest;
import com.movemate.admin.dto.UserStatusUpdateRequest;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.community.entity.Report;
import com.movemate.community.entity.ReportStatus;
import com.movemate.community.repository.CommentRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.repository.PostRepository;
import com.movemate.community.repository.ReportRepository;
import com.movemate.event.repository.EventRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.notification.repository.NotificationRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final MessageRepository messageRepository;
    private final AccommodationRepository accommodationRepository;
    private final RecommendationRepository recommendationRepository;
    private final EventRepository eventRepository;
    private final ReportRepository reportRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogService auditLogService;

    public AdminService(
            UserRepository userRepository,
            CommunityRepository communityRepository,
            PostRepository postRepository,
            CommentRepository commentRepository,
            MessageRepository messageRepository,
            AccommodationRepository accommodationRepository,
            RecommendationRepository recommendationRepository,
            EventRepository eventRepository,
            ReportRepository reportRepository,
            NotificationRepository notificationRepository,
            AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.communityRepository = communityRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.messageRepository = messageRepository;
        this.accommodationRepository = accommodationRepository;
        this.recommendationRepository = recommendationRepository;
        this.eventRepository = eventRepository;
        this.reportRepository = reportRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public PlatformAnalyticsDto getPlatformAnalytics() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.findAll().stream()
                .filter(u -> u.getStatus() == AccountStatus.ACTIVE)
                .count();

        long totalCommunities = communityRepository.count();
        long totalPosts = postRepository.count();
        long totalComments = commentRepository.count();
        long totalMessages = messageRepository.count();
        long totalAccommodations = accommodationRepository.count();
        long totalServices = recommendationRepository.count();
        long totalEvents = eventRepository.count();
        long pendingReports = reportRepository.countByStatus(ReportStatus.PENDING);
        long totalNotifications = notificationRepository.count();

        return new PlatformAnalyticsDto(
                totalUsers, activeUsers, totalCommunities,
                totalPosts, totalComments, totalMessages,
                totalAccommodations, totalServices, totalEvents,
                pendingReports, totalNotifications
        );
    }

    @Transactional(readOnly = true)
    public Page<User> getUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Transactional
    public User updateUserStatus(Long userId, UserStatusUpdateRequest request, User adminUser) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id " + userId));

        AccountStatus oldStatus = user.getStatus();
        user.setStatus(request.getStatus());
        User updatedUser = userRepository.save(user);

        auditLogService.recordAction(
                adminUser,
                "UPDATE_USER_STATUS",
                "USER",
                userId,
                "Status changed from " + oldStatus + " to " + request.getStatus() + ". Reason: " + (request.getReason() != null ? request.getReason() : "None provided")
        );

        return updatedUser;
    }

    @Transactional(readOnly = true)
    public Page<Report> getReports(ReportStatus status, Pageable pageable) {
        if (status != null) {
            return reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        }
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public Report resolveReport(Long reportId, ReportResolutionRequest request, User adminUser) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found with id " + reportId));

        report.setStatus(request.getStatus());
        Report savedReport = reportRepository.save(report);

        auditLogService.recordAction(
                adminUser,
                "RESOLVE_REPORT",
                report.getTargetType().name(),
                report.getTargetId(),
                "Report #" + reportId + " status updated to " + request.getStatus() + ". Action: " + request.getResolutionAction() + ". Notes: " + request.getAdminNotes()
        );

        return savedReport;
    }
}
