package com.movemate.admin.service;

import com.movemate.admin.dto.AuditLogDto;
import com.movemate.admin.entity.AuditLog;
import com.movemate.admin.repository.AuditLogRepository;
import com.movemate.user.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public AuditLog recordAction(User actor, String action, String targetType, Long targetId, String details) {
        AuditLog log = new AuditLog(actor, action, targetType, targetId, details);
        return auditLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(AuditLogDto::new);
    }
}
