package com.movemate.housing.entity;

import com.movemate.common.entity.BaseEntity;
import com.movemate.location.entity.Location;
import com.movemate.user.entity.User;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accommodations", indexes = {
    @Index(name = "idx_acc_search", columnList = "location_id, rent, type, status"),
    @Index(name = "idx_acc_owner", columnList = "owner_id")
})
public class Accommodation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AccommodationType type = AccommodationType.ROOM;

    @Column(name = "rent", nullable = false, precision = 10, scale = 2)
    private BigDecimal rent;

    @Column(name = "deposit", precision = 10, scale = 2)
    private BigDecimal deposit;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(name = "available_from")
    private LocalDate availableFrom;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender_preference")
    private GenderPreference genderPreference = GenderPreference.ANY;

    @Enumerated(EnumType.STRING)
    @Column(name = "furnished")
    private FurnishingStatus furnished = FurnishingStatus.SEMI_FURNISHED;

    @Column(name = "facilities", columnDefinition = "TEXT")
    private String facilities;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AccommodationStatus status = AccommodationStatus.AVAILABLE;

    @OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AccommodationImage> images = new ArrayList<>();

    public Accommodation() {}

    public Accommodation(User owner, String title, String description, AccommodationType type, BigDecimal rent, BigDecimal deposit, Location location) {
        this.owner = owner;
        this.title = title;
        this.description = description;
        this.type = type;
        this.rent = rent;
        this.deposit = deposit;
        this.location = location;
        this.status = AccommodationStatus.AVAILABLE;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AccommodationType getType() {
        return type;
    }

    public void setType(AccommodationType type) {
        this.type = type;
    }

    public BigDecimal getRent() {
        return rent;
    }

    public void setRent(BigDecimal rent) {
        this.rent = rent;
    }

    public BigDecimal getDeposit() {
        return deposit;
    }

    public void setDeposit(BigDecimal deposit) {
        this.deposit = deposit;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(LocalDate availableFrom) {
        this.availableFrom = availableFrom;
    }

    public GenderPreference getGenderPreference() {
        return genderPreference;
    }

    public void setGenderPreference(GenderPreference genderPreference) {
        this.genderPreference = genderPreference;
    }

    public FurnishingStatus getFurnished() {
        return furnished;
    }

    public void setFurnished(FurnishingStatus furnished) {
        this.furnished = furnished;
    }

    public String getFacilities() {
        return facilities;
    }

    public void setFacilities(String facilities) {
        this.facilities = facilities;
    }

    public AccommodationStatus getStatus() {
        return status;
    }

    public void setStatus(AccommodationStatus status) {
        this.status = status;
    }

    public List<AccommodationImage> getImages() {
        return images;
    }

    public void setImages(List<AccommodationImage> images) {
        this.images = images;
    }
}
