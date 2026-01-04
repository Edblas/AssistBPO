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

    @ManyToOne
    @JoinColumn(name = "theme_id")
    private Theme themeObj;

    @Column(name = "fluxo")
    private String fluxo; // nome do documento

    @Column(name = "tipo_renda")
    private String tipoRenda;

    @Column(name = "pode_aceitar")
    private Boolean podeAceitar;

    @Column(name = "condicao", columnDefinition = "TEXT")
    private String condicao;

    @Column(name = "video_explicativo")
    private String videoExplicativo;

    @ElementCollection
    @CollectionTable(name = "doc_keywords", joinColumns = @JoinColumn(name = "doc_id"))
    @Column(name = "keyword")
    private List<String> keywords;

    @ElementCollection
    @CollectionTable(name = "doc_acao_analista", joinColumns = @JoinColumn(name = "doc_id"))
    @Column(name = "acao")
    private List<String> acaoAnalista;

    @ElementCollection
    @CollectionTable(name = "doc_modelos_aceitos", joinColumns = @JoinColumn(name = "doc_id"))
    @Column(name = "link_pdf")
    private List<String> modelosAceitosNaoAceitos;

    @ElementCollection
    @CollectionTable(name = "doc_respostas_devolucao", joinColumns = @JoinColumn(name = "doc_id"))
    @Column(name = "resposta")
    private List<String> respostasDevolucao;

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
                        List<String> respostasDevolucao, String manualLinkFluxo, String manualLinkResposta) {
        this.slug = slug;
        this.tema = tema;
        this.fluxo = fluxo;
        this.tipoRenda = tipoRenda;
        this.podeAceitar = podeAceitar;
        this.acaoAnalista = acaoAnalista;
        this.respostasDevolucao = respostasDevolucao;
        this.manualLinkFluxo = manualLinkFluxo;
        this.manualLinkResposta = manualLinkResposta;
        updateSearchableText();
    }

    public void updateSearchableText() {
        String text = (tema != null ? tema : "") + " " +
                      (fluxo != null ? fluxo : "") + " " +
                      (tipoRenda != null ? tipoRenda : "") + " " +
                      (condicao != null ? condicao : "") + " " +
                      (keywords != null ? String.join(" ", keywords) : "") + " " +
                      (acaoAnalista != null ? String.join(" ", acaoAnalista) : "") + " " +
                      (modelosAceitosNaoAceitos != null ? String.join(" ", modelosAceitosNaoAceitos) : "") + " " +
                      (respostasDevolucao != null ? String.join(" ", respostasDevolucao) : "");
        this.searchableText = normalize(text);
    }

    public Theme getThemeObj() {
        return themeObj;
    }

    public void setThemeObj(Theme themeObj) {
        this.themeObj = themeObj;
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
    public String getCondicao() { return condicao; }
    public void setCondicao(String condicao) { this.condicao = condicao; }
    public String getVideoExplicativo() { return videoExplicativo; }
    public void setVideoExplicativo(String videoExplicativo) { this.videoExplicativo = videoExplicativo; }
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public List<String> getAcaoAnalista() { return acaoAnalista; }
    public void setAcaoAnalista(List<String> acaoAnalista) { this.acaoAnalista = acaoAnalista; }
    public List<String> getModelosAceitosNaoAceitos() { return modelosAceitosNaoAceitos; }
    public void setModelosAceitosNaoAceitos(List<String> modelosAceitosNaoAceitos) { this.modelosAceitosNaoAceitos = modelosAceitosNaoAceitos; }
    public List<String> getRespostasDevolucao() { return respostasDevolucao; }
    public void setRespostasDevolucao(List<String> respostasDevolucao) { this.respostasDevolucao = respostasDevolucao; }
    public String getManualLinkFluxo() { return manualLinkFluxo; }
    public void setManualLinkFluxo(String manualLinkFluxo) { this.manualLinkFluxo = manualLinkFluxo; }
    public String getManualLinkResposta() { return manualLinkResposta; }
    public void setManualLinkResposta(String manualLinkResposta) { this.manualLinkResposta = manualLinkResposta; }
    public String getSearchableText() { return searchableText; }
    public void setSearchableText(String searchableText) { this.searchableText = searchableText; }
}
