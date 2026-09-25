package com.movemate.services.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.services.dto.CreateRecommendationRequest;
import com.movemate.services.dto.RecommendationDto;
import com.movemate.services.dto.UpdateRecommendationRequest;
import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.service.LocalService;
import com.movemate.services.service.RecommendationFavoriteService;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/services")
public class LocalServiceController {

    private final LocalService localService;
    private final RecommendationFavoriteService favoriteService;
    private final UserRepository userRepository;

    public LocalServiceController(
            LocalService localService,
            RecommendationFavoriteService favoriteService,
            UserRepository userRepository
    ) {
        this.localService = localService;
        this.favoriteService = favoriteService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<RecommendationDto>>> searchServices(
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) ServiceCategory category,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            Authentication authentication
    ) {
        User currentUser = getCurrentUserOptional(authentication);
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<RecommendationDto> result = localService.searchRecommendations(
                locationId, city, category, latitude, longitude, currentUser, pageable
        );
        return ResponseEntity.ok(ApiResponse.success(result, "Services fetched successfully"));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<Page<RecommendationDto>>> getNearbyServices(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false) ServiceCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User currentUser = getCurrentUserOptional(authentication);
        Pageable pageable = PageRequest.of(page, size);

        Page<RecommendationDto> result = localService.searchRecommendations(
                null, null, category, latitude, longitude, currentUser, pageable
        );
        return ResponseEntity.ok(ApiResponse.success(result, "Nearby services fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RecommendationDto>> createService(
            @Valid @RequestBody CreateRecommendationRequest request,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        RecommendationDto dto = localService.createRecommendation(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto, "Local service listed successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RecommendationDto>> getServiceById(
            @PathVariable Long id,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            Authentication authentication
    ) {
        User currentUser = getCurrentUserOptional(authentication);
        RecommendationDto dto = localService.getRecommendationById(id, currentUser, latitude, longitude);
        return ResponseEntity.ok(ApiResponse.success(dto, "Service details fetched successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RecommendationDto>> updateService(
            @PathVariable Long id,
            @RequestBody UpdateRecommendationRequest request,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        RecommendationDto dto = localService.updateRecommendation(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(dto, "Service updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteService(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        localService.deleteRecommendation(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Service listing removed successfully"));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleFavorite(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        boolean isSaved = favoriteService.toggleFavorite(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(Map.of("saved", isSaved), isSaved ? "Place saved to favorites" : "Place removed from favorites"));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<Page<RecommendationDto>>> getSavedPlaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<RecommendationDto> saved = favoriteService.getUserFavorites(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(saved, "Saved places fetched successfully"));
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private User getCurrentUserOptional(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }
}
