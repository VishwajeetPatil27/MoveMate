package com.movemate.housing;

import com.movemate.housing.dto.AccommodationDto;
import com.movemate.housing.dto.CreateAccommodationRequest;
import com.movemate.housing.dto.UpdateAccommodationRequest;
import com.movemate.housing.entity.*;
import com.movemate.housing.repository.AccommodationFavoriteRepository;
import com.movemate.housing.repository.AccommodationImageRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.housing.service.AccommodationService;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccommodationServiceTest {

    @Mock
    private AccommodationRepository accommodationRepository;

    @Mock
    private AccommodationImageRepository accommodationImageRepository;

    @Mock
    private AccommodationFavoriteRepository accommodationFavoriteRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private AccommodationService accommodationService;

    private User owner;
    private User otherUser;
    private Location location;
    private Accommodation accommodation;

    @BeforeEach
    void setUp() {
        owner = new User("owner@test.com", "password", Role.USER, AccountStatus.ACTIVE);
        owner.setId(1L);

        otherUser = new User("other@test.com", "password", Role.USER, AccountStatus.ACTIVE);
        otherUser.setId(2L);

        location = new Location("India", "Maharashtra", "Pune", "Hinjawadi");
        location.setId(10L);

        accommodation = new Accommodation(owner, "Nice 1BHK Flat", "Spacious and clean", AccommodationType.FLAT, new BigDecimal("12000"), new BigDecimal("25000"), location);
        accommodation.setId(100L);
    }

    @Test
    @DisplayName("createAccommodation - Success & sanitizes HTML tags")
    void createAccommodation_Success() {
        CreateAccommodationRequest request = new CreateAccommodationRequest();
        request.setTitle("<script>alert('x')</script> Pune Flat");
        request.setDescription("Great location");
        request.setType(AccommodationType.FLAT);
        request.setRent(new BigDecimal("12000"));
        request.setLocationId(10L);

        when(locationRepository.findById(10L)).thenReturn(Optional.of(location));
        when(accommodationRepository.save(any(Accommodation.class))).thenAnswer(invocation -> {
            Accommodation acc = invocation.getArgument(0);
            acc.setId(100L);
            return acc;
        });

        AccommodationDto result = accommodationService.createAccommodation(request, owner);

        assertNotNull(result);
        assertEquals("&lt;script&gt;alert('x')&lt;/script&gt; Pune Flat", result.getTitle());
        assertEquals(new BigDecimal("12000"), result.getRent());
        assertEquals("Pune", result.getCity());
    }

    @Test
    @DisplayName("updateAccommodation - Throws 403 Forbidden when user is not owner")
    void updateAccommodation_Forbidden_WhenNotOwner() {
        UpdateAccommodationRequest updateReq = new UpdateAccommodationRequest();
        updateReq.setTitle("Hacked Title");

        when(accommodationRepository.findById(100L)).thenReturn(Optional.of(accommodation));

        assertThrows(ResponseStatusException.class, () -> accommodationService.updateAccommodation(100L, updateReq, otherUser));
        verify(accommodationRepository, never()).save(any());
    }

    @Test
    @DisplayName("deleteAccommodation - Throws 403 Forbidden when user is not owner")
    void deleteAccommodation_Forbidden_WhenNotOwner() {
        when(accommodationRepository.findById(100L)).thenReturn(Optional.of(accommodation));

        assertThrows(ResponseStatusException.class, () -> accommodationService.deleteAccommodation(100L, otherUser));
    }
}
