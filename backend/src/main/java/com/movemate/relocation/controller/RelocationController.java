package com.movemate.relocation.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.relocation.dto.CreateRelocationRequest;
import com.movemate.relocation.dto.RelocationRequestDto;
import com.movemate.relocation.dto.UpdateRelocationRequest;
import com.movemate.relocation.service.RelocationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/relocations")
public class RelocationController {

    private final RelocationService relocationService;

    public RelocationController(RelocationService relocationService) {
        this.relocationService = relocationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RelocationRequestDto>> createRelocation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateRelocationRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access"));
        }
        RelocationRequestDto created = relocationService.createRelocationRequest(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Relocation request created successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<RelocationRequestDto>>> getMyRelocations(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access"));
        }
        List<RelocationRequestDto> relocations = relocationService.getRelocationRequestsByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(relocations, "User relocations retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RelocationRequestDto>> getRelocationById(@PathVariable Long id) {
        RelocationRequestDto relocation = relocationService.getRelocationRequestById(id);
        return ResponseEntity.ok(ApiResponse.success(relocation, "Relocation request retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RelocationRequestDto>> updateRelocation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateRelocationRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access"));
        }
        RelocationRequestDto updated = relocationService.updateRelocationRequest(userDetails.getUsername(), id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Relocation request updated successfully"));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<RelocationRequestDto>> cancelRelocation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access"));
        }
        RelocationRequestDto cancelled = relocationService.cancelRelocationRequest(userDetails.getUsername(), id);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Relocation request cancelled successfully"));
    }
}
