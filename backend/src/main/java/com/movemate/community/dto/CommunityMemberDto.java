package com.movemate.community.dto;

import com.movemate.community.entity.CommunityMember;
import com.movemate.community.entity.CommunityMemberRole;
import com.movemate.community.entity.CommunityMemberStatus;

import java.time.LocalDateTime;

public class CommunityMemberDto {

    private Long id;
    private Long communityId;
    private Long userId;
    private String userName;
    private String userProfession;
    private CommunityMemberRole role;
    private CommunityMemberStatus status;
    private LocalDateTime joinedAt;

    public CommunityMemberDto() {
    }

    public static CommunityMemberDto fromEntity(CommunityMember member) {
        CommunityMemberDto dto = new CommunityMemberDto();
        dto.setId(member.getId());
        dto.setCommunityId(member.getCommunity().getId());
        dto.setUserId(member.getUser().getId());
        if (member.getUser().getProfile() != null) {
            dto.setUserName(member.getUser().getProfile().getFullName());
            dto.setUserProfession(member.getUser().getProfile().getProfession());
        } else {
            dto.setUserName(member.getUser().getEmail());
        }
        dto.setRole(member.getRole());
        dto.setStatus(member.getStatus());
        dto.setJoinedAt(member.getJoinedAt());
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserProfession() {
        return userProfession;
    }

    public void setUserProfession(String userProfession) {
        this.userProfession = userProfession;
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
