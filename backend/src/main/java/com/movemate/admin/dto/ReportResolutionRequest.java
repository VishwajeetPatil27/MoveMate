package com.movemate.admin.dto;

import com.movemate.community.entity.ReportStatus;
import jakarta.validation.constraints.NotNull;

public class ReportResolutionRequest {

    @NotNull(message = "Resolution status is required")
    private ReportStatus status;

    private String resolutionAction;
    private String adminNotes;

    public ReportResolutionRequest() {}

    public ReportResolutionRequest(ReportStatus status, String resolutionAction, String adminNotes) {
        this.status = status;
        this.resolutionAction = resolutionAction;
        this.adminNotes = adminNotes;
    }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public String getResolutionAction() { return resolutionAction; }
    public void setResolutionAction(String resolutionAction) { this.resolutionAction = resolutionAction; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
