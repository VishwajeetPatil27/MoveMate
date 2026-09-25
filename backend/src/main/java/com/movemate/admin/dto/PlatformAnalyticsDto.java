package com.movemate.admin.dto;

public class PlatformAnalyticsDto {

    private long totalUsers;
    private long activeUsers;
    private long totalCommunities;
    private long totalPosts;
    private long totalComments;
    private long totalMessages;
    private long totalAccommodations;
    private long totalServices;
    private long totalEvents;
    private long pendingReports;
    private long totalNotifications;

    public PlatformAnalyticsDto() {}

    public PlatformAnalyticsDto(long totalUsers, long activeUsers, long totalCommunities,
                                long totalPosts, long totalComments, long totalMessages,
                                long totalAccommodations, long totalServices, long totalEvents,
                                long pendingReports, long totalNotifications) {
        this.totalUsers = totalUsers;
        this.activeUsers = activeUsers;
        this.totalCommunities = totalCommunities;
        this.totalPosts = totalPosts;
        this.totalComments = totalComments;
        this.totalMessages = totalMessages;
        this.totalAccommodations = totalAccommodations;
        this.totalServices = totalServices;
        this.totalEvents = totalEvents;
        this.pendingReports = pendingReports;
        this.totalNotifications = totalNotifications;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getTotalCommunities() { return totalCommunities; }
    public void setTotalCommunities(long totalCommunities) { this.totalCommunities = totalCommunities; }

    public long getTotalPosts() { return totalPosts; }
    public void setTotalPosts(long totalPosts) { this.totalPosts = totalPosts; }

    public long getTotalComments() { return totalComments; }
    public void setTotalComments(long totalComments) { this.totalComments = totalComments; }

    public long getTotalMessages() { return totalMessages; }
    public void setTotalMessages(long totalMessages) { this.totalMessages = totalMessages; }

    public long getTotalAccommodations() { return totalAccommodations; }
    public void setTotalAccommodations(long totalAccommodations) { this.totalAccommodations = totalAccommodations; }

    public long getTotalServices() { return totalServices; }
    public void setTotalServices(long totalServices) { this.totalServices = totalServices; }

    public long getTotalEvents() { return totalEvents; }
    public void setTotalEvents(long totalEvents) { this.totalEvents = totalEvents; }

    public long getPendingReports() { return pendingReports; }
    public void setPendingReports(long pendingReports) { this.pendingReports = pendingReports; }

    public long getTotalNotifications() { return totalNotifications; }
    public void setTotalNotifications(long totalNotifications) { this.totalNotifications = totalNotifications; }
}
