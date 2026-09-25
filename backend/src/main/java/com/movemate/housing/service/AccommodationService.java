package com.movemate.housing.service;

import com.movemate.housing.dto.AccommodationDto;
import com.movemate.housing.dto.CreateAccommodationRequest;
import com.movemate.housing.dto.UpdateAccommodationRequest;
import com.movemate.housing.entity.*;
import com.movemate.housing.repository.AccommodationFavoriteRepository;
import com.movemate.housing.repository.AccommodationImageRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final AccommodationImageRepository accommodationImageRepository;
    private final AccommodationFavoriteRepository accommodationFavoriteRepository;
    private final LocationRepository locationRepository;

    public AccommodationService(AccommodationRepository accommodationRepository,
                                AccommodationImageRepository accommodationImageRepository,
                                AccommodationFavoriteRepository accommodationFavoriteRepository,
                                LocationRepository locationRepository) {
        this.accommodationRepository = accommodationRepository;
        this.accommodationImageRepository = accommodationImageRepository;
        this.accommodationFavoriteRepository = accommodationFavoriteRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional
    public AccommodationDto createAccommodation(CreateAccommodationRequest request, User owner) {
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with ID: " + request.getLocationId()));

        Accommodation accommodation = new Accommodation();
        accommodation.setOwner(owner);
        accommodation.setTitle(sanitizeHtml(request.getTitle()));
        accommodation.setDescription(sanitizeHtml(request.getDescription()));
        accommodation.setType(request.getType() != null ? request.getType() : AccommodationType.ROOM);
        accommodation.setRent(request.getRent());
        accommodation.setDeposit(request.getDeposit());
        accommodation.setLocation(location);
        accommodation.setAvailableFrom(request.getAvailableFrom());
        accommodation.setGenderPreference(request.getGenderPreference() != null ? request.getGenderPreference() : GenderPreference.ANY);
        accommodation.setFurnished(request.getFurnished() != null ? request.getFurnished() : FurnishingStatus.SEMI_FURNISHED);
        accommodation.setFacilities(sanitizeHtml(request.getFacilities()));
        accommodation.setStatus(AccommodationStatus.AVAILABLE);

        Accommodation saved = accommodationRepository.save(accommodation);

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<AccommodationImage> images = request.getImageUrls().stream()
                    .filter(url -> url != null && !url.isBlank())
                    .map(url -> new AccommodationImage(saved, url))
                    .collect(Collectors.toList());
            accommodationImageRepository.saveAll(images);
            saved.setImages(images);
        }

        return mapToDto(saved, owner);
    }

    @Transactional
    public AccommodationDto updateAccommodation(Long id, UpdateAccommodationRequest request, User currentUser) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Accommodation listing not found with ID: " + id));

        // Strict Provider Ownership Authorization Check
        if (!accommodation.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to edit this accommodation listing");
        }

        if (request.getTitle() != null) accommodation.setTitle(sanitizeHtml(request.getTitle()));
        if (request.getDescription() != null) accommodation.setDescription(sanitizeHtml(request.getDescription()));
        if (request.getType() != null) accommodation.setType(request.getType());
        if (request.getRent() != null) accommodation.setRent(request.getRent());
        if (request.getDeposit() != null) accommodation.setDeposit(request.getDeposit());
        if (request.getAvailableFrom() != null) accommodation.setAvailableFrom(request.getAvailableFrom());
        if (request.getGenderPreference() != null) accommodation.setGenderPreference(request.getGenderPreference());
        if (request.getFurnished() != null) accommodation.setFurnished(request.getFurnished());
        if (request.getFacilities() != null) accommodation.setFacilities(sanitizeHtml(request.getFacilities()));
        if (request.getStatus() != null) accommodation.setStatus(request.getStatus());

        if (request.getLocationId() != null) {
            Location location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with ID: " + request.getLocationId()));
            accommodation.setLocation(location);
        }

        if (request.getImageUrls() != null) {
            accommodationImageRepository.deleteByAccommodationId(id);
            List<AccommodationImage> images = request.getImageUrls().stream()
                    .filter(url -> url != null && !url.isBlank())
                    .map(url -> new AccommodationImage(accommodation, url))
                    .collect(Collectors.toList());
            accommodationImageRepository.saveAll(images);
            accommodation.setImages(images);
        }

        Accommodation updated = accommodationRepository.save(accommodation);
        return mapToDto(updated, currentUser);
    }

    @Transactional
    public void deleteAccommodation(Long id, User currentUser) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Accommodation listing not found with ID: " + id));

        // Strict Provider Ownership Authorization Check
        if (!accommodation.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this accommodation listing");
        }

        accommodation.setStatus(AccommodationStatus.REMOVED);
        accommodationRepository.save(accommodation);
    }

    @Transactional(readOnly = true)
    public AccommodationDto getAccommodationById(Long id, User currentUser) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Accommodation listing not found with ID: " + id));

        if (accommodation.getStatus() == AccommodationStatus.REMOVED) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Accommodation listing has been removed");
        }

        return mapToDto(accommodation, currentUser);
    }

    @Transactional(readOnly = true)
    public Page<AccommodationDto> searchAccommodations(
            Long locationId,
            String city,
            AccommodationType type,
            BigDecimal minRent,
            BigDecimal maxRent,
            GenderPreference genderPreference,
            FurnishingStatus furnished,
            User currentUser,
            Pageable pageable) {

        Page<Accommodation> page = accommodationRepository.searchAccommodations(
                AccommodationStatus.AVAILABLE,
                locationId,
                (city != null && !city.isBlank()) ? city.trim() : null,
                type,
                minRent,
                maxRent,
                genderPreference,
                furnished,
                pageable
        );

        return page.map(acc -> mapToDto(acc, currentUser));
    }

    @Transactional(readOnly = true)
    public Page<AccommodationDto> getOwnerAccommodations(User currentUser, Pageable pageable) {
        Page<Accommodation> page = accommodationRepository.findByOwnerIdAndStatusNot(
                currentUser.getId(),
                AccommodationStatus.REMOVED,
                pageable
        );
        return page.map(acc -> mapToDto(acc, currentUser));
    }

    public AccommodationDto mapToDto(Accommodation accommodation, User currentUser) {
        AccommodationDto dto = new AccommodationDto();
        dto.setId(accommodation.getId());
        dto.setOwnerId(accommodation.getOwner().getId());
        dto.setOwnerName(accommodation.getOwner().getProfile() != null && accommodation.getOwner().getProfile().getFullName() != null
                ? accommodation.getOwner().getProfile().getFullName()
                : accommodation.getOwner().getEmail());
        dto.setOwnerEmail(accommodation.getOwner().getEmail());
        dto.setTitle(accommodation.getTitle());
        dto.setDescription(accommodation.getDescription());
        dto.setType(accommodation.getType());
        dto.setRent(accommodation.getRent());
        dto.setDeposit(accommodation.getDeposit());

        if (accommodation.getLocation() != null) {
            dto.setLocationId(accommodation.getLocation().getId());
            dto.setCity(accommodation.getLocation().getCity());
            dto.setState(accommodation.getLocation().getState());
            dto.setArea(accommodation.getLocation().getArea());
        }

        dto.setAvailableFrom(accommodation.getAvailableFrom());
        dto.setGenderPreference(accommodation.getGenderPreference());
        dto.setFurnished(accommodation.getFurnished());
        dto.setFacilities(accommodation.getFacilities());
        dto.setStatus(accommodation.getStatus());

        List<String> imageUrls = accommodation.getImages() != null
                ? accommodation.getImages().stream().map(AccommodationImage::getImageUrl).collect(Collectors.toList())
                : new ArrayList<>();
        dto.setImageUrls(imageUrls);

        if (currentUser != null) {
            boolean isFavorite = accommodationFavoriteRepository.existsByUserIdAndAccommodationId(currentUser.getId(), accommodation.getId());
            dto.setFavorite(isFavorite);
        } else {
            dto.setFavorite(false);
        }

        dto.setCreatedAt(accommodation.getCreatedAt());
        dto.setUpdatedAt(accommodation.getUpdatedAt());

        return dto;
    }

    private String sanitizeHtml(String text) {
        if (text == null) return null;
        return text.replace("<", "&lt;").replace(">", "&gt;");
    }
}
