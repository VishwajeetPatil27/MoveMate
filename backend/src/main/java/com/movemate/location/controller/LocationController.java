package com.movemate.location.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.location.dto.LocationDto;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/locations")
public class LocationController {

    private final LocationRepository locationRepository;

    public LocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationDto>>> getLocations(@RequestParam(required = false) String search) {
        List<Location> locations;
        if (search != null && !search.trim().isEmpty()) {
            locations = locationRepository.searchLocations(search.trim());
        } else {
            locations = locationRepository.findAll();
        }
        List<LocationDto> dtos = locations.stream()
                .sorted((a, b) -> {
                    int c = a.getCity().compareToIgnoreCase(b.getCity());
                    if (c != 0) return c;
                    return (a.getArea() != null && b.getArea() != null) ? a.getArea().compareToIgnoreCase(b.getArea()) : 0;
                })
                .map(LocationDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(dtos, "Locations retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LocationDto>> getLocationById(@PathVariable Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Location not found"));
        return ResponseEntity.ok(ApiResponse.success(new LocationDto(location), "Location retrieved successfully"));
    }
}
