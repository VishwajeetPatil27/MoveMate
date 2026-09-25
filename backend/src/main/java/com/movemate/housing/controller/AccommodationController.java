package com.movemate.housing.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.housing.dto.AccommodationDto;
import com.movemate.housing.dto.CreateAccommodationRequest;
import com.movemate.housing.dto.UpdateAccommodationRequest;
import com.movemate.housing.entity.AccommodationType;
import com.movemate.housing.entity.FurnishingStatus;
import com.movemate.housing.entity.GenderPreference;
import com.movemate.housing.service.AccommodationFavoriteService;
import com.movemate.housing.service.AccommodationService;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/accommodations")
public class AccommodationController {

    private final AccommodationService accommodationService;
    private final AccommodationFavoriteService favoriteService;
    private final UserRepository userRepository;

    public AccommodationController(AccommodationService accommodationService,
                                   AccommodationFavoriteService favoriteService,
                                   UserRepository userRepository) {
        this.accommodationService = accommodationService;
        this.favoriteService = favoriteService;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private User getRequiredUser(Authentication authentication) {
        User user = getCurrentUser(authentication);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Full authentication is required");
        }
        return user;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<AccommodationDto>>> searchAccommodations(
            @RequestParam(required = false) Long locationId,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) AccommodationType type,
            @RequestParam(required = false) BigDecimal minRent,
            @RequestParam(required = false) BigDecimal maxRent,
            @RequestParam(required = false) GenderPreference genderPreference,
            @RequestParam(required = false) FurnishingStatus furnished,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);
        Sort sort = direction.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        PageRequest pageable = PageRequest.of(page, size, sort);

        Page<AccommodationDto> results = accommodationService.searchAccommodations(
                locationId, city, type, minRent, maxRent, genderPreference, furnished, currentUser, pageable);

        return ResponseEntity.ok(ApiResponse.success(results, "Accommodations fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AccommodationDto>> createAccommodation(
            @Valid @RequestBody CreateAccommodationRequest request,
            Authentication authentication) {

        User currentUser = getRequiredUser(authentication);
        AccommodationDto created = accommodationService.createAccommodation(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Accommodation listing published successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Page<AccommodationDto>>> getMyAccommodations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        User currentUser = getRequiredUser(authentication);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AccommodationDto> results = accommodationService.getOwnerAccommodations(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(results, "My accommodations fetched successfully"));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<Page<AccommodationDto>>> getSavedAccommodations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        User currentUser = getRequiredUser(authentication);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AccommodationDto> results = favoriteService.getUserFavorites(currentUser, pageable);
        return ResponseEntity.ok(ApiResponse.success(results, "Saved accommodations fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccommodationDto>> getAccommodationById(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getCurrentUser(authentication);
        AccommodationDto dto = accommodationService.getAccommodationById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(dto, "Accommodation details fetched successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AccommodationDto>> updateAccommodation(
            @PathVariable Long id,
            @RequestBody UpdateAccommodationRequest request,
            Authentication authentication) {

        User currentUser = getRequiredUser(authentication);
        AccommodationDto updated = accommodationService.updateAccommodation(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success(updated, "Accommodation updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAccommodation(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getRequiredUser(authentication);
        accommodationService.deleteAccommodation(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(null, "Accommodation deleted successfully"));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleFavorite(
            @PathVariable Long id,
            Authentication authentication) {

        User currentUser = getRequiredUser(authentication);
        boolean isFavorite = favoriteService.toggleFavorite(id, currentUser);
        Map<String, Object> data = new HashMap<>();
        data.put("isFavorite", isFavorite);
        String msg = isFavorite ? "Listing saved to favorites" : "Listing removed from favorites";
        return ResponseEntity.ok(ApiResponse.success(data, msg));
    }
}
