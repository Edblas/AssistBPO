package com.assistbpo.model;

import jakarta.persistence.*;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Entity
@Table(name = "knowledge_docs")
public class KnowledgeDoc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slug", unique = true)
    private String slug;

    @Column(name = "source_file")
    private String sourceFile;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "active")
    private Boolean active = true;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Column(name = "tema")
    private String tema;

    @Column(name = "fluxo")
    private String fluxo; // nome do documento

    @Column(name = "tipo_renda")
    private String tipoRenda;

    @Column(name = "pode_aceitar")
    private Boolean podeAceitar;

    @ElementCollection
    @CollectionTable(name = "doc_acao_analista", joinColumns = @JoinColumn(name = "doc_id"))
    @Column(name = "acao")
    private List<String> acaoAnalista;

    @ElementCollection
    @CollectionTable(name = "doc_modelos_aceitos", joinColumns = @JoinColumn(name = "doc_id"))
    @Column(name = "link_pdf")
    private List<String> modelosAceitos;

    @ElementCollection
    @CollectionTable(name = "doc_modelos_nao_aceitos", joinColumns = @JoinColumn(name = "doc_id"))
    @Column(name = "link_pdf")
    private List<String> modelosNaoAceitos;

    @Column(name = "resposta_devolucao", columnDefinition = "TEXT")
    private String respostaDevolucao;

    @Column(name = "manual_link_fluxo", columnDefinition = "TEXT")
    private String manualLinkFluxo;
    
    @Column(name = "manual_link_resposta", columnDefinition = "TEXT")
    private String manualLinkResposta;

    @Column(name = "searchable_text", columnDefinition = "TEXT")
    private String searchableText;

    // Construtor vazio para JPA
    public KnowledgeDoc() {}

    // Construtor completo
    public KnowledgeDoc(String slug, String tema, String fluxo, String tipoRenda,
                        Boolean podeAceitar, List<String> acaoAnalista,
                        String respostaDevolucao, String manualLinkFluxo, String manualLinkResposta) {
        this.slug = slug;
        this.tema = tema;
        this.fluxo = fluxo;
        this.tipoRenda = tipoRenda;
        this.podeAceitar = podeAceitar;
        this.acaoAnalista = acaoAnalista;
        this.respostaDevolucao = respostaDevolucao;
        this.manualLinkFluxo = manualLinkFluxo;
        this.manualLinkResposta = manualLinkResposta;
        updateSearchableText();
    }

    public void updateSearchableText() {
        String text = (tema != null ? tema : "") + " " +
                      (fluxo != null ? fluxo : "") + " " +
                      (tipoRenda != null ? tipoRenda : "") + " " +
                      (acaoAnalista != null ? String.join(" ", acaoAnalista) : "");
        this.searchableText = normalize(text);
    }

    private static String normalize(String s) {
        if (s == null) return "";
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]+", " ")
                .trim();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getSourceFile() { return sourceFile; }
    public void setSourceFile(String sourceFile) { this.sourceFile = sourceFile; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public String getTema() { return tema; }
    public void setTema(String tema) { this.tema = tema; }
    public String getFluxo() { return fluxo; }
    public void setFluxo(String fluxo) { this.fluxo = fluxo; }
    public String getTipoRenda() { return tipoRenda; }
    public void setTipoRenda(String tipoRenda) { this.tipoRenda = tipoRenda; }
    public Boolean getPodeAceitar() { return podeAceitar; }
    public void setPodeAceitar(Boolean podeAceitar) { this.podeAceitar = podeAceitar; }
    public List<String> getAcaoAnalista() { return acaoAnalista; }
    public void setAcaoAnalista(List<String> acaoAnalista) { this.acaoAnalista = acaoAnalista; }
    public List<String> getModelosAceitos() { return modelosAceitos; }
    public void setModelosAceitos(List<String> modelosAceitos) { this.modelosAceitos = modelosAceitos; }
    public List<String> getModelosNaoAceitos() { return modelosNaoAceitos; }
    public void setModelosNaoAceitos(List<String> modelosNaoAceitos) { this.modelosNaoAceitos = modelosNaoAceitos; }
    public String getRespostaDevolucao() { return respostaDevolucao; }
    public void setRespostaDevolucao(String respostaDevolucao) { this.respostaDevolucao = respostaDevolucao; }
    public String getManualLinkFluxo() { return manualLinkFluxo; }
    public void setManualLinkFluxo(String manualLinkFluxo) { this.manualLinkFluxo = manualLinkFluxo; }
    public String getManualLinkResposta() { return manualLinkResposta; }
    public void setManualLinkResposta(String manualLinkResposta) { this.manualLinkResposta = manualLinkResposta; }
    public String getSearchableText() { return searchableText; }
    public void setSearchableText(String searchableText) { this.searchableText = searchableText; }
}
