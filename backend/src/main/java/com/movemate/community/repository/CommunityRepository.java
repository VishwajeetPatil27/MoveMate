package com.movemate.community.repository;

import com.movemate.community.entity.Community;
import com.movemate.community.entity.CommunityCategory;
import com.movemate.community.entity.CommunityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    Optional<Community> findBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    Page<Community> findByStatus(CommunityStatus status, Pageable pageable);

    @Query("SELECT c FROM Community c WHERE c.status = 'ACTIVE' AND (" +
           "(:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:destinationLocationId IS NULL OR c.destinationLocation.id = :destinationLocationId)" +
           ")")
    Page<Community> searchCommunities(
            @Param("search") String search,
            @Param("category") CommunityCategory category,
            @Param("destinationLocationId") Long destinationLocationId,
            Pageable pageable
    );

    @Query("SELECT c FROM Community c WHERE c.status = 'ACTIVE' AND c.destinationLocation.id = :destinationLocationId")
    List<Community> findRecommendedCommunitiesForDestination(@Param("destinationLocationId") Long destinationLocationId, Pageable pageable);
}
