package com.assistbpo.model;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

public class KnowledgeDoc {

    private final String documentoNome;
    private final boolean podeAceitar;
    private final String tipoRenda;
    private final List<String> acaoAnalista;
    private final String manual;
    private final String link;
    private final String source;
    private final String searchableText;

    // ================= CONSTRUTOR =================
    public KnowledgeDoc(
            String documentoNome,
            boolean podeAceitar,
            String tipoRenda,
            List<String> acaoAnalista,
            String manual,
            String link,
            String source
    ) {
        this.documentoNome = documentoNome;
        this.podeAceitar = podeAceitar;
        this.tipoRenda = tipoRenda;
        this.acaoAnalista = acaoAnalista == null ? List.of() : List.copyOf(acaoAnalista);
        this.manual = manual;
        this.link = link;
        this.source = source;
        this.searchableText = buildSearchable(
                documentoNome, tipoRenda, this.acaoAnalista, manual, link, source
        );
    }

    // ================= GETTERS =================
    public String getDocumentoNome() { return documentoNome; }
    public boolean isPodeAceitar() { return podeAceitar; }
    public String getTipoRenda() { return tipoRenda; }
    public List<String> getAcaoAnalista() { return acaoAnalista; }
    public String getManual() { return manual; }
    public String getLink() { return link; }
    public String getSource() { return source; }
    public String getSearchableText() { return searchableText; }

    // ================= SEARCH =================
    private static String buildSearchable(
            String nome,
            String tipo,
            List<String> acoes,
            String manual,
            String link,
            String source
    ) {
        StringBuilder sb = new StringBuilder();
        append(sb, nome);
        append(sb, tipo);
        if (acoes != null) acoes.forEach(a -> append(sb, a));
        append(sb, manual);
        append(sb, link);
        append(sb, source);

        return Normalizer.normalize(sb.toString(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
    }

    private static void append(StringBuilder sb, String value) {
        if (value != null && !value.isBlank()) {
            sb.append(value).append(' ');
        }
    }
}
