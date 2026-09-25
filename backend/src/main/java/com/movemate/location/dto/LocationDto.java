package com.movemate.location.dto;

import com.movemate.location.entity.Location;
import java.math.BigDecimal;

public class LocationDto {

    private Long id;
    private String country;
    private String state;
    private String city;
    private String area;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String displayName;

    public LocationDto() {
    }

    public LocationDto(Location location) {
        if (location != null) {
            this.id = location.getId();
            this.country = location.getCountry();
            this.state = location.getState();
            this.city = location.getCity();
            this.area = location.getArea();
            this.latitude = location.getLatitude();
            this.longitude = location.getLongitude();
            this.displayName = location.getArea() != null && !location.getArea().isEmpty()
                    ? location.getCity() + " (" + location.getArea() + "), " + location.getState()
                    : location.getCity() + ", " + location.getState();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
