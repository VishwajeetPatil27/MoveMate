package com.movemate.housing.repository;

import com.movemate.housing.entity.Accommodation;
import com.movemate.housing.entity.AccommodationStatus;
import com.movemate.housing.entity.AccommodationType;
import com.movemate.housing.entity.FurnishingStatus;
import com.movemate.housing.entity.GenderPreference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {

    Page<Accommodation> findByOwnerIdAndStatusNot(Long ownerId, AccommodationStatus status, Pageable pageable);

    @Query("SELECT a FROM Accommodation a WHERE a.status = :status " +
           "AND (:locationId IS NULL OR a.location.id = :locationId) " +
           "AND (:city IS NULL OR LOWER(a.location.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(a.location.area) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(a.title) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:type IS NULL OR a.type = :type) " +
           "AND (:minRent IS NULL OR a.rent >= :minRent) " +
           "AND (:maxRent IS NULL OR a.rent <= :maxRent) " +
           "AND (:genderPreference IS NULL OR a.genderPreference = :genderPreference OR a.genderPreference = 'ANY') " +
           "AND (:furnished IS NULL OR a.furnished = :furnished)")
    Page<Accommodation> searchAccommodations(
            @Param("status") AccommodationStatus status,
            @Param("locationId") Long locationId,
            @Param("city") String city,
            @Param("type") AccommodationType type,
            @Param("minRent") BigDecimal minRent,
            @Param("maxRent") BigDecimal maxRent,
            @Param("genderPreference") GenderPreference genderPreference,
            @Param("furnished") FurnishingStatus furnished,
            Pageable pageable
    );

    List<Accommodation> findByOwnerId(Long ownerId);
}
