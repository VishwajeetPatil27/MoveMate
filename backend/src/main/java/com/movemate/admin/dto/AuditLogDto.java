package com.movemate.admin.dto;

import com.movemate.admin.entity.AuditLog;
import java.time.LocalDateTime;

public class AuditLogDto {

    private Long id;
    private Long actorId;
    private String actorName;
    private String actorEmail;
    private String action;
    private String targetType;
    private Long targetId;
    private String details;
    private LocalDateTime createdAt;

    public AuditLogDto() {}

    public AuditLogDto(AuditLog auditLog) {
        this.id = auditLog.getId();
        if (auditLog.getActor() != null) {
            this.actorId = auditLog.getActor().getId();
            this.actorEmail = auditLog.getActor().getEmail();
            this.actorName = auditLog.getActor().getEmail().split("@")[0];
        }
        this.action = auditLog.getAction();
        this.targetType = auditLog.getTargetType();
        this.targetId = auditLog.getTargetId();
        this.details = auditLog.getDetails();
        this.createdAt = auditLog.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getActorId() { return actorId; }
    public void setActorId(Long actorId) { this.actorId = actorId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
