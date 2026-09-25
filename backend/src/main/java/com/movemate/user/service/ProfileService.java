package com.movemate.user.service;

import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.user.dto.ProfileDto;
import com.movemate.user.dto.ProfileUpdateRequest;
import com.movemate.user.entity.Profile;
import com.movemate.user.entity.User;
import com.movemate.user.repository.ProfileRepository;
import com.movemate.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    public ProfileService(ProfileRepository profileRepository,
                          UserRepository userRepository,
                          LocationRepository locationRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    String defaultName = extractDefaultName(user.getEmail());
                    Profile newProfile = new Profile(user, defaultName);
                    return profileRepository.save(newProfile);
                });

        return new ProfileDto(profile);
    }

    @Transactional(readOnly = true)
    public ProfileDto getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found for user ID: " + userId));
        return new ProfileDto(profile);
    }

    @Transactional
    public ProfileDto updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseGet(() -> new Profile(user, extractDefaultName(user.getEmail())));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            profile.setFullName(request.getFullName().trim());
        }

        if (request.getProfilePhoto() != null) {
            profile.setProfilePhoto(request.getProfilePhoto().trim());
        }

        if (request.getBio() != null) {
            profile.setBio(request.getBio().trim());
        }

        if (request.getProfession() != null) {
            profile.setProfession(request.getProfession().trim());
        }

        if (request.getCompany() != null) {
            profile.setCompany(request.getCompany().trim());
        }

        if (request.getCollege() != null) {
            profile.setCollege(request.getCollege().trim());
        }

        if (request.getLanguages() != null) {
            profile.setLanguages(request.getLanguages().trim());
        }

        if (request.getInterests() != null) {
            profile.setInterests(request.getInterests().trim());
        }

        if (request.getNativeLocationId() != null) {
            Location nativeLoc = locationRepository.findById(request.getNativeLocationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid native location ID"));
            profile.setNativeLocation(nativeLoc);
        }

        if (request.getCurrentLocationId() != null) {
            Location currentLoc = locationRepository.findById(request.getCurrentLocationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid current location ID"));
            profile.setCurrentLocation(currentLoc);
        }

        Profile updatedProfile = profileRepository.save(profile);
        return new ProfileDto(updatedProfile);
    }

    private String extractDefaultName(String email) {
        if (email == null || !email.contains("@")) return "MoveMate User";
        String prefix = email.split("@")[0];
        String[] parts = prefix.split("[._-]");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                sb.append(Character.toUpperCase(part.charAt(0)))
                  .append(part.substring(1).toLowerCase())
                  .append(" ");
            }
        }
        return sb.toString().trim();
    }
}
