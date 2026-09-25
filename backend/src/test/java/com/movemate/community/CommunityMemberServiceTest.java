package com.movemate.community;

import com.movemate.community.dto.CommunityDto;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.community.service.CommunityMemberService;
import com.movemate.location.entity.Location;
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
class CommunityMemberServiceTest {

    @Mock
    private CommunityMemberRepository communityMemberRepository;

    @Mock
    private CommunityRepository communityRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommunityMemberService communityMemberService;

    private User creator;
    private User regularUser;
    private Community community;

    @BeforeEach
    void setUp() {
        creator = new User();
        creator.setId(1L);
        creator.setEmail("creator@example.com");

        regularUser = new User();
        regularUser.setId(2L);
        regularUser.setEmail("member@example.com");

        Location originLoc = new Location("India", "Maharashtra", "Sangli", "City Center");
        Location destLoc = new Location("India", "Maharashtra", "Pune", "Kothrud");

        community = new Community("Pune Relocators", "pune-relocators", "Community", originLoc, destLoc, creator);
        community.setId(10L);
        community.setStatus(CommunityStatus.ACTIVE);
    }

    @Test
    void joinCommunity_Success() {
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(regularUser));
        when(communityRepository.findById(10L)).thenReturn(Optional.of(community));
        when(communityMemberRepository.findByCommunityIdAndUserId(10L, 2L)).thenReturn(Optional.empty());
        when(communityMemberRepository.countByCommunityIdAndStatus(10L, CommunityMemberStatus.ACTIVE)).thenReturn(1L);

        CommunityDto dto = communityMemberService.joinCommunity("member@example.com", 10L);

        assertNotNull(dto);
        assertTrue(dto.isJoined());
        verify(communityMemberRepository, times(1)).save(any(CommunityMember.class));
    }

    @Test
    void joinCommunity_Idempotent_WhenAlreadyMember() {
        CommunityMember member = new CommunityMember(community, regularUser, CommunityMemberRole.MEMBER);
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(regularUser));
        when(communityRepository.findById(10L)).thenReturn(Optional.of(community));
        when(communityMemberRepository.findByCommunityIdAndUserId(10L, 2L)).thenReturn(Optional.of(member));
        when(communityMemberRepository.countByCommunityIdAndStatus(10L, CommunityMemberStatus.ACTIVE)).thenReturn(1L);

        CommunityDto dto = communityMemberService.joinCommunity("member@example.com", 10L);

        assertNotNull(dto);
        assertTrue(dto.isJoined());
        verify(communityMemberRepository, never()).save(any(CommunityMember.class));
    }

    @Test
    void leaveCommunity_BadRequest_WhenCreatorAttemptsToLeave() {
        when(userRepository.findByEmail("creator@example.com")).thenReturn(Optional.of(creator));
        when(communityRepository.findById(10L)).thenReturn(Optional.of(community));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                communityMemberService.leaveCommunity("creator@example.com", 10L)
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertTrue(ex.getReason().contains("creator cannot leave"));
    }

    @Test
    void leaveCommunity_Success_WhenRegularMember() {
        CommunityMember member = new CommunityMember(community, regularUser, CommunityMemberRole.MEMBER);
        when(userRepository.findByEmail("member@example.com")).thenReturn(Optional.of(regularUser));
        when(communityRepository.findById(10L)).thenReturn(Optional.of(community));
        when(communityMemberRepository.findByCommunityIdAndUserId(10L, 2L)).thenReturn(Optional.of(member));

        CommunityDto dto = communityMemberService.leaveCommunity("member@example.com", 10L);

        assertNotNull(dto);
        assertFalse(dto.isJoined());
        verify(communityMemberRepository, times(1)).deleteByCommunityIdAndUserId(10L, 2L);
    }
}
