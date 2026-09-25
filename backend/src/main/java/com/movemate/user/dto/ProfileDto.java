package com.movemate.user.dto;

import com.movemate.location.dto.LocationDto;
import com.movemate.user.entity.Profile;
import java.time.LocalDateTime;

public class ProfileDto {

    private Long id;
    private Long userId;
    private String email;
    private String fullName;
    private String profilePhoto;
    private String bio;
    private LocationDto nativeLocation;
    private LocationDto currentLocation;
    private String profession;
    private String company;
    private String college;
    private String languages;
    private String interests;
    private int completionPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProfileDto() {
    }

    public ProfileDto(Profile profile) {
        if (profile != null) {
            this.id = profile.getId();
            if (profile.getUser() != null) {
                this.userId = profile.getUser().getId();
                this.email = profile.getUser().getEmail();
            }
            this.fullName = profile.getFullName();
            this.profilePhoto = profile.getProfilePhoto();
            this.bio = profile.getBio();
            if (profile.getNativeLocation() != null) {
                this.nativeLocation = new LocationDto(profile.getNativeLocation());
            }
            if (profile.getCurrentLocation() != null) {
                this.currentLocation = new LocationDto(profile.getCurrentLocation());
            }
            this.profession = profile.getProfession();
            this.company = profile.getCompany();
            this.college = profile.getCollege();
            this.languages = profile.getLanguages();
            this.interests = profile.getInterests();
            this.createdAt = profile.getCreatedAt();
            this.updatedAt = profile.getUpdatedAt();
            this.completionPercentage = calculateCompletionPercentage(profile);
        }
    }

    public static int calculateCompletionPercentage(Profile profile) {
        if (profile == null) return 0;
        int score = 0;
        int totalWeights = 100;

        // Weight distribution:
        // fullName: 20%
        // nativeLocation: 15%
        // currentLocation: 15%
        // profession: 15%
        // bio: 15%
        // company/college: 10%
        // languages/interests: 10%
        if (profile.getFullName() != null && !profile.getFullName().trim().isEmpty()) score += 20;
        if (profile.getNativeLocation() != null) score += 15;
        if (profile.getCurrentLocation() != null) score += 15;
        if (profile.getProfession() != null && !profile.getProfession().trim().isEmpty()) score += 15;
        if (profile.getBio() != null && !profile.getBio().trim().isEmpty()) score += 15;
        if ((profile.getCompany() != null && !profile.getCompany().trim().isEmpty()) ||
            (profile.getCollege() != null && !profile.getCollege().trim().isEmpty())) score += 10;
        if ((profile.getLanguages() != null && !profile.getLanguages().trim().isEmpty()) ||
            (profile.getInterests() != null && !profile.getInterests().trim().isEmpty())) score += 10;

        return Math.min(score, totalWeights);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public LocationDto getNativeLocation() {
        return nativeLocation;
    }

    public void setNativeLocation(LocationDto nativeLocation) {
        this.nativeLocation = nativeLocation;
    }

    public LocationDto getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(LocationDto currentLocation) {
        this.currentLocation = currentLocation;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public int getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
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
