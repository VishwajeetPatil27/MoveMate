package com.movemate.auth.controller;

import com.movemate.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestSecurityController {

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<String>> publicEndpoint() {
        return ResponseEntity.ok(ApiResponse.success("Public endpoint access granted", "Success"));
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('USER') or hasRole('COMMUNITY_ADMIN') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> userEndpoint() {
        return ResponseEntity.ok(ApiResponse.success("User endpoint access granted", "Success"));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> adminEndpoint() {
        return ResponseEntity.ok(ApiResponse.success("Admin endpoint access granted", "Success"));
    }
}
