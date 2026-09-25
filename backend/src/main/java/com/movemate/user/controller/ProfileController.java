package com.movemate.user.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.user.dto.ProfileDto;
import com.movemate.user.dto.ProfileUpdateRequest;
import com.movemate.user.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile/me")
    public ResponseEntity<ApiResponse<ProfileDto>> getCurrentUserProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access"));
        }
        ProfileDto profile = profileService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved successfully"));
    }

    @PutMapping("/profile/me")
    public ResponseEntity<ApiResponse<ProfileDto>> updateCurrentUserProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileUpdateRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access"));
        }
        ProfileDto updatedProfile = profileService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success(updatedProfile, "Profile updated successfully"));
    }

    @GetMapping("/users/{id}/profile")
    public ResponseEntity<ApiResponse<ProfileDto>> getPublicProfile(@PathVariable Long id) {
        ProfileDto profile = profileService.getProfileByUserId(id);
        return ResponseEntity.ok(ApiResponse.success(profile, "User profile retrieved successfully"));
    }
}
