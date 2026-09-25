package com.movemate.services.service;

import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.services.dto.CreateRecommendationRequest;
import com.movemate.services.dto.RecommendationDto;
import com.movemate.services.dto.UpdateRecommendationRequest;
import com.movemate.services.entity.Recommendation;
import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.entity.ServiceStatus;
import com.movemate.services.repository.RecommendationFavoriteRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocalService {

    private final RecommendationRepository recommendationRepository;
    private final RecommendationFavoriteRepository recommendationFavoriteRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    public LocalService(
            RecommendationRepository recommendationRepository,
            RecommendationFavoriteRepository recommendationFavoriteRepository,
            LocationRepository locationRepository,
            UserRepository userRepository
    ) {
        this.recommendationRepository = recommendationRepository;
        this.recommendationFavoriteRepository = recommendationFavoriteRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RecommendationDto createRecommendation(CreateRecommendationRequest req, User currentUser) {
        Location location = locationRepository.findById(req.getLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with ID: " + req.getLocationId()));

        Recommendation rec = new Recommendation(currentUser, location, sanitizeHtml(req.getTitle()), req.getCategory());
        rec.setDescription(sanitizeHtml(req.getDescription()));
        rec.setSubcategory(sanitizeHtml(req.getSubcategory()));
        rec.setAddress(sanitizeHtml(req.getAddress()));
        rec.setPhone(sanitizeHtml(req.getPhone()));
        rec.setWebsite(sanitizeHtml(req.getWebsite()));
        rec.setLatitude(req.getLatitude());
        rec.setLongitude(req.getLongitude());
        rec.setOpeningHours(sanitizeHtml(req.getOpeningHours()));
        if (req.getRating() != null) {
            rec.setRating(req.getRating());
        }

        Recommendation saved = recommendationRepository.save(rec);
        return mapToDto(saved, currentUser, null, null);
    }

    @Transactional(readOnly = true)
    public Page<RecommendationDto> searchRecommendations(
            Long locationId,
            String city,
            ServiceCategory category,
            Double userLat,
            Double userLon,
            User currentUser,
            Pageable pageable
    ) {
        Page<Recommendation> page = recommendationRepository.searchServices(
                ServiceStatus.PUBLISHED,
                locationId,
                city,
                category,
                pageable
        );

        List<RecommendationDto> dtos = page.getContent().stream()
                .map(r -> mapToDto(r, currentUser, userLat, userLon))
                .collect(Collectors.toList());

        if (userLat != null && userLon != null) {
            dtos.sort(Comparator.comparing(RecommendationDto::getDistanceFromUserKm, Comparator.nullsLast(Comparator.naturalOrder())));
        }

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    @Transactional(readOnly = true)
    public RecommendationDto getRecommendationById(Long id, User currentUser, Double userLat, Double userLon) {
        Recommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + id));

        if (rec.getStatus() == ServiceStatus.REMOVED) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Service listing has been removed");
        }

        return mapToDto(rec, currentUser, userLat, userLon);
    }

    @Transactional
    public RecommendationDto updateRecommendation(Long id, UpdateRecommendationRequest req, User currentUser) {
        Recommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + id));

        // Provider Security Authorization Check
        if (!rec.getCreator().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to edit this local service listing");
        }

        if (req.getTitle() != null && !req.getTitle().isBlank()) {
            rec.setTitle(sanitizeHtml(req.getTitle()));
        }
        if (req.getDescription() != null) {
            rec.setDescription(sanitizeHtml(req.getDescription()));
        }
        if (req.getCategory() != null) {
            rec.setCategory(req.getCategory());
        }
        if (req.getSubcategory() != null) {
            rec.setSubcategory(sanitizeHtml(req.getSubcategory()));
        }
        if (req.getLocationId() != null) {
            Location loc = locationRepository.findById(req.getLocationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with ID: " + req.getLocationId()));
            rec.setLocation(loc);
        }
        if (req.getAddress() != null) rec.setAddress(sanitizeHtml(req.getAddress()));
        if (req.getPhone() != null) rec.setPhone(sanitizeHtml(req.getPhone()));
        if (req.getWebsite() != null) rec.setWebsite(sanitizeHtml(req.getWebsite()));
        if (req.getLatitude() != null) rec.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) rec.setLongitude(req.getLongitude());
        if (req.getOpeningHours() != null) rec.setOpeningHours(sanitizeHtml(req.getOpeningHours()));
        if (req.getRating() != null) rec.setRating(req.getRating());
        if (req.getStatus() != null) rec.setStatus(req.getStatus());

        Recommendation updated = recommendationRepository.save(rec);
        return mapToDto(updated, currentUser, null, null);
    }

    @Transactional
    public void deleteRecommendation(Long id, User currentUser) {
        Recommendation rec = recommendationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + id));

        // Provider Security Authorization Check
        if (!rec.getCreator().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this local service listing");
        }

        rec.setStatus(ServiceStatus.REMOVED);
        recommendationRepository.save(rec);
    }

    public RecommendationDto mapToDto(Recommendation r, User currentUser, Double userLat, Double userLon) {
        RecommendationDto dto = new RecommendationDto();
        dto.setId(r.getId());
        dto.setCreatorId(r.getCreator().getId());
        dto.setCreatorName(r.getCreator().getProfile() != null && r.getCreator().getProfile().getFullName() != null
                ? r.getCreator().getProfile().getFullName() : r.getCreator().getEmail());
        dto.setCreatorEmail(r.getCreator().getEmail());

        if (r.getLocation() != null) {
            dto.setLocationId(r.getLocation().getId());
            dto.setCity(r.getLocation().getCity());
            dto.setState(r.getLocation().getState());
            dto.setArea(r.getLocation().getArea());
        }

        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());
        dto.setCategory(r.getCategory());
        dto.setSubcategory(r.getSubcategory());
        dto.setAddress(r.getAddress());
        dto.setPhone(r.getPhone());
        dto.setWebsite(r.getWebsite());
        dto.setLatitude(r.getLatitude());
        dto.setLongitude(r.getLongitude());
        dto.setOpeningHours(r.getOpeningHours());
        dto.setRating(r.getRating());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());

        // Calculate Haversine distance if coordinates exist
        if (userLat != null && userLon != null && r.getLatitude() != null && r.getLongitude() != null) {
            double dist = calculateHaversineDistance(
                    userLat, userLon,
                    r.getLatitude().doubleValue(), r.getLongitude().doubleValue()
            );
            dto.setDistanceFromUserKm(Math.round(dist * 10.0) / 10.0);
        }

        if (currentUser != null) {
            boolean isSaved = recommendationFavoriteRepository.existsByUserIdAndRecommendationId(currentUser.getId(), r.getId());
            dto.setSaved(isSaved);
        } else {
            dto.setSaved(false);
        }

        return dto;
    }

    public static double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private String sanitizeHtml(String input) {
        if (input == null) return null;
        return input.replaceAll("<[^>]*>", "").trim();
    }
}
