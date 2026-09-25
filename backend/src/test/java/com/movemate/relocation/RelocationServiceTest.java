package com.movemate.relocation;

import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.dto.CreateRelocationRequest;
import com.movemate.relocation.dto.RelocationRequestDto;
import com.movemate.relocation.dto.UpdateRelocationRequest;
import com.movemate.relocation.entity.RelocationPurpose;
import com.movemate.relocation.entity.RelocationRequest;
import com.movemate.relocation.entity.RelocationStatus;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.relocation.service.RelocationService;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RelocationServiceTest {

    @Mock
    private RelocationRequestRepository relocationRequestRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LocationRepository locationRepository;

    @InjectMocks
    private RelocationService relocationService;

    private User userA;
    private User userB;
    private Location originLoc;
    private Location destLoc;
    private RelocationRequest relocationA;

    @BeforeEach
    void setUp() {
        userA = new User();
        userA.setId(1L);
        userA.setEmail("usera@example.com");

        userB = new User();
        userB.setId(2L);
        userB.setEmail("userb@example.com");

        originLoc = new Location("India", "Maharashtra", "Pune", "Kothrud");
        originLoc.setId(10L);

        destLoc = new Location("India", "Karnataka", "Bangalore", "Whitefield");
        destLoc.setId(20L);

        relocationA = new RelocationRequest(userA, originLoc, destLoc, RelocationPurpose.JOB, LocalDate.now().plusMonths(1));
        relocationA.setId(100L);
        relocationA.setBudget(new BigDecimal("25000.00"));
        relocationA.setStatus(RelocationStatus.ACTIVE);
    }

    @Test
    void createRelocationRequest_Success() {
        when(userRepository.findByEmail("usera@example.com")).thenReturn(Optional.of(userA));
        when(locationRepository.findById(10L)).thenReturn(Optional.of(originLoc));
        when(locationRepository.findById(20L)).thenReturn(Optional.of(destLoc));
        when(relocationRequestRepository.save(any(RelocationRequest.class))).thenAnswer(i -> {
            RelocationRequest r = i.getArgument(0);
            r.setId(101L);
            return r;
        });

        CreateRelocationRequest createReq = new CreateRelocationRequest();
        createReq.setOriginLocationId(10L);
        createReq.setDestinationLocationId(20L);
        createReq.setPurpose(RelocationPurpose.JOB);
        createReq.setMovingDate(LocalDate.now().plusDays(30));
        createReq.setBudget(new BigDecimal("20000"));

        RelocationRequestDto result = relocationService.createRelocationRequest("usera@example.com", createReq);

        assertNotNull(result);
        assertEquals(101L, result.getId());
        assertEquals("Pune", result.getOriginLocation().getCity());
        assertEquals("Bangalore", result.getDestinationLocation().getCity());
        assertEquals(RelocationStatus.ACTIVE, result.getStatus());
    }

    @Test
    void updateRelocationRequest_Forbidden_WhenNotOwner() {
        when(userRepository.findByEmail("userb@example.com")).thenReturn(Optional.of(userB));
        when(relocationRequestRepository.findById(100L)).thenReturn(Optional.of(relocationA));

        UpdateRelocationRequest updateReq = new UpdateRelocationRequest();
        updateReq.setDestinationArea("HSR Layout");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                relocationService.updateRelocationRequest("userb@example.com", 100L, updateReq)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertTrue(ex.getReason().contains("not authorized"));
    }

    @Test
    void cancelRelocationRequest_Success_WhenOwner() {
        when(userRepository.findByEmail("usera@example.com")).thenReturn(Optional.of(userA));
        when(relocationRequestRepository.findById(100L)).thenReturn(Optional.of(relocationA));
        when(relocationRequestRepository.save(any(RelocationRequest.class))).thenAnswer(i -> i.getArgument(0));

        RelocationRequestDto result = relocationService.cancelRelocationRequest("usera@example.com", 100L);

        assertNotNull(result);
        assertEquals(RelocationStatus.CANCELLED, result.getStatus());
    }
}
