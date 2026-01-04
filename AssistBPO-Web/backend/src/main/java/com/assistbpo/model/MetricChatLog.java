package com.assistbpo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "metric_chat_log")
public class MetricChatLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question", columnDefinition = "TEXT")
    private String question;

    @ManyToOne
    @JoinColumn(name = "theme_id")
    private Theme theme;

    @Column(name = "chat_timestamp", nullable = false)
    private LocalDateTime chatTimestamp;

    public MetricChatLog() {}

    public MetricChatLog(String question, Theme theme) {
        this.question = question;
        this.theme = theme;
        this.chatTimestamp = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Theme getTheme() {
        return theme;
    }

    public void setTheme(Theme theme) {
        this.theme = theme;
    }

    public LocalDateTime getChatTimestamp() {
        return chatTimestamp;
    }

    public void setChatTimestamp(LocalDateTime chatTimestamp) {
        this.chatTimestamp = chatTimestamp;
    }
}
