package com.movemate.user;

import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should save user and retrieve by email")
    void testSaveAndFindByEmail() {
        User user = new User("test@example.com", "$2a$12$hashvalue", Role.USER, AccountStatus.ACTIVE);
        userRepository.save(user);

        Optional<User> found = userRepository.findByEmail("test@example.com");
        assertTrue(found.isPresent());
        assertEquals("test@example.com", found.get().getEmail());
        assertEquals(Role.USER, found.get().getRole());
        assertEquals(AccountStatus.ACTIVE, found.get().getStatus());
    }

    @Test
    @DisplayName("Should return true when email exists")
    void testExistsByEmail() {
        User user = new User("exists@example.com", "$2a$12$hashvalue", Role.USER, AccountStatus.ACTIVE);
        userRepository.save(user);

        assertTrue(userRepository.existsByEmail("exists@example.com"));
        assertFalse(userRepository.existsByEmail("nonexistent@example.com"));
    }
}
