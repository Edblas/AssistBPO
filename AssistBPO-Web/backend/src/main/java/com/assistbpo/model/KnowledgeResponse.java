package com.assistbpo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

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

    public KnowledgeResponse() {}

    public KnowledgeResponse(String id, String tema, String fluxo, String tipoRenda,
                             Boolean podeAceitar, List<String> acaoAnalista,
                             String respostaDevolucao, Map<String, Object> manual,
                             String link) {
        this.id = id;
        this.tema = tema;
        this.fluxo = fluxo;
        this.tipoRenda = tipoRenda;
        this.podeAceitar = podeAceitar;
        this.acaoAnalista = acaoAnalista;
        this.respostaDevolucao = respostaDevolucao;
        this.manual = manual;
        this.link = link;
    }

    public String getId() { return id; }
    public String getTema() { return tema; }
    public String getFluxo() { return fluxo; }
    public String getTipoRenda() { return tipoRenda; }
    public Boolean getPodeAceitar() { return podeAceitar; }
    public List<String> getAcaoAnalista() { return acaoAnalista; }
    public String getRespostaDevolucao() { return respostaDevolucao; }
    public Map<String, Object> getManual() { return manual; }
    public String getLink() { return link; }
}

