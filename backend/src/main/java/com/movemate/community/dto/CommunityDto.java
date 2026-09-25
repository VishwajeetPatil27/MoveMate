package com.movemate.community.dto;

import com.movemate.community.entity.Community;
import com.movemate.community.entity.CommunityCategory;
import com.movemate.community.entity.CommunityMemberRole;
import com.movemate.community.entity.CommunityStatus;
import com.movemate.location.dto.LocationDto;

import java.time.LocalDateTime;

public class CommunityDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private LocationDto originLocation;
    private LocationDto destinationLocation;
    private String language;
    private CommunityCategory category;
    private String coverImage;
    private Long creatorId;
    private String creatorName;
    private CommunityStatus status;
    private long memberCount;
    private boolean isJoined;
    private CommunityMemberRole memberRole;
    private LocalDateTime createdAt;

    public CommunityDto() {
    }

    public static CommunityDto fromEntity(Community community, long memberCount, boolean isJoined, CommunityMemberRole memberRole) {
        CommunityDto dto = new CommunityDto();
        dto.setId(community.getId());
        dto.setName(community.getName());
        dto.setSlug(community.getSlug());
        dto.setDescription(community.getDescription());
        if (community.getOriginLocation() != null) {
            dto.setOriginLocation(new LocationDto(community.getOriginLocation()));
        }
        if (community.getDestinationLocation() != null) {
            dto.setDestinationLocation(new LocationDto(community.getDestinationLocation()));
        }
        dto.setLanguage(community.getLanguage());
        dto.setCategory(community.getCategory());
        dto.setCoverImage(community.getCoverImage());
        if (community.getCreator() != null) {
            dto.setCreatorId(community.getCreator().getId());
            dto.setCreatorName(community.getCreator().getEmail());
        }
        dto.setStatus(community.getStatus());
        dto.setMemberCount(memberCount);
        dto.setJoined(isJoined);
        dto.setMemberRole(memberRole);
        dto.setCreatedAt(community.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocationDto getOriginLocation() {
        return originLocation;
    }

    public void setOriginLocation(LocationDto originLocation) {
        this.originLocation = originLocation;
    }

    public LocationDto getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(LocationDto destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public CommunityCategory getCategory() {
        return category;
    }

    public void setCategory(CommunityCategory category) {
        this.category = category;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public CommunityStatus getStatus() {
        return status;
    }

    public void setStatus(CommunityStatus status) {
        this.status = status;
    }

    public long getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(long memberCount) {
        this.memberCount = memberCount;
    }

    public boolean isJoined() {
        return isJoined;
    }

    public void setJoined(boolean joined) {
        isJoined = joined;
    }

    public CommunityMemberRole getMemberRole() {
        return memberRole;
    }

    public void setMemberRole(CommunityMemberRole memberRole) {
        this.memberRole = memberRole;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
