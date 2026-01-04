package com.assistbpo.dto;

public class TrainingRequest {

    private String titulo;
    private String descricaoCurta;
    private String udemyUrl;
    private Boolean ativo = true;
    private Integer ordem = 0;
    private Long categoryId;

    public TrainingRequest() {}

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricaoCurta() { return descricaoCurta; }
    public void setDescricaoCurta(String descricaoCurta) { this.descricaoCurta = descricaoCurta; }
    public String getUdemyUrl() { return udemyUrl; }
    public void setUdemyUrl(String udemyUrl) { this.udemyUrl = udemyUrl; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public Integer getOrdem() { return ordem; }
    public void setOrdem(Integer ordem) { this.ordem = ordem; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
