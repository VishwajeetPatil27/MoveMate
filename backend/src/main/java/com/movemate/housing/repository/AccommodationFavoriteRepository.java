package com.movemate.housing.repository;

import com.movemate.housing.entity.AccommodationFavorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccommodationFavoriteRepository extends JpaRepository<AccommodationFavorite, Long> {

    boolean existsByUserIdAndAccommodationId(Long userId, Long accommodationId);

    Optional<AccommodationFavorite> findByUserIdAndAccommodationId(Long userId, Long accommodationId);

    void deleteByUserIdAndAccommodationId(Long userId, Long accommodationId);

    Page<AccommodationFavorite> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
