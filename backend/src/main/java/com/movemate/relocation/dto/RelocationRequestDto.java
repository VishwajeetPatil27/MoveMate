package com.movemate.relocation.dto;

import com.movemate.location.dto.LocationDto;
import com.movemate.relocation.entity.RelocationPurpose;
import com.movemate.relocation.entity.RelocationRequest;
import com.movemate.relocation.entity.RelocationStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RelocationRequestDto {

    private Long id;
    private Long userId;
    private String userName;
    private LocationDto originLocation;
    private LocationDto destinationLocation;
    private String destinationArea;
    private RelocationPurpose purpose;
    private String profession;
    private BigDecimal budget;
    private LocalDate movingDate;
    private String requirements;
    private RelocationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RelocationRequestDto() {
    }

    public RelocationRequestDto(RelocationRequest request) {
        if (request != null) {
            this.id = request.getId();
            if (request.getUser() != null) {
                this.userId = request.getUser().getId();
                if (request.getUser().getProfile() != null) {
                    this.userName = request.getUser().getProfile().getFullName();
                } else {
                    this.userName = request.getUser().getEmail();
                }
            }
            if (request.getOriginLocation() != null) {
                this.originLocation = new LocationDto(request.getOriginLocation());
            }
            if (request.getDestinationLocation() != null) {
                this.destinationLocation = new LocationDto(request.getDestinationLocation());
            }
            this.destinationArea = request.getDestinationArea();
            this.purpose = request.getPurpose();
            this.profession = request.getProfession();
            this.budget = request.getBudget();
            this.movingDate = request.getMovingDate();
            this.requirements = request.getRequirements();
            this.status = request.getStatus();
            this.createdAt = request.getCreatedAt();
            this.updatedAt = request.getUpdatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocationDto getOriginLocation() {
        return originLocation;
    }

    public void setOriginLocation(LocationDto originLocation) {
        this.originLocation = originLocation;
    }

    public LocationDto getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(LocationDto destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public String getDestinationArea() {
        return destinationArea;
    }

    public void setDestinationArea(String destinationArea) {
        this.destinationArea = destinationArea;
    }

    public RelocationPurpose getPurpose() {
        return purpose;
    }

    public void setPurpose(RelocationPurpose purpose) {
        this.purpose = purpose;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public LocalDate getMovingDate() {
        return movingDate;
    }

    public void setMovingDate(LocalDate movingDate) {
        this.movingDate = movingDate;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public RelocationStatus getStatus() {
        return status;
    }

    public void setStatus(RelocationStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
