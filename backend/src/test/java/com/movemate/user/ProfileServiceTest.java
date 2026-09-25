package com.movemate.user;

import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.user.dto.ProfileDto;
import com.movemate.user.dto.ProfileUpdateRequest;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Profile;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.ProfileRepository;
import com.movemate.user.repository.UserRepository;
import com.movemate.user.service.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private ProfileService profileService;

    private User testUser;
    private Profile testProfile;
    private Location testNativeLocation;
    private Location testCurrentLocation;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(100L);
        testUser.setEmail("profiletest@example.com");
        testUser.setRole(Role.USER);
        testUser.setStatus(AccountStatus.ACTIVE);

        testNativeLocation = new Location("India", "Maharashtra", "Sangli", "City Center");
        testNativeLocation.setId(1L);

        testCurrentLocation = new Location("India", "Maharashtra", "Pune", "Kothrud");
        testCurrentLocation.setId(2L);

        testProfile = new Profile(testUser, "Test User");
        testProfile.setId(50L);
        testProfile.setBio("Initial bio");
        testProfile.setProfession("Software Engineer");
        testProfile.setNativeLocation(testNativeLocation);
        testProfile.setCurrentLocation(testCurrentLocation);
    }

    @Test
    void getProfileByEmail_Success() {
        when(userRepository.findByEmail("profiletest@example.com")).thenReturn(Optional.of(testUser));
        when(profileRepository.findByUserId(100L)).thenReturn(Optional.of(testProfile));

        ProfileDto dto = profileService.getProfileByEmail("profiletest@example.com");

        assertNotNull(dto);
        assertEquals("Test User", dto.getFullName());
        assertEquals("Software Engineer", dto.getProfession());
        assertEquals("Sangli", dto.getNativeLocation().getCity());
        assertEquals("Pune", dto.getCurrentLocation().getCity());
        assertTrue(dto.getCompletionPercentage() > 0);
    }

    @Test
    void getProfileByEmail_UserNotFound_ThrowsException() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> profileService.getProfileByEmail("unknown@example.com"));
    }

    @Test
    void updateProfile_Success() {
        when(userRepository.findByEmail("profiletest@example.com")).thenReturn(Optional.of(testUser));
        when(profileRepository.findByUserId(100L)).thenReturn(Optional.of(testProfile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProfileUpdateRequest updateReq = new ProfileUpdateRequest();
        updateReq.setFullName("Updated Name");
        updateReq.setBio("Updated bio description");
        updateReq.setCompany("TechCorp");

        ProfileDto result = profileService.updateProfile("profiletest@example.com", updateReq);

        assertNotNull(result);
        assertEquals("Updated Name", result.getFullName());
        assertEquals("Updated bio description", result.getBio());
        assertEquals("TechCorp", result.getCompany());
        verify(profileRepository, times(1)).save(any(Profile.class));
    }
}
