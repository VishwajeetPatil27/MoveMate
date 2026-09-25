package com.movemate.services.repository;

import com.movemate.services.entity.RecommendationFavorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecommendationFavoriteRepository extends JpaRepository<RecommendationFavorite, Long> {

    boolean existsByUserIdAndRecommendationId(Long userId, Long recommendationId);

    Optional<RecommendationFavorite> findByUserIdAndRecommendationId(Long userId, Long recommendationId);

    void deleteByUserIdAndRecommendationId(Long userId, Long recommendationId);

    Page<RecommendationFavorite> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
