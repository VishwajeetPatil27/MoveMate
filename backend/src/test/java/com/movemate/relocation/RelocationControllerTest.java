package com.movemate.relocation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.dto.CreateRelocationRequest;
import com.movemate.relocation.entity.RelocationPurpose;
import com.movemate.relocation.entity.RelocationRequest;
import com.movemate.relocation.entity.RelocationStatus;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RelocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RelocationRequestRepository relocationRequestRepository;

    @Autowired
    private com.movemate.notification.repository.NotificationRepository notificationRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;
    private Location originLocation;
    private Location destinationLocation;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        relocationRequestRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User("relocctrl@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE);
        testUser = userRepository.save(testUser);

        originLocation = locationRepository.findAll().stream().findFirst()
                .orElseGet(() -> locationRepository.save(new Location("India", "Maharashtra", "Sangli", "City Center")));

        destinationLocation = locationRepository.save(new Location("India", "Karnataka", "Bangalore", "Whitefield"));
    }

    @Test
    @WithMockUser(username = "relocctrl@example.com", roles = {"USER"})
    void createRelocation_Success() throws Exception {
        CreateRelocationRequest req = new CreateRelocationRequest();
        req.setOriginLocationId(originLocation.getId());
        req.setDestinationLocationId(destinationLocation.getId());
        req.setPurpose(RelocationPurpose.JOB);
        req.setMovingDate(LocalDate.now().plusMonths(1));
        req.setBudget(new BigDecimal("18000.00"));
        req.setProfession("Senior Developer");

        mockMvc.perform(post("/api/v1/relocations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.purpose").value("JOB"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(username = "relocctrl@example.com", roles = {"USER"})
    void getMyRelocations_Success() throws Exception {
        RelocationRequest reloc = new RelocationRequest(testUser, originLocation, destinationLocation, RelocationPurpose.EDUCATION, LocalDate.now().plusDays(15));
        reloc.setStatus(RelocationStatus.ACTIVE);
        relocationRequestRepository.save(reloc);

        mockMvc.perform(get("/api/v1/relocations/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].purpose").value("EDUCATION"));
    }
}
