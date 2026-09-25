package com.movemate.services;

import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.services.dto.CreateRecommendationRequest;
import com.movemate.services.dto.RecommendationDto;
import com.movemate.services.dto.UpdateRecommendationRequest;
import com.movemate.services.entity.Recommendation;
import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.repository.RecommendationFavoriteRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.services.service.LocalService;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LocalServiceTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @Mock
    private RecommendationFavoriteRepository recommendationFavoriteRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private LocalService localService;

    private User owner;
    private User nonOwner;
    private Location location;

    @BeforeEach
    void setUp() {
        owner = new User("owner@example.com", "password123", Role.USER, AccountStatus.ACTIVE);
        owner.setId(1L);

        nonOwner = new User("other@example.com", "password123", Role.USER, AccountStatus.ACTIVE);
        nonOwner.setId(2L);

        location = new Location("India", "Maharashtra", "Pune", "Hinjawadi");
        location.setId(2L);
    }

    @Test
    void createRecommendation_Success() {
        CreateRecommendationRequest req = new CreateRecommendationRequest();
        req.setTitle("<script>alert('xss')</script> Ruby Hall Clinic");
        req.setCategory(ServiceCategory.HEALTHCARE);
        req.setLocationId(2L);
        req.setAddress("Hinjawadi Phase 1");

        when(locationRepository.findById(2L)).thenReturn(Optional.of(location));
        when(recommendationRepository.save(any(Recommendation.class))).thenAnswer(i -> {
            Recommendation r = i.getArgument(0);
            r.setId(10L);
            return r;
        });

        RecommendationDto result = localService.createRecommendation(req, owner);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("alert('xss') Ruby Hall Clinic", result.getTitle()); // HTML tags stripped
        assertEquals(ServiceCategory.HEALTHCARE, result.getCategory());
        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
    }

    @Test
    void updateRecommendation_Forbidden_WhenNotOwner() {
        Recommendation rec = new Recommendation(owner, location, "Ruby Hall Clinic", ServiceCategory.HEALTHCARE);
        rec.setId(10L);

        when(recommendationRepository.findById(10L)).thenReturn(Optional.of(rec));

        UpdateRecommendationRequest req = new UpdateRecommendationRequest();
        req.setTitle("Attempted Hacked Title");

        assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> {
            localService.updateRecommendation(10L, req, nonOwner);
        });

        verify(recommendationRepository, never()).save(any());
    }

    @Test
    void calculateHaversineDistance_Valid() {
        // Distance between Hinjawadi Phase 1 (18.5912, 73.7389) and Wakad D-Mart (18.5998, 73.7551) ~ 1.9 km
        double dist = LocalService.calculateHaversineDistance(18.5912, 73.7389, 18.5998, 73.7551);
        assertTrue(dist > 1.0 && dist < 3.0, "Distance should be ~1.9 km");
    }
}
