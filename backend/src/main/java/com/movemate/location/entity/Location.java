package com.movemate.location.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "locations", indexes = {
    @Index(name = "idx_location_city_state", columnList = "city, state"),
    @Index(name = "idx_location_area", columnList = "area")
})
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "country", nullable = false, length = 100)
    private String country = "India";

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @Column(name = "area", length = 100)
    private String area;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    public Location() {
    }

    public Location(String country, String state, String city, String area) {
        this.country = country != null ? country : "India";
        this.state = state;
        this.city = city;
        this.area = area;
    }

    public Location(String country, String state, String city, String area, BigDecimal latitude, BigDecimal longitude) {
        this.country = country != null ? country : "India";
        this.state = state;
        this.city = city;
        this.area = area;
        this.latitude = latitude;
        this.longitude = longitude;
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
}
