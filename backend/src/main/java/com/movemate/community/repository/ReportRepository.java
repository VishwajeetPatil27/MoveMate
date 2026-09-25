package com.movemate.community.repository;

import com.movemate.community.entity.Report;
import com.movemate.community.entity.ReportTargetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    boolean existsByReporterIdAndTargetTypeAndTargetId(Long reporterId, ReportTargetType targetType, Long targetId);

    List<Report> findByReporterId(Long reporterId);

    org.springframework.data.domain.Page<Report> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);

    org.springframework.data.domain.Page<Report> findByStatusOrderByCreatedAtDesc(com.movemate.community.entity.ReportStatus status, org.springframework.data.domain.Pageable pageable);
    
    long countByStatus(com.movemate.community.entity.ReportStatus status);
}
