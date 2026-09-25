package com.movemate.admin.dto;

import com.movemate.user.entity.AccountStatus;
import jakarta.validation.constraints.NotNull;

public class UserStatusUpdateRequest {

    @NotNull(message = "New user status is required")
    private AccountStatus status;

    private String reason;

    public UserStatusUpdateRequest() {}

    public UserStatusUpdateRequest(AccountStatus status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public AccountStatus getStatus() { return status; }
    public void setStatus(AccountStatus status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
