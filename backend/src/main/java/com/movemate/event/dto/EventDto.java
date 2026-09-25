package com.movemate.event.dto;

import com.movemate.event.entity.EventStatus;
import com.movemate.event.entity.RsvpStatus;
import java.time.LocalDateTime;

public class EventDto {

    private Long id;
    private Long communityId;
    private String communityName;
    private String communitySlug;

    private Long creatorId;
    private String creatorName;

    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Integer capacity;
    private long attendeeCount;

    private EventStatus status;
    private boolean isAttending;
    private RsvpStatus userRsvpStatus;

    private LocalDateTime createdAt;

    public EventDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCommunityId() { return communityId; }
    public void setCommunityId(Long communityId) { this.communityId = communityId; }

    public String getCommunityName() { return communityName; }
    public void setCommunityName(String communityName) { this.communityName = communityName; }

    public String getCommunitySlug() { return communitySlug; }
    public void setCommunitySlug(String communitySlug) { this.communitySlug = communitySlug; }

    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public long getAttendeeCount() { return attendeeCount; }
    public void setAttendeeCount(long attendeeCount) { this.attendeeCount = attendeeCount; }

    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }

    public boolean isAttending() { return isAttending; }
    public void setAttending(boolean attending) { isAttending = attending; }

    public RsvpStatus getUserRsvpStatus() { return userRsvpStatus; }
    public void setUserRsvpStatus(RsvpStatus userRsvpStatus) { this.userRsvpStatus = userRsvpStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
