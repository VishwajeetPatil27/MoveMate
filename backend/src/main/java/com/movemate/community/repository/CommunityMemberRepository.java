package com.movemate.community.repository;

import com.movemate.community.entity.CommunityMember;
import com.movemate.community.entity.CommunityMemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityMemberRepository extends JpaRepository<CommunityMember, Long> {

    Optional<CommunityMember> findByCommunityIdAndUserId(Long communityId, Long userId);

    boolean existsByCommunityIdAndUserIdAndStatus(Long communityId, Long userId, CommunityMemberStatus status);

    long countByCommunityIdAndStatus(Long communityId, CommunityMemberStatus status);

    List<CommunityMember> findByUserIdAndStatus(Long userId, CommunityMemberStatus status);

    @Query("SELECT cm FROM CommunityMember cm JOIN FETCH cm.user u WHERE cm.community.id = :communityId AND cm.status = 'ACTIVE'")
    List<CommunityMember> findActiveMembersByCommunityId(@Param("communityId") Long communityId);

    void deleteByCommunityIdAndUserId(Long communityId, Long userId);
}
