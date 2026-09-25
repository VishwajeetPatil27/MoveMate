package com.movemate.community.dto;

import com.movemate.community.entity.Comment;
import com.movemate.community.entity.CommentStatus;

import java.time.LocalDateTime;

public class CommentDto {

    private Long id;
    private Long postId;
    private Long authorId;
    private String authorName;
    private String authorProfession;
    private String content;
    private CommentStatus status;
    private boolean canEdit;
    private boolean canDelete;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentDto() {
    }

    public static CommentDto fromEntity(Comment comment, Long currentUserId) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        if (comment.getPost() != null) {
            dto.setPostId(comment.getPost().getId());
        }
        if (comment.getAuthor() != null) {
            dto.setAuthorId(comment.getAuthor().getId());
            dto.setAuthorName(comment.getAuthor().getEmail());
            if (comment.getAuthor().getProfile() != null) {
                if (comment.getAuthor().getProfile().getFullName() != null && !comment.getAuthor().getProfile().getFullName().isEmpty()) {
                    dto.setAuthorName(comment.getAuthor().getProfile().getFullName());
                }
                dto.setAuthorProfession(comment.getAuthor().getProfile().getProfession());
            }
        }
        dto.setContent(comment.getContent());
        dto.setStatus(comment.getStatus());

        boolean isAuthor = currentUserId != null && comment.getAuthor() != null && currentUserId.equals(comment.getAuthor().getId());
        dto.setCanEdit(isAuthor);
        dto.setCanDelete(isAuthor);

        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorProfession() {
        return authorProfession;
    }

    public void setAuthorProfession(String authorProfession) {
        this.authorProfession = authorProfession;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public CommentStatus getStatus() {
        return status;
    }

    public void setStatus(CommentStatus status) {
        this.status = status;
    }

    public boolean isCanEdit() {
        return canEdit;
    }

    public void setCanEdit(boolean canEdit) {
        this.canEdit = canEdit;
    }

    public boolean isCanDelete() {
        return canDelete;
    }

    public void setCanDelete(boolean canDelete) {
        this.canDelete = canDelete;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
