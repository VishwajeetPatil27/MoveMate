package com.movemate.health.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.health.dto.HealthStatusDto;
import com.movemate.health.service.HealthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<HealthStatusDto>> getHealth() {
        HealthStatusDto status = healthService.checkHealth();
        return ResponseEntity.ok(ApiResponse.success(status, "System is healthy and operational"));
    }
}
