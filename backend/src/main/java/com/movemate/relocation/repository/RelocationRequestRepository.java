package com.movemate.relocation.repository;

import com.movemate.relocation.entity.RelocationRequest;
import com.movemate.relocation.entity.RelocationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelocationRequestRepository extends JpaRepository<RelocationRequest, Long> {

    List<RelocationRequest> findByUserId(Long userId);

    List<RelocationRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<RelocationRequest> findByUserIdAndStatus(Long userId, RelocationStatus status);

    Optional<RelocationRequest> findFirstByUserIdAndStatusOrderByCreatedAtDesc(Long userId, RelocationStatus status);
}
