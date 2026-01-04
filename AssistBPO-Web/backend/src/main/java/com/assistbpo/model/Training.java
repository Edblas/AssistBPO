package com.assistbpo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "training")
public class Training {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "descricao_curta")
    private String descricaoCurta;

    @Column(name = "udemy_url", nullable = false)
    private String udemyUrl;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(name = "ordem_exibicao")
    private Integer ordem = 0;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private TrainingCategory category;

    public Training() {}

    public Training(String titulo, String descricaoCurta, String udemyUrl, TrainingCategory category, Integer ordem) {
        this.titulo = titulo;
        this.descricaoCurta = descricaoCurta;
        this.udemyUrl = udemyUrl;
        this.category = category;
        this.ordem = ordem;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public TrainingCategory getCategory() { return category; }
    public void setCategory(TrainingCategory category) { this.category = category; }
}
