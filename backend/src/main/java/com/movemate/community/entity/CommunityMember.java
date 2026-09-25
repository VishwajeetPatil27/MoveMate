package com.movemate.community.entity;

import com.movemate.common.entity.BaseEntity;
import com.movemate.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "community_members", uniqueConstraints = {
        @UniqueConstraint(name = "uk_community_user", columnNames = {"community_id", "user_id"})
}, indexes = {
        @Index(name = "idx_cm_community", columnList = "community_id"),
        @Index(name = "idx_cm_user", columnList = "user_id")
})
public class CommunityMember extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private CommunityMemberRole role = CommunityMemberRole.MEMBER;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CommunityMemberStatus status = CommunityMemberStatus.ACTIVE;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public CommunityMember() {
    }

    public CommunityMember(Community community, User user, CommunityMemberRole role) {
        this.community = community;
        this.user = user;
        this.role = role;
        this.status = CommunityMemberStatus.ACTIVE;
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Community getCommunity() {
        return community;
    }

    public void setCommunity(Community community) {
        this.community = community;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CommunityMemberRole getRole() {
        return role;
    }

    public void setRole(CommunityMemberRole role) {
        this.role = role;
    }

    public CommunityMemberStatus getStatus() {
        return status;
    }

    public void setStatus(CommunityMemberStatus status) {
        this.status = status;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
