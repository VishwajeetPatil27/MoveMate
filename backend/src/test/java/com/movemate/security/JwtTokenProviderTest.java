package com.movemate.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "c3VwZXItc2VjcmV0LWtleS1mb3ItbW92ZW1hdGUtand0LWF1dGhlbnRpY2F0aW9uLXNlY3VyaXR5LTI1NmJpdHM=";

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secret, 3600000L, 86400000L);
    }

    @Test
    @DisplayName("Should generate, validate and parse email from valid JWT")
    void testTokenGenerationAndValidation() {
        String token = jwtTokenProvider.generateToken("user@example.com", 1L, "USER");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("user@example.com", jwtTokenProvider.getEmailFromToken(token));
    }

    @Test
    @DisplayName("Should fail validation for tampered or invalid token")
    void testInvalidTokenValidation() {
        assertFalse(jwtTokenProvider.validateToken("invalid.jwt.token"));
    }
}
