package com.movemate.admin;

import com.movemate.admin.entity.AuditLog;
import com.movemate.admin.repository.AuditLogRepository;
import com.movemate.admin.service.AuditLogService;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogService auditLogService;

    private User adminUser;

    @BeforeEach
    void setUp() {
        adminUser = new User("admin@movemate.com", "hash", Role.ADMIN, AccountStatus.ACTIVE);
        adminUser.setId(10L);
    }

    @Test
    void recordAction_Success() {
        AuditLog saved = new AuditLog(adminUser, "UPDATE_USER_STATUS", "USER", 5L, "Suspended user");
        saved.setId(1L);

        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(saved);

        AuditLog result = auditLogService.recordAction(adminUser, "UPDATE_USER_STATUS", "USER", 5L, "Suspended user");

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("UPDATE_USER_STATUS", result.getAction());
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }
}
