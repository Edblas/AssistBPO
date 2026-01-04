package com.assistbpo.dto;

public class VolumetricPeriodStats {
    private int totalFluxos;
    private double mediaDiaria;
    private int diasComRegistro;

    public VolumetricPeriodStats() {}

    public VolumetricPeriodStats(int totalFluxos, double mediaDiaria, int diasComRegistro) {
        this.totalFluxos = totalFluxos;
        this.mediaDiaria = mediaDiaria;
        this.diasComRegistro = diasComRegistro;
    }

    public int getTotalFluxos() { return totalFluxos; }
    public void setTotalFluxos(int totalFluxos) { this.totalFluxos = totalFluxos; }

    public double getMediaDiaria() { return mediaDiaria; }
    public void setMediaDiaria(double mediaDiaria) { this.mediaDiaria = mediaDiaria; }

    public int getDiasComRegistro() { return diasComRegistro; }
    public void setDiasComRegistro(int diasComRegistro) { this.diasComRegistro = diasComRegistro; }
}
