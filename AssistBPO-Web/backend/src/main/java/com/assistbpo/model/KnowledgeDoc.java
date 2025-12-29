package com.assistbpo.model;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

public class KnowledgeDoc {

    private final String documentoNome;
    private final boolean podeAceitar;
    private final String tipoRenda;
    private final List<String> acaoAnalista;
    private final String searchableText;

    public KnowledgeDoc(String documentoNome,
                        boolean podeAceitar,
                        String tipoRenda,
                        List<String> acaoAnalista) {

        this.documentoNome = documentoNome;
        this.podeAceitar = podeAceitar;
        this.tipoRenda = tipoRenda;
        this.acaoAnalista = acaoAnalista == null ? List.of() : acaoAnalista;
        this.searchableText = normalize(
                documentoNome + " " + tipoRenda + " " + String.join(" ", this.acaoAnalista)
        );
    }

    public String getDocumentoNome() { return documentoNome; }
    public boolean isPodeAceitar() { return podeAceitar; }
    public String getTipoRenda() { return tipoRenda; }
    public List<String> getAcaoAnalista() { return acaoAnalista; }
    public String getSearchableText() { return searchableText; }

    private static String normalize(String s) {
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]+", " ")
                .trim();
    }
}
