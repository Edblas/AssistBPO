package com.assistbpo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "metric_access_log")
public class MetricAccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "knowledge_doc_id", nullable = false)
    private KnowledgeDoc flux;

    @Column(name = "access_timestamp", nullable = false)
    private LocalDateTime accessTimestamp;

    public MetricAccessLog() {}

    public MetricAccessLog(KnowledgeDoc flux) {
        this.flux = flux;
        this.accessTimestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public KnowledgeDoc getFlux() {
        return flux;
    }

    public void setFlux(KnowledgeDoc flux) {
        this.flux = flux;
    }

    public LocalDateTime getAccessTimestamp() {
        return accessTimestamp;
    }

    public void setAccessTimestamp(LocalDateTime accessTimestamp) {
        this.accessTimestamp = accessTimestamp;
    }
}
