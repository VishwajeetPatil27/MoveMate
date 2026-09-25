package com.movemate.community.entity;

import com.movemate.common.entity.BaseEntity;
import com.movemate.location.entity.Location;
import com.movemate.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "communities", indexes = {
        @Index(name = "idx_community_route", columnList = "origin_location_id, destination_location_id"),
        @Index(name = "idx_community_category", columnList = "category"),
        @Index(name = "idx_community_status", columnList = "status")
})
public class Community extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 3, max = 150)
    @Column(name = "name", nullable = false, unique = true, length = 150)
    private String name;

    @NotBlank
    @Size(min = 3, max = 150)
    @Column(name = "slug", nullable = false, unique = true, length = 150)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_location_id", nullable = false)
    private Location originLocation;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_location_id", nullable = false)
    private Location destinationLocation;

    @Column(name = "language", length = 50)
    private String language = "English";

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private CommunityCategory category = CommunityCategory.REGIONAL;

    @Column(name = "cover_image", length = 500)
    private String coverImage;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User creator;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CommunityStatus status = CommunityStatus.ACTIVE;

    public Community() {
    }

    public Community(String name, String slug, String description, Location originLocation, Location destinationLocation, User creator) {
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.creator = creator;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public CommunityCategory getCategory() {
        return category;
    }

    public void setCategory(CommunityCategory category) {
        this.category = category;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public CommunityStatus getStatus() {
        return status;
    }

    public void setStatus(CommunityStatus status) {
        this.status = status;
    }
}
