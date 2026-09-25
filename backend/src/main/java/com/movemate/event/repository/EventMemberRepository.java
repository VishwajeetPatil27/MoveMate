package com.movemate.event.repository;

import com.movemate.event.entity.EventMember;
import com.movemate.event.entity.RsvpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventMemberRepository extends JpaRepository<EventMember, Long> {

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    Optional<EventMember> findByEventIdAndUserId(Long eventId, Long userId);

    long countByEventIdAndStatus(Long eventId, RsvpStatus status);

    Page<EventMember> findByUserIdOrderByJoinedAtDesc(Long userId, Pageable pageable);

    void deleteByEventIdAndUserId(Long eventId, Long userId);
}
