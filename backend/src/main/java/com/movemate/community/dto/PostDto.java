package com.movemate.community.dto;

import com.movemate.community.entity.Post;
import com.movemate.community.entity.PostStatus;
import com.movemate.community.entity.PostType;

import java.time.LocalDateTime;

public class PostDto {

    private Long id;
    private Long communityId;
    private String communityName;
    private Long authorId;
    private String authorName;
    private String authorProfession;
    private String title;
    private String content;
    private PostType postType;
    private PostStatus status;
    private long likeCount;
    private long commentCount;
    private boolean likedByCurrentUser;
    private boolean canEdit;
    private boolean canDelete;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PostDto() {
    }

    public static PostDto fromEntity(Post post, long likeCount, long commentCount, boolean likedByCurrentUser, Long currentUserId) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        if (post.getCommunity() != null) {
            dto.setCommunityId(post.getCommunity().getId());
            dto.setCommunityName(post.getCommunity().getName());
        }
        if (post.getAuthor() != null) {
            dto.setAuthorId(post.getAuthor().getId());
            dto.setAuthorName(post.getAuthor().getEmail());
            if (post.getAuthor().getProfile() != null) {
                if (post.getAuthor().getProfile().getFullName() != null && !post.getAuthor().getProfile().getFullName().isEmpty()) {
                    dto.setAuthorName(post.getAuthor().getProfile().getFullName());
                }
                dto.setAuthorProfession(post.getAuthor().getProfile().getProfession());
            }
        }
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setPostType(post.getPostType());
        dto.setStatus(post.getStatus());
        dto.setLikeCount(likeCount);
        dto.setCommentCount(commentCount);
        dto.setLikedByCurrentUser(likedByCurrentUser);

        boolean isAuthor = currentUserId != null && post.getAuthor() != null && currentUserId.equals(post.getAuthor().getId());
        dto.setCanEdit(isAuthor);
        dto.setCanDelete(isAuthor);

        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCommunityId() {
        return communityId;
    }

    public void setCommunityId(Long communityId) {
        this.communityId = communityId;
    }

    public String getCommunityName() {
        return communityName;
    }

    public void setCommunityName(String communityName) {
        this.communityName = communityName;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public PostType getPostType() {
        return postType;
    }

    public void setPostType(PostType postType) {
        this.postType = postType;
    }

    public PostStatus getStatus() {
        return status;
    }

    public void setStatus(PostStatus status) {
        this.status = status;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(long commentCount) {
        this.commentCount = commentCount;
    }

    public boolean isLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
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
