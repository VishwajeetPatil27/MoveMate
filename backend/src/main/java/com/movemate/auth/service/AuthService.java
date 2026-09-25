package com.movemate.auth.service;

import com.movemate.auth.dto.AuthResponse;
import com.movemate.auth.dto.LoginRequest;
import com.movemate.auth.dto.RefreshTokenRequest;
import com.movemate.auth.dto.RegisterRequest;
import com.movemate.security.JwtTokenProvider;
import com.movemate.user.dto.UserDto;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Profile;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.ProfileRepository;
import com.movemate.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       ProfileRepository profileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email address is already registered");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.USER;
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(normalizedEmail, hashedPassword, role, AccountStatus.ACTIVE);
        user.setLastLogin(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        Profile profile = new Profile(savedUser, request.getFullName().trim());
        profileRepository.save(profile);

        String accessToken = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getEmail());

        UserDto userDto = new UserDto(
                savedUser.getId(),
                savedUser.getEmail(),
                profile.getFullName(),
                savedUser.getRole(),
                savedUser.getStatus(),
                savedUser.getLastLogin(),
                savedUser.getCreatedAt()
        );

        return new AuthResponse(accessToken, refreshToken, tokenProvider.getExpirationMs(), userDto);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (user.getStatus() == AccountStatus.SUSPENDED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is suspended. Please contact support.");
        }

        user.setLastLogin(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        String fullName = profileRepository.findByUserId(updatedUser.getId())
                .map(Profile::getFullName)
                .orElse(updatedUser.getEmail().split("@")[0]);

        String accessToken = tokenProvider.generateToken(updatedUser.getEmail(), updatedUser.getId(), updatedUser.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(updatedUser.getEmail());

        UserDto userDto = new UserDto(
                updatedUser.getId(),
                updatedUser.getEmail(),
                fullName,
                updatedUser.getRole(),
                updatedUser.getStatus(),
                updatedUser.getLastLogin(),
                updatedUser.getCreatedAt()
        );

        return new AuthResponse(accessToken, refreshToken, tokenProvider.getExpirationMs(), userDto);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshTokenStr = request.getRefreshToken();

        if (!tokenProvider.validateToken(refreshTokenStr)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshTokenStr);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (user.getStatus() == AccountStatus.SUSPENDED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is suspended");
        }

        String fullName = profileRepository.findByUserId(user.getId())
                .map(Profile::getFullName)
                .orElse(user.getEmail().split("@")[0]);

        String newAccessToken = tokenProvider.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        UserDto userDto = new UserDto(
                user.getId(),
                user.getEmail(),
                fullName,
                user.getRole(),
                user.getStatus(),
                user.getLastLogin(),
                user.getCreatedAt()
        );

        return new AuthResponse(newAccessToken, newRefreshToken, tokenProvider.getExpirationMs(), userDto);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String fullName = profileRepository.findByUserId(user.getId())
                .map(Profile::getFullName)
                .orElse(user.getEmail().split("@")[0]);

        return new UserDto(
                user.getId(),
                user.getEmail(),
                fullName,
                user.getRole(),
                user.getStatus(),
                user.getLastLogin(),
                user.getCreatedAt()
        );
    }
}
