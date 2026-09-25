package com.movemate.event.repository;

import com.movemate.event.entity.Event;
import com.movemate.event.entity.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE (:status IS NULL OR e.status = :status) " +
           "AND (:communityId IS NULL OR e.community.id = :communityId) " +
           "AND (:city IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(e.community.destinationLocation.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (:search IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Event> searchEvents(
            @Param("status") EventStatus status,
            @Param("communityId") Long communityId,
            @Param("city") String city,
            @Param("search") String search,
            Pageable pageable
    );

    Page<Event> findByCommunityIdAndStatusOrderByEventDateAsc(Long communityId, EventStatus status, Pageable pageable);
}
