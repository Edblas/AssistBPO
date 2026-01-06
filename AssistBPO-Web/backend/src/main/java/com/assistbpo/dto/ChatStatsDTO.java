package com.assistbpo.dto;

public class ChatStatsDTO {
    private long daily;
    private long weekly;
    private long annual;

    public ChatStatsDTO() {}

    public ChatStatsDTO(long daily, long weekly, long annual) {
        this.daily = daily;
        this.weekly = weekly;
        this.annual = annual;
    }

    public long getDaily() { return daily; }
    public void setDaily(long daily) { this.daily = daily; }

    public long getWeekly() { return weekly; }
    public void setWeekly(long weekly) { this.weekly = weekly; }

    public long getAnnual() { return annual; }
    public void setAnnual(long annual) { this.annual = annual; }
}
