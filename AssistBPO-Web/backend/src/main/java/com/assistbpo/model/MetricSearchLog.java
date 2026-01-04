package com.assistbpo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "metric_search_log")
public class MetricSearchLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "search_term")
    private String searchTerm;

    @ManyToOne
    @JoinColumn(name = "theme_id")
    private Theme theme;

    @Column(name = "search_timestamp", nullable = false)
    private LocalDateTime searchTimestamp;

    public MetricSearchLog() {}

    public MetricSearchLog(String searchTerm, Theme theme) {
        this.searchTerm = searchTerm;
        this.theme = theme;
        this.searchTimestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    public LocalDateTime getSearchTimestamp() {
        return searchTimestamp;
    }

    public void setSearchTimestamp(LocalDateTime searchTimestamp) {
        this.searchTimestamp = searchTimestamp;
    }
}
