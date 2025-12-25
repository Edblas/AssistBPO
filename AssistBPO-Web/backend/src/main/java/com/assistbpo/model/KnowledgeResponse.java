package com.assistbpo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class KnowledgeResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("tema")
    private String tema;

    @JsonProperty("fluxo")
    private String fluxo;

    @JsonProperty("tipo_renda")
    private String tipoRenda;

    @JsonProperty("pode_aceitar")
    private Boolean podeAceitar;

    @JsonProperty("acao_analista")
    private List<String> acaoAnalista;

    @JsonProperty("resposta_devolucao")
    private String respostaDevolucao;

    @JsonProperty("manual")
    private Map<String, Object> manual;

    @JsonProperty("link")
    private String link;

    // ===================== CONSTRUTORES =====================
    public KnowledgeResponse() {
        this.acaoAnalista = List.of();
    }

    public KnowledgeResponse(String id, String tema, String fluxo, String tipoRenda,
                             Boolean podeAceitar, List<String> acaoAnalista,
                             String respostaDevolucao, Map<String, Object> manual,
                             String link) {
        this.id = id;
        this.tema = tema;
        this.fluxo = fluxo;
        this.tipoRenda = tipoRenda;
        this.podeAceitar = podeAceitar;
        this.acaoAnalista = acaoAnalista != null ? acaoAnalista : List.of();
        this.respostaDevolucao = respostaDevolucao;
        this.manual = manual;
        this.link = link;
    }

    // ===================== GETTERS =====================
    public String getId() { return id; }
    public String getTema() { return tema; }
    public String getFluxo() { return fluxo; }
    public String getTipoRenda() { return tipoRenda; }
    public Boolean getPodeAceitar() { return podeAceitar; }
    public List<String> getAcaoAnalista() { return acaoAnalista; }
    public String getRespostaDevolucao() { return respostaDevolucao; }
    public Map<String, Object> getManual() { return manual; }
    public String getLink() { return link; }

    // ===================== SETTERS =====================
    public void setId(String id) { this.id = id; }
    public void setTema(String tema) { this.tema = tema; }
    public void setFluxo(String fluxo) { this.fluxo = fluxo; }
    public void setTipoRenda(String tipoRenda) { this.tipoRenda = tipoRenda; }
    public void setPodeAceitar(Boolean podeAceitar) { this.podeAceitar = podeAceitar; }
    public void setAcaoAnalista(List<String> acaoAnalista) { this.acaoAnalista = acaoAnalista; }
    public void setRespostaDevolucao(String respostaDevolucao) { this.respostaDevolucao = respostaDevolucao; }
    public void setManual(Map<String, Object> manual) { this.manual = manual; }
    public void setLink(String link) { this.link = link; }

    // ===================== UTILITÁRIOS =====================
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof KnowledgeResponse)) return false;
        KnowledgeResponse that = (KnowledgeResponse) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(tema, that.tema) &&
               Objects.equals(fluxo, that.fluxo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, tema, fluxo);
    }

    @Override
    public String toString() {
        return "KnowledgeResponse{" +
                "id='" + id + '\'' +
                ", tema='" + tema + '\'' +
                ", fluxo='" + fluxo + '\'' +
                ", tipoRenda='" + tipoRenda + '\'' +
                ", podeAceitar=" + podeAceitar +
                ", acaoAnalista=" + acaoAnalista +
                ", respostaDevolucao='" + respostaDevolucao + '\'' +
                ", manual=" + manual +
                ", link='" + link + '\'' +
                '}';
    }
}
