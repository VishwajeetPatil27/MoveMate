package com.movemate.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.housing.repository.AccommodationFavoriteRepository;
import com.movemate.housing.repository.AccommodationImageRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.security.JwtTokenProvider;
import com.movemate.services.dto.CreateRecommendationRequest;
import com.movemate.services.dto.UpdateRecommendationRequest;
import com.movemate.services.entity.Recommendation;
import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.repository.RecommendationFavoriteRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.ProfileRepository;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LocalServiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RecommendationFavoriteRepository recommendationFavoriteRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private AccommodationFavoriteRepository accommodationFavoriteRepository;

    @Autowired
    private AccommodationImageRepository accommodationImageRepository;

    @Autowired
    private AccommodationRepository accommodationRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private com.movemate.relocation.repository.RelocationRequestRepository relocationRequestRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.movemate.notification.repository.NotificationRepository notificationRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User providerUser;
    private User otherUser;
    private Location testLocation;
    private String providerToken;
    private String otherToken;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        recommendationFavoriteRepository.deleteAll();
        recommendationRepository.deleteAll();
        accommodationFavoriteRepository.deleteAll();
        accommodationImageRepository.deleteAll();
        accommodationRepository.deleteAll();
        relocationRequestRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();
        locationRepository.deleteAll();

        testLocation = new Location("India", "Maharashtra", "Pune", "Hinjawadi");
        testLocation = locationRepository.save(testLocation);

        providerUser = new User("service_provider@example.com", "$2a$12$eImiTXuWVxfM37uY4JANjOL.88KV7VO59+W9.KzQW.KzQW", Role.USER, AccountStatus.ACTIVE);
        providerUser = userRepository.save(providerUser);
        providerToken = jwtTokenProvider.generateToken(providerUser.getEmail(), providerUser.getId(), providerUser.getRole().name());

        otherUser = new User("other_user@example.com", "$2a$12$eImiTXuWVxfM37uY4JANjOL.88KV7VO59+W9.KzQW.KzQW", Role.USER, AccountStatus.ACTIVE);
        otherUser = userRepository.save(otherUser);
        otherToken = jwtTokenProvider.generateToken(otherUser.getEmail(), otherUser.getId(), otherUser.getRole().name());
    }

    @Test
    void searchServices_Public_Returns200() throws Exception {
        mockMvc.perform(get("/api/v1/services")
                        .param("city", "Pune")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void createService_Authenticated_Returns201() throws Exception {
        CreateRecommendationRequest req = new CreateRecommendationRequest();
        req.setTitle("Ruby Hall Clinic Hinjawadi");
        req.setCategory(ServiceCategory.HEALTHCARE);
        req.setLocationId(testLocation.getId());
        req.setAddress("Hinjawadi Phase 1");
        req.setPhone("+91 20 6649 4949");

        mockMvc.perform(post("/api/v1/services")
                        .header("Authorization", "Bearer " + providerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Ruby Hall Clinic Hinjawadi"));
    }

    @Test
    void updateService_Forbidden_WhenNotOwner() throws Exception {
        Recommendation rec = new Recommendation(providerUser, testLocation, "Original Place Title", ServiceCategory.HEALTHCARE);
        rec = recommendationRepository.save(rec);

        UpdateRecommendationRequest req = new UpdateRecommendationRequest();
        req.setTitle("Unauthorized Edit Title");

        mockMvc.perform(put("/api/v1/services/" + rec.getId())
                        .header("Authorization", "Bearer " + otherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    @Test
    void toggleFavorite_Authenticated_Returns200() throws Exception {
        Recommendation rec = new Recommendation(providerUser, testLocation, "Apollo Pharmacy", ServiceCategory.HEALTHCARE);
        rec = recommendationRepository.save(rec);

        mockMvc.perform(post("/api/v1/services/" + rec.getId() + "/favorite")
                        .header("Authorization", "Bearer " + otherToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.saved").value(true));
    }
}
