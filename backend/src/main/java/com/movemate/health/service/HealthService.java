package com.movemate.health.service;

import com.movemate.health.dto.HealthStatusDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;

@Service
public class HealthService {

    @Value("${spring.application.name:movemate-backend}")
    private String applicationName;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public HealthStatusDto checkHealth() {
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();
        double uptimeSec = uptimeMs / 1000.0;
        return new HealthStatusDto(
                "UP",
                applicationName,
                activeProfile,
                String.format("%.2fs", uptimeSec)
        );
    }
}
