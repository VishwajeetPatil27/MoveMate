package com.movemate.relocation.dto;

import com.movemate.relocation.entity.RelocationPurpose;
import com.movemate.relocation.entity.RelocationStatus;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public class UpdateRelocationRequest {

    private Long originLocationId;
    private Long destinationLocationId;

    @Size(max = 100, message = "Destination area must not exceed 100 characters")
    private String destinationArea;

    private RelocationPurpose purpose;

    @Size(max = 100, message = "Profession must not exceed 100 characters")
    private String profession;

    private BigDecimal budget;
    private LocalDate movingDate;

    @Size(max = 2000, message = "Requirements must not exceed 2000 characters")
    private String requirements;

    private RelocationStatus status;

    public UpdateRelocationRequest() {
    }

    public Long getOriginLocationId() {
        return originLocationId;
    }

    public void setOriginLocationId(Long originLocationId) {
        this.originLocationId = originLocationId;
    }

    public Long getDestinationLocationId() {
        return destinationLocationId;
    }

    public void setDestinationLocationId(Long destinationLocationId) {
        this.destinationLocationId = destinationLocationId;
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
}
