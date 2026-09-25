package com.movemate.housing.dto;

import com.movemate.housing.entity.AccommodationType;
import com.movemate.housing.entity.FurnishingStatus;
import com.movemate.housing.entity.GenderPreference;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CreateAccommodationRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Property type is required")
    private AccommodationType type = AccommodationType.ROOM;

    @NotNull(message = "Rent is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Rent must be greater than zero")
    private BigDecimal rent;

    private BigDecimal deposit;

    @NotNull(message = "Location ID is required")
    private Long locationId;

    private LocalDate availableFrom;

    private GenderPreference genderPreference = GenderPreference.ANY;

    private FurnishingStatus furnished = FurnishingStatus.SEMI_FURNISHED;

    private String facilities;

    private List<String> imageUrls;

    public CreateAccommodationRequest() {}

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

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
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

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
