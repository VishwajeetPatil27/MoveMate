package com.movemate.community.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.community.dto.*;
import com.movemate.community.entity.PostType;
import com.movemate.community.entity.ReportTargetType;
import com.movemate.community.service.CommentService;
import com.movemate.community.service.LikeService;
import com.movemate.community.service.PostService;
import com.movemate.community.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;
    private final LikeService likeService;
    private final ReportService reportService;

    public PostController(PostService postService,
                          CommentService commentService,
                          LikeService likeService,
                          ReportService reportService) {
        this.postService = postService;
        this.commentService = commentService;
        this.likeService = likeService;
        this.reportService = reportService;
    }

    @GetMapping("/communities/{communityId}/posts")
    public ResponseEntity<ApiResponse<Page<PostDto>>> getCommunityPosts(
            @PathVariable Long communityId,
            @RequestParam(required = false) PostType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PostDto> posts = postService.getCommunityPosts(communityId, type, pageable, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.success(posts, "Community feed fetched successfully"));
    }

    @PostMapping("/communities/{communityId}/posts")
    public ResponseEntity<ApiResponse<PostDto>> createPost(
            @PathVariable Long communityId,
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication
    ) {
        PostDto created = postService.createPost(authentication.getName(), communityId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Post created successfully"));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<PostDto>> getPostById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        PostDto post = postService.getPostById(id, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.success(post, "Post details fetched successfully"));
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<PostDto>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request,
            Authentication authentication
    ) {
        PostDto updated = postService.updatePost(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Post updated successfully"));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<ApiResponse<PostDto>> deletePost(
            @PathVariable Long id,
            Authentication authentication
    ) {
        PostDto deleted = postService.deletePost(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(deleted, "Post deleted successfully"));
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<ApiResponse<PostDto>> likeOrTogglePost(
            @PathVariable Long id,
            Authentication authentication
    ) {
        PostDto result = likeService.toggleLike(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(result, "Post reaction updated successfully"));
    }

    @DeleteMapping("/posts/{id}/like")
    public ResponseEntity<ApiResponse<PostDto>> unlikePost(
            @PathVariable Long id,
            Authentication authentication
    ) {
        PostDto result = likeService.unlikePost(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(result, "Post reaction removed successfully"));
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getPostComments(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        List<CommentDto> comments = commentService.getPostComments(id, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.success(comments, "Post comments fetched successfully"));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentRequest request,
            Authentication authentication
    ) {
        CommentDto created = commentService.addComment(authentication.getName(), id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Comment added successfully"));
    }

    @PostMapping("/posts/{id}/report")
    public ResponseEntity<ApiResponse<ReportDto>> reportPost(
            @PathVariable Long id,
            @Valid @RequestBody CreateReportRequest request,
            Authentication authentication
    ) {
        request.setTargetType(ReportTargetType.POST);
        request.setTargetId(id);
        ReportDto report = reportService.submitReport(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(report, "Post reported successfully"));
    }
}
