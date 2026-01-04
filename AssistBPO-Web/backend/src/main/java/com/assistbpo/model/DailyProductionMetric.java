package com.assistbpo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_production_metric", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_identifier", "production_date"})
})
public class DailyProductionMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_identifier", nullable = false)
    private String userIdentifier;

    @Column(name = "user_role", nullable = false)
    private String userRole;

    @Column(name = "production_date", nullable = false)
    private LocalDate date;

    @Column(name = "production_count", nullable = false)
    private Integer count;

    @Column(name = "last_sync_timestamp", nullable = false)
    private LocalDateTime lastSyncTimestamp;

    public DailyProductionMetric() {}

    public DailyProductionMetric(String userIdentifier, String userRole, LocalDate date, Integer count) {
        this.userIdentifier = userIdentifier;
        this.userRole = userRole;
        this.date = date;
        this.count = count;
        this.lastSyncTimestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserIdentifier() { return userIdentifier; }
    public void setUserIdentifier(String userIdentifier) { this.userIdentifier = userIdentifier; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }

    public LocalDateTime getLastSyncTimestamp() { return lastSyncTimestamp; }
    public void setLastSyncTimestamp(LocalDateTime lastSyncTimestamp) { this.lastSyncTimestamp = lastSyncTimestamp; }
}
