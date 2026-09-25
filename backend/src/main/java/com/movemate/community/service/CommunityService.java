package com.movemate.community.service;

import com.movemate.community.dto.CommunityDto;
import com.movemate.community.dto.CreateCommunityRequest;
import com.movemate.community.dto.UpdateCommunityRequest;
import com.movemate.community.entity.*;
import com.movemate.community.repository.CommunityMemberRepository;
import com.movemate.community.repository.CommunityRepository;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.entity.RelocationRequest;
import com.movemate.relocation.entity.RelocationStatus;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final RelocationRequestRepository relocationRequestRepository;

    public CommunityService(CommunityRepository communityRepository,
                            CommunityMemberRepository communityMemberRepository,
                            UserRepository userRepository,
                            LocationRepository locationRepository,
                            RelocationRequestRepository relocationRequestRepository) {
        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
        this.relocationRequestRepository = relocationRequestRepository;
    }

    public CommunityDto createCommunity(String userEmail, CreateCommunityRequest request) {
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (communityRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A community with this name already exists");
        }

        Location originLoc = locationRepository.findById(request.getOriginLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Origin location not found"));

        Location destLoc = locationRepository.findById(request.getDestinationLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination location not found"));

        String slug = generateSlug(request.getName().trim());

        Community community = new Community(
                request.getName().trim(),
                slug,
                request.getDescription() != null ? request.getDescription().trim() : null,
                originLoc,
                destLoc,
                creator
        );

        if (request.getCategory() != null) {
            community.setCategory(request.getCategory());
        }
        if (request.getLanguage() != null && !request.getLanguage().isBlank()) {
            community.setLanguage(request.getLanguage().trim());
        }
        if (request.getCoverImage() != null && !request.getCoverImage().isBlank()) {
            community.setCoverImage(request.getCoverImage().trim());
        }

        Community savedCommunity = communityRepository.save(community);

        // Creator automatically joins as LEADER
        CommunityMember leaderMember = new CommunityMember(savedCommunity, creator, CommunityMemberRole.LEADER);
        communityMemberRepository.save(leaderMember);

        return enrichCommunityDto(savedCommunity, creator);
    }

    @Transactional(readOnly = true)
    public Page<CommunityDto> searchCommunities(String search, CommunityCategory category, Long destinationLocationId, Pageable pageable, String currentUserEmail) {
        User user = currentUserEmail != null ? userRepository.findByEmail(currentUserEmail).orElse(null) : null;
        Page<Community> communities = communityRepository.searchCommunities(
                (search != null && !search.isBlank()) ? search.trim() : null,
                category,
                destinationLocationId,
                pageable
        );

        return communities.map(c -> enrichCommunityDto(c, user));
    }

    @Transactional(readOnly = true)
    public CommunityDto getCommunityByIdOrSlug(String idOrSlug, String currentUserEmail) {
        User user = currentUserEmail != null ? userRepository.findByEmail(currentUserEmail).orElse(null) : null;
        Community community;

        try {
            Long id = Long.parseLong(idOrSlug);
            community = communityRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));
        } catch (NumberFormatException e) {
            community = communityRepository.findBySlug(idOrSlug)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));
        }

        return enrichCommunityDto(community, user);
    }

    @Transactional(readOnly = true)
    public List<CommunityDto> getRecommendedCommunities(String currentUserEmail) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Check user's active relocation intent
        List<RelocationRequest> relocations = relocationRequestRepository.findByUserId(user.getId());
        Optional<RelocationRequest> activeReloc = relocations.stream()
                .filter(r -> r.getStatus() == RelocationStatus.ACTIVE)
                .findFirst();

        List<Community> recommended = new ArrayList<>();
        if (activeReloc.isPresent()) {
            Long destId = activeReloc.get().getDestinationLocation().getId();
            recommended = communityRepository.findRecommendedCommunitiesForDestination(destId, PageRequest.of(0, 6));
        }

        if (recommended.isEmpty()) {
            // Fallback to latest active communities
            recommended = communityRepository.findByStatus(CommunityStatus.ACTIVE, PageRequest.of(0, 6)).getContent();
        }

        return recommended.stream()
                .map(c -> enrichCommunityDto(c, user))
                .collect(Collectors.toList());
    }

    public CommunityDto updateCommunity(String currentUserEmail, Long communityId, UpdateCommunityRequest request) {
        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found"));

        // Ownership Security Check: Only creator can update
        if (!community.getCreator().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to modify this community");
        }

        if (request.getDescription() != null) {
            community.setDescription(request.getDescription().trim());
        }
        if (request.getCategory() != null) {
            community.setCategory(request.getCategory());
        }
        if (request.getLanguage() != null) {
            community.setLanguage(request.getLanguage().trim());
        }
        if (request.getCoverImage() != null) {
            community.setCoverImage(request.getCoverImage().trim());
        }
        if (request.getStatus() != null) {
            community.setStatus(request.getStatus());
        }

        Community saved = communityRepository.save(community);
        return enrichCommunityDto(saved, user);
    }

    private CommunityDto enrichCommunityDto(Community community, User currentUser) {
        long memberCount = communityMemberRepository.countByCommunityIdAndStatus(community.getId(), CommunityMemberStatus.ACTIVE);
        boolean isJoined = false;
        CommunityMemberRole memberRole = null;

        if (currentUser != null) {
            Optional<CommunityMember> memberOpt = communityMemberRepository.findByCommunityIdAndUserId(community.getId(), currentUser.getId());
            if (memberOpt.isPresent() && memberOpt.get().getStatus() == CommunityMemberStatus.ACTIVE) {
                isJoined = true;
                memberRole = memberOpt.get().getRole();
            }
        }

        return CommunityDto.fromEntity(community, memberCount, isJoined, memberRole);
    }

    private String generateSlug(String name) {
        String nowhitespace = name.toLowerCase().replaceAll("\\s+", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = normalized.replaceAll("[^\\w-]", "");
        if (slug.length() > 140) {
            slug = slug.substring(0, 140);
        }
        if (communityRepository.existsBySlug(slug)) {
            slug += "-" + System.currentTimeMillis() % 10000;
        }
        return slug;
    }
}
