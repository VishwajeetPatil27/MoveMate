package com.movemate.community.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.community.dto.CommentDto;
import com.movemate.community.dto.CreateReportRequest;
import com.movemate.community.dto.ReportDto;
import com.movemate.community.dto.UpdateCommentRequest;
import com.movemate.community.entity.ReportTargetType;
import com.movemate.community.service.CommentService;
import com.movemate.community.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {

    private final CommentService commentService;
    private final ReportService reportService;

    public CommentController(CommentService commentService, ReportService reportService) {
        this.commentService = commentService;
        this.reportService = reportService;
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentDto>> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommentRequest request,
            Authentication authentication
    ) {
        CommentDto updated = commentService.updateComment(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Comment updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentDto>> deleteComment(
            @PathVariable Long id,
            Authentication authentication
    ) {
        CommentDto deleted = commentService.deleteComment(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(deleted, "Comment deleted successfully"));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<ApiResponse<ReportDto>> reportComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateReportRequest request,
            Authentication authentication
    ) {
        request.setTargetType(ReportTargetType.COMMENT);
        request.setTargetId(id);
        ReportDto report = reportService.submitReport(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(report, "Comment reported successfully"));
    }
}
