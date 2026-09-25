package com.movemate.community.service;

import com.movemate.community.dto.CreateReportRequest;
import com.movemate.community.dto.ReportDto;
import com.movemate.community.entity.Report;
import com.movemate.community.repository.ReportRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    public ReportDto submitReport(String currentUserEmail, CreateReportRequest request) {
        User reporter = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (reportRepository.existsByReporterIdAndTargetTypeAndTargetId(reporter.getId(), request.getTargetType(), request.getTargetId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already reported this content");
        }

        Report report = new Report(reporter, request.getTargetType(), request.getTargetId(), request.getReason(), request.getDescription());
        report = reportRepository.save(report);

        return ReportDto.fromEntity(report);
    }
}
