package com.assistbpo.dto;

public class VolumetricsSyncDTO {
    private String date; // YYYY-MM-DD
    private Integer count;

    public VolumetricsSyncDTO() {}

    public VolumetricsSyncDTO(String date, Integer count) {
        this.date = date;
        this.count = count;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }
}
