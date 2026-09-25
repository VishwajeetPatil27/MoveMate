package com.movemate.community;

import com.movemate.community.dto.CommunityDto;
import com.movemate.community.dto.CreateCommunityRequest;
import com.movemate.community.dto.UpdateCommunityRequest;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.service.CommunityService;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.repository.RelocationRequestRepository;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommunityServiceTest {

    @Mock
    private CommunityRepository communityRepository;

    @Mock
    private CommunityMemberRepository communityMemberRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private RelocationRequestRepository relocationRequestRepository;

    @InjectMocks
    private CommunityService communityService;

    private User creator;
    private User nonOwner;
    private Location originLoc;
    private Location destLoc;
    private Community testCommunity;

    @BeforeEach
    void setUp() {
        creator = new User();
        creator.setId(1L);
        creator.setEmail("creator@example.com");

        nonOwner = new User();
        nonOwner.setId(2L);
        nonOwner.setEmail("nonowner@example.com");

        originLoc = new Location("India", "Maharashtra", "Sangli", "City Center");
        originLoc.setId(10L);

        destLoc = new Location("India", "Maharashtra", "Pune", "Kothrud");
        destLoc.setId(20L);

        testCommunity = new Community("Pune IT Connect", "pune-it-connect", "Community for Pune tech relocators", originLoc, destLoc, creator);
        testCommunity.setId(100L);
    }

    @Test
    void createCommunity_Success() {
        when(userRepository.findByEmail("creator@example.com")).thenReturn(Optional.of(creator));
        when(locationRepository.findById(10L)).thenReturn(Optional.of(originLoc));
        when(locationRepository.findById(20L)).thenReturn(Optional.of(destLoc));
        when(communityRepository.existsByNameIgnoreCase("Pune IT Connect")).thenReturn(false);
        when(communityRepository.save(any(Community.class))).thenAnswer(i -> {
            Community c = i.getArgument(0);
            c.setId(101L);
            return c;
        });

        CreateCommunityRequest createReq = new CreateCommunityRequest();
        createReq.setName("Pune IT Connect");
        createReq.setDescription("Community description");
        createReq.setOriginLocationId(10L);
        createReq.setDestinationLocationId(20L);
        createReq.setCategory(CommunityCategory.PROFESSIONAL);

        CommunityDto dto = communityService.createCommunity("creator@example.com", createReq);

        assertNotNull(dto);
        assertEquals("Pune IT Connect", dto.getName());
        assertEquals("pune-it-connect", dto.getSlug());
        assertEquals(CommunityCategory.PROFESSIONAL, dto.getCategory());
        verify(communityMemberRepository, times(1)).save(any(CommunityMember.class));
    }

    @Test
    void createCommunity_Conflict_WhenDuplicateName() {
        when(userRepository.findByEmail("creator@example.com")).thenReturn(Optional.of(creator));
        when(communityRepository.existsByNameIgnoreCase("Pune IT Connect")).thenReturn(true);

        CreateCommunityRequest createReq = new CreateCommunityRequest();
        createReq.setName("Pune IT Connect");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                communityService.createCommunity("creator@example.com", createReq)
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
    }

    @Test
    void updateCommunity_Forbidden_WhenNotOwner() {
        when(userRepository.findByEmail("nonowner@example.com")).thenReturn(Optional.of(nonOwner));
        when(communityRepository.findById(100L)).thenReturn(Optional.of(testCommunity));

        UpdateCommunityRequest updateReq = new UpdateCommunityRequest();
        updateReq.setDescription("Unauthorized change");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                communityService.updateCommunity("nonowner@example.com", 100L, updateReq)
        );

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatusCode());
        assertTrue(ex.getReason().contains("not authorized"));
    }
}
