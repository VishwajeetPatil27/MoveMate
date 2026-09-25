package com.movemate.services.service;

import com.movemate.services.dto.RecommendationDto;
import com.movemate.services.entity.Recommendation;
import com.movemate.services.entity.RecommendationFavorite;
import com.movemate.services.repository.RecommendationFavoriteRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RecommendationFavoriteService {

    private final RecommendationFavoriteRepository favoriteRepository;
    private final RecommendationRepository recommendationRepository;
    private final LocalService localService;

    public RecommendationFavoriteService(
            RecommendationFavoriteRepository favoriteRepository,
            RecommendationRepository recommendationRepository,
            LocalService localService
    ) {
        this.favoriteRepository = favoriteRepository;
        this.recommendationRepository = recommendationRepository;
        this.localService = localService;
    }

    @Transactional
    public boolean toggleFavorite(Long recommendationId, User currentUser) {
        Recommendation rec = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service place not found with ID: " + recommendationId));

        Optional<RecommendationFavorite> existing = favoriteRepository.findByUserIdAndRecommendationId(currentUser.getId(), rec.getId());
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            return false; // Removed from saved
        } else {
            RecommendationFavorite favorite = new RecommendationFavorite(currentUser, rec);
            favoriteRepository.save(favorite);
            return true; // Added to saved
        }
    }

    @Transactional(readOnly = true)
    public Page<RecommendationDto> getUserFavorites(User currentUser, Pageable pageable) {
        Page<RecommendationFavorite> page = favoriteRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable);
        List<RecommendationDto> dtos = page.getContent().stream()
                .map(rf -> localService.mapToDto(rf.getRecommendation(), currentUser, null, null))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }
}
