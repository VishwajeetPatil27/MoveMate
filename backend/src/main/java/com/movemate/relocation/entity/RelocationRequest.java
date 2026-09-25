package com.movemate.relocation.entity;

import com.movemate.common.entity.BaseEntity;
import com.movemate.location.entity.Location;
import com.movemate.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "relocation_requests", indexes = {
    @Index(name = "idx_rr_user", columnList = "user_id"),
    @Index(name = "idx_rr_route", columnList = "origin_location_id, destination_location_id"),
    @Index(name = "idx_rr_status", columnList = "status")
})
public class RelocationRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "origin_location_id", nullable = false)
    private Location originLocation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destination_location_id", nullable = false)
    private Location destinationLocation;

    @Column(name = "destination_area", length = 100)
    private String destinationArea;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", length = 50)
    private RelocationPurpose purpose;

    @Column(name = "profession", length = 100)
    private String profession;

    @Column(name = "budget", precision = 10, scale = 2)
    private BigDecimal budget;

    @Column(name = "moving_date")
    private LocalDate movingDate;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RelocationStatus status = RelocationStatus.ACTIVE;

    public RelocationRequest() {
    }

    public RelocationRequest(User user, Location originLocation, Location destinationLocation, RelocationPurpose purpose, LocalDate movingDate) {
        this.user = user;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.purpose = purpose;
        this.movingDate = movingDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Location getOriginLocation() {
        return originLocation;
    }

    public void setOriginLocation(Location originLocation) {
        this.originLocation = originLocation;
    }

    public Location getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(Location destinationLocation) {
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
}
