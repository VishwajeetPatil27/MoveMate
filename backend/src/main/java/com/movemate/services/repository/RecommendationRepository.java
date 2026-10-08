package com.movemate.services.repository;

import com.movemate.services.entity.Recommendation;
import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.entity.ServiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query("SELECT r FROM Recommendation r WHERE r.status = :status " +
           "AND (:locationId IS NULL OR r.location.id = :locationId) " +
           "AND (:city IS NULL OR LOWER(r.location.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(r.location.area) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(r.title) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:category IS NULL OR r.category = :category)")
    Page<Recommendation> searchServices(
            @Param("status") ServiceStatus status,
            @Param("locationId") Long locationId,
            @Param("city") String city,
            @Param("category") ServiceCategory category,
            Pageable pageable
    );

    List<Recommendation> findByStatusAndLocationId(ServiceStatus status, Long locationId);

    List<Recommendation> findByCreatorId(Long creatorId);

    boolean existsByTitle(String title);

    java.util.Optional<Recommendation> findFirstByTitle(String title);
}
