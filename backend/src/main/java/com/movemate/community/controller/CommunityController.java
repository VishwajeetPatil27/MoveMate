package com.movemate.community.controller;

import com.movemate.common.response.ApiResponse;
import com.movemate.community.dto.CommunityDto;
import com.movemate.community.dto.CommunityMemberDto;
import com.movemate.community.dto.CreateCommunityRequest;
import com.movemate.community.dto.UpdateCommunityRequest;
import com.movemate.community.entity.CommunityCategory;
import com.movemate.community.service.CommunityMemberService;
import com.movemate.community.service.CommunityService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/communities")
public class CommunityController {

    private final CommunityService communityService;
    private final CommunityMemberService communityMemberService;

    public CommunityController(CommunityService communityService, CommunityMemberService communityMemberService) {
        this.communityService = communityService;
        this.communityMemberService = communityMemberService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<CommunityDto>>> searchCommunities(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CommunityCategory category,
            @RequestParam(required = false) Long destinationLocationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<CommunityDto> result = communityService.searchCommunities(search, category, destinationLocationId, pageable, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.success(result, "Communities fetched successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<CommunityDto>>> searchAlias(
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(required = false) CommunityCategory category,
            @RequestParam(required = false) Long destinationLocationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication
    ) {
        return searchCommunities(query, category, destinationLocationId, page, size, authentication);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<CommunityDto>>> getMyJoinedCommunities(Authentication authentication) {
        List<CommunityDto> myCommunities = communityMemberService.getMyJoinedCommunities(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(myCommunities, "User joined communities fetched successfully"));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<CommunityDto>>> getRecommendedCommunities(Authentication authentication) {
        List<CommunityDto> recommended = communityService.getRecommendedCommunities(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(recommended, "Recommended communities fetched successfully"));
    }

    @GetMapping("/{idOrSlug}")
    public ResponseEntity<ApiResponse<CommunityDto>> getCommunityDetails(
            @PathVariable String idOrSlug,
            Authentication authentication
    ) {
        String currentUserEmail = (authentication != null && authentication.isAuthenticated()) ? authentication.getName() : null;
        CommunityDto community = communityService.getCommunityByIdOrSlug(idOrSlug, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.success(community, "Community details fetched successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommunityDto>> createCommunity(
            @Valid @RequestBody CreateCommunityRequest request,
            Authentication authentication
    ) {
        CommunityDto created = communityService.createCommunity(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Community created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CommunityDto>> updateCommunity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommunityRequest request,
            Authentication authentication
    ) {
        CommunityDto updated = communityService.updateCommunity(authentication.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Community updated successfully"));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<CommunityDto>> joinCommunity(
            @PathVariable Long id,
            Authentication authentication
    ) {
        CommunityDto joined = communityMemberService.joinCommunity(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(joined, "Joined community successfully"));
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<CommunityDto>> leaveCommunity(
            @PathVariable Long id,
            Authentication authentication
    ) {
        CommunityDto left = communityMemberService.leaveCommunity(authentication.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(left, "Left community successfully"));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<CommunityMemberDto>>> getCommunityMembers(@PathVariable Long id) {
        List<CommunityMemberDto> members = communityMemberService.getCommunityMembers(id);
        return ResponseEntity.ok(ApiResponse.success(members, "Community members fetched successfully"));
    }
}
