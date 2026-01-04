package com.assistbpo.dto;

public class VolumetricsDashboardDTO {
    private VolumetricPeriodStats daily;
    private VolumetricPeriodStats weekly;
    private VolumetricPeriodStats biweekly;
    private VolumetricPeriodStats monthly;
    private VolumetricPeriodStats annual;

    public VolumetricsDashboardDTO() {}

    public VolumetricPeriodStats getDaily() { return daily; }
    public void setDaily(VolumetricPeriodStats daily) { this.daily = daily; }

    public VolumetricPeriodStats getWeekly() { return weekly; }
    public void setWeekly(VolumetricPeriodStats weekly) { this.weekly = weekly; }

    public VolumetricPeriodStats getBiweekly() { return biweekly; }
    public void setBiweekly(VolumetricPeriodStats biweekly) { this.biweekly = biweekly; }

    public VolumetricPeriodStats getMonthly() { return monthly; }
    public void setMonthly(VolumetricPeriodStats monthly) { this.monthly = monthly; }

    public VolumetricPeriodStats getAnnual() { return annual; }
    public void setAnnual(VolumetricPeriodStats annual) { this.annual = annual; }
}
