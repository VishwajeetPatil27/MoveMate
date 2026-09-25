package com.movemate.auth;

import com.movemate.auth.dto.AuthResponse;
import com.movemate.auth.dto.LoginRequest;
import com.movemate.auth.dto.RegisterRequest;
import com.movemate.auth.service.AuthService;
import com.movemate.security.JwtTokenProvider;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Profile;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.ProfileRepository;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("newuser@example.com", "$2a$12$hashedPassword", Role.USER, AccountStatus.ACTIVE);
        sampleUser.setId(100L);
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("newuser@example.com", "Password123!", "New User", Role.USER);

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$12$hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(tokenProvider.generateToken(anyString(), any(), anyString())).thenReturn("mock.access.token");
        when(tokenProvider.generateRefreshToken(anyString())).thenReturn("mock.refresh.token");
        when(tokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock.access.token", response.getToken());
        assertEquals("newuser@example.com", response.getUser().getEmail());
        assertEquals("New User", response.getUser().getFullName());
        verify(userRepository, times(1)).save(any(User.class));
        verify(profileRepository, times(1)).save(any(Profile.class));
    }

    @Test
    @DisplayName("Should throw 409 Conflict on duplicate email registration")
    void testRegisterDuplicateEmailThrowsConflict() {
        RegisterRequest request = new RegisterRequest("existing@example.com", "Password123!", "Existing User", Role.USER);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> authService.register(request));
        assertEquals(409, exception.getStatusCode().value());
    }

    @Test
    @DisplayName("Should successfully authenticate user with valid credentials")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("newuser@example.com", "Password123!");

        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Password123!", "$2a$12$hashedPassword")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(profileRepository.findByUserId(100L)).thenReturn(Optional.of(new Profile(sampleUser, "New User")));
        when(tokenProvider.generateToken(anyString(), any(), anyString())).thenReturn("mock.access.token");
        when(tokenProvider.generateRefreshToken(anyString())).thenReturn("mock.refresh.token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock.access.token", response.getToken());
        assertEquals("newuser@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should throw 401 Unauthorized for invalid password")
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest("newuser@example.com", "WrongPassword!");

        when(userRepository.findByEmail("newuser@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword!", "$2a$12$hashedPassword")).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> authService.login(request));
        assertEquals(401, exception.getStatusCode().value());
    }
}
