package com.movemate.community.dto;

import com.movemate.community.entity.CommunityCategory;
import com.movemate.community.entity.CommunityStatus;
import jakarta.validation.constraints.Size;

public class UpdateCommunityRequest {

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private CommunityCategory category;

    private String language;

    private String coverImage;

    private CommunityStatus status;

    public UpdateCommunityRequest() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CommunityCategory getCategory() {
        return category;
    }

    public void setCategory(CommunityCategory category) {
        this.category = category;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public CommunityStatus getStatus() {
        return status;
    }

    public void setStatus(CommunityStatus status) {
        this.status = status;
    }
}
