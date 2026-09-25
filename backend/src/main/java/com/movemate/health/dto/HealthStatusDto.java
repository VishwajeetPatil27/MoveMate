package com.movemate.health.dto;

public class HealthStatusDto {

    private String status;
    private String service;
    private String environment;
    private String uptimeSeconds;

    public HealthStatusDto() {
    }

    public HealthStatusDto(String status, String service, String environment, String uptimeSeconds) {
        this.status = status;
        this.service = service;
        this.environment = environment;
        this.uptimeSeconds = uptimeSeconds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getUptimeSeconds() {
        return uptimeSeconds;
    }

    public void setUptimeSeconds(String uptimeSeconds) {
        this.uptimeSeconds = uptimeSeconds;
    }
}
