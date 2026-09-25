package com.movemate.user.dto;

import jakarta.validation.constraints.Size;

public class ProfileUpdateRequest {

    @Size(max = 120, message = "Full name must not exceed 120 characters")
    private String fullName;

    @Size(max = 500, message = "Profile photo URL must not exceed 500 characters")
    private String profilePhoto;

    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;

    private Long nativeLocationId;
    private Long currentLocationId;

    @Size(max = 100, message = "Profession must not exceed 100 characters")
    private String profession;

    @Size(max = 120, message = "Company must not exceed 120 characters")
    private String company;

    @Size(max = 120, message = "College must not exceed 120 characters")
    private String college;

    @Size(max = 255, message = "Languages must not exceed 255 characters")
    private String languages;

    @Size(max = 2000, message = "Interests must not exceed 2000 characters")
    private String interests;

    public ProfileUpdateRequest() {
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

    public Long getNativeLocationId() {
        return nativeLocationId;
    }

    public void setNativeLocationId(Long nativeLocationId) {
        this.nativeLocationId = nativeLocationId;
    }

    public Long getCurrentLocationId() {
        return currentLocationId;
    }

    public void setCurrentLocationId(Long currentLocationId) {
        this.currentLocationId = currentLocationId;
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
}
