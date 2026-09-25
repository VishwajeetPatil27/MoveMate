package com.movemate.services.dto;

import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.entity.ServiceStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecommendationDto {

    private Long id;
    private Long creatorId;
    private String creatorName;
    private String creatorEmail;

    private Long locationId;
    private String city;
    private String state;
    private String area;

    private String title;
    private String description;
    private ServiceCategory category;
    private String subcategory;
    private String address;
    private String phone;
    private String website;

    private BigDecimal latitude;
    private BigDecimal longitude;
    private Double distanceFromUserKm;

    private String openingHours;
    private BigDecimal rating;
    private ServiceStatus status;

    private boolean isSaved;
    private LocalDateTime createdAt;

    public RecommendationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public String getCreatorEmail() { return creatorEmail; }
    public void setCreatorEmail(String creatorEmail) { this.creatorEmail = creatorEmail; }

    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }

    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Double getDistanceFromUserKm() { return distanceFromUserKm; }
    public void setDistanceFromUserKm(Double distanceFromUserKm) { this.distanceFromUserKm = distanceFromUserKm; }

    public String getOpeningHours() { return openingHours; }
    public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public ServiceStatus getStatus() { return status; }
    public void setStatus(ServiceStatus status) { this.status = status; }

    public boolean isSaved() { return isSaved; }
    public void setSaved(boolean saved) { isSaved = saved; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
