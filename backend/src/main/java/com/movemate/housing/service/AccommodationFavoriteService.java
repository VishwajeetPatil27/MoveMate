package com.movemate.housing.service;

import com.movemate.housing.dto.AccommodationDto;
import com.movemate.housing.entity.Accommodation;
import com.movemate.housing.entity.AccommodationFavorite;
import com.movemate.housing.repository.AccommodationFavoriteRepository;
import com.movemate.housing.repository.AccommodationRepository;
import com.movemate.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AccommodationFavoriteService {

    private final AccommodationFavoriteRepository favoriteRepository;
    private final AccommodationRepository accommodationRepository;
    private final AccommodationService accommodationService;

    public AccommodationFavoriteService(AccommodationFavoriteRepository favoriteRepository,
                                         AccommodationRepository accommodationRepository,
                                         AccommodationService accommodationService) {
        this.favoriteRepository = favoriteRepository;
        this.accommodationRepository = accommodationRepository;
        this.accommodationService = accommodationService;
    }

    @Transactional
    public boolean toggleFavorite(Long accommodationId, User currentUser) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Accommodation listing not found with ID: " + accommodationId));

        Optional<AccommodationFavorite> existing = favoriteRepository.findByUserIdAndAccommodationId(currentUser.getId(), accommodationId);

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false; // Removed from favorites
        } else {
            AccommodationFavorite favorite = new AccommodationFavorite(currentUser, accommodation);
            favoriteRepository.save(favorite);
            return true; // Added to favorites
        }
    }

    @Transactional(readOnly = true)
    public Page<AccommodationDto> getUserFavorites(User currentUser, Pageable pageable) {
        Page<AccommodationFavorite> page = favoriteRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable);
        return page.map(fav -> accommodationService.mapToDto(fav.getAccommodation(), currentUser));
    }
}
