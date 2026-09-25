package com.movemate.community.service;

import com.movemate.community.dto.CommunityDto;
import com.movemate.community.dto.CommunityMemberDto;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommunityMemberService {

    private final CommunityMemberRepository communityMemberRepository;
    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    public CommunityMemberService(CommunityMemberRepository communityMemberRepository,
                                  CommunityRepository communityRepository,
                                  UserRepository userRepository) {
        this.communityMemberRepository = communityMemberRepository;
        this.communityRepository = communityRepository;
        this.userRepository = userRepository;
    }

    public CommunityDto joinCommunity(String userEmail, Long communityId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        if (community.getStatus() != CommunityStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot join an inactive or archived community");
        }

        Optional<CommunityMember> existingMember = communityMemberRepository.findByCommunityIdAndUserId(communityId, user.getId());
        if (existingMember.isPresent()) {
            CommunityMember member = existingMember.get();
            if (member.getStatus() == CommunityMemberStatus.ACTIVE) {
                // Idempotent: User is already an active member
                long count = communityMemberRepository.countByCommunityIdAndStatus(communityId, CommunityMemberStatus.ACTIVE);
                return CommunityDto.fromEntity(community, count, true, member.getRole());
            } else {
                member.setStatus(CommunityMemberStatus.ACTIVE);
                communityMemberRepository.save(member);
                long count = communityMemberRepository.countByCommunityIdAndStatus(communityId, CommunityMemberStatus.ACTIVE);
                return CommunityDto.fromEntity(community, count, true, member.getRole());
            }
        }

        CommunityMember newMember = new CommunityMember(community, user, CommunityMemberRole.MEMBER);
        communityMemberRepository.save(newMember);

        long count = communityMemberRepository.countByCommunityIdAndStatus(communityId, CommunityMemberStatus.ACTIVE);
        return CommunityDto.fromEntity(community, count, true, CommunityMemberRole.MEMBER);
    }

    public CommunityDto leaveCommunity(String userEmail, Long communityId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        // Check if user is creator
        if (community.getCreator().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Community creator cannot leave their own community. You can archive the community instead.");
        }

        Optional<CommunityMember> existingMember = communityMemberRepository.findByCommunityIdAndUserId(communityId, user.getId());
        if (existingMember.isPresent()) {
            communityMemberRepository.deleteByCommunityIdAndUserId(communityId, user.getId());
        }

        long count = communityMemberRepository.countByCommunityIdAndStatus(communityId, CommunityMemberStatus.ACTIVE);
        return CommunityDto.fromEntity(community, count, false, null);
    }

    @Transactional(readOnly = true)
    public List<CommunityDto> getMyJoinedCommunities(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<CommunityMember> memberships = communityMemberRepository.findByUserIdAndStatus(user.getId(), CommunityMemberStatus.ACTIVE);

        return memberships.stream()
                .map(m -> {
                    Community c = m.getCommunity();
                    long count = communityMemberRepository.countByCommunityIdAndStatus(c.getId(), CommunityMemberStatus.ACTIVE);
                    return CommunityDto.fromEntity(c, count, true, m.getRole());
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommunityMemberDto> getCommunityMembers(Long communityId) {
        if (!communityRepository.existsById(communityId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found");
        }

        List<CommunityMember> members = communityMemberRepository.findActiveMembersByCommunityId(communityId);
        return members.stream()
                .map(CommunityMemberDto::fromEntity)
                .collect(Collectors.toList());
    }
}
