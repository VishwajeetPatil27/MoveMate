package com.movemate.location.repository;

import com.movemate.location.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    List<Location> findByCityAndState(String city, String state);

    Optional<Location> findFirstByCityAndState(String city, String state);

    Optional<Location> findFirstByCityAndStateAndArea(String city, String state, String area);

    List<Location> findByCityContainingIgnoreCase(String city);

    @Query("SELECT l FROM Location l WHERE LOWER(l.city) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.state) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(l.area) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Location> searchLocations(@Param("query") String query);
}
