package com.movemate.admin.controller;

import com.movemate.admin.dto.AuditLogDto;
import com.movemate.admin.dto.PlatformAnalyticsDto;
import com.movemate.admin.dto.ReportResolutionRequest;
import com.movemate.admin.dto.UserStatusUpdateRequest;
import com.movemate.admin.service.AdminService;
import com.movemate.admin.service.AuditLogService;
import com.movemate.common.response.ApiResponse;
import com.movemate.community.entity.Report;
import com.movemate.community.entity.ReportStatus;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuditLogService auditLogService;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService, AuditLogService auditLogService, UserRepository userRepository) {
        this.adminService = adminService;
        this.auditLogService = auditLogService;
        this.userRepository = userRepository;
    }

    private User getRequiredCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User profile not found"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<PlatformAnalyticsDto>> getPlatformAnalytics() {
        PlatformAnalyticsDto analytics = adminService.getPlatformAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics, "Platform analytics retrieved successfully"));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<User> users = adminService.getUsers(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(users, "Users retrieved successfully"));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusUpdateRequest request,
            Authentication authentication) {
        User adminUser = getRequiredCurrentUser(authentication);
        User updated = adminService.updateUserStatus(id, request, adminUser);
        return ResponseEntity.ok(ApiResponse.success(updated, "User status updated successfully"));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Page<Report>>> getReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Report> reports = adminService.getReports(status, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(reports, "Moderation reports retrieved successfully"));
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<ApiResponse<Report>> resolveReport(
            @PathVariable Long id,
            @Valid @RequestBody ReportResolutionRequest request,
            Authentication authentication) {
        User adminUser = getRequiredCurrentUser(authentication);
        Report resolved = adminService.resolveReport(id, request, adminUser);
        return ResponseEntity.ok(ApiResponse.success(resolved, "Report status updated successfully"));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<Page<AuditLogDto>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<AuditLogDto> logs = auditLogService.getAuditLogs(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(logs, "Audit logs retrieved successfully"));
    }
}
