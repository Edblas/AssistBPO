package com.assistbpo.controller;

import com.assistbpo.model.KnowledgeDoc;
import com.assistbpo.repository.KnowledgeDocRepository;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.util.*;

@RestController
@CrossOrigin
public class ConsultaController {

    private final KnowledgeDocRepository repository;

    public ConsultaController(KnowledgeDocRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/api/consulta")
    public Map<String, Object> consultar(
            @RequestBody(required = false) Map<String, Object> body) {

        String pergunta = body == null
                ? ""
                : Objects.toString(body.get("pergunta"), "");

        String norm = normalize(pergunta);

        Map<String, Object> resp = new HashMap<>();

        if (norm.isBlank()) {
            resp.put("resposta", respostaVazia());
            return resp;
        }

        // Busca simplificada no banco
        // Tenta encontrar um documento que contenha a pergunta ou parte dela
        // Aqui estamos simplificando a lógica de "slug" anterior para uma busca textual
        // Idealmente, usaríamos Full Text Search do Postgres
        List<KnowledgeDoc> docs = repository.searchByText(norm);
        
        KnowledgeDoc doc = null;
        if (!docs.isEmpty()) {
            // Pega o primeiro resultado (ou implementa lógica de melhor match)
            doc = docs.get(0);
        }

        if (doc == null) {
            // Tenta buscar por palavras-chave individuais se a frase completa falhar
            // (Lógica muito simples, apenas para manter funcionalidade similar)
            String[] parts = norm.split(" ");
            for (String part : parts) {
                if (part.length() > 3) {
                    docs = repository.searchByText(part);
                    if (!docs.isEmpty()) {
                        doc = docs.get(0);
                        break;
                    }
                }
            }
        }

        if (doc == null) {
            resp.put("resposta", respostaVazia());
            return resp;
        }

        resp.put("resposta", montarResposta(doc));
        return resp;
    }

    private String montarResposta(KnowledgeDoc doc) {
        StringBuilder sb = new StringBuilder();

        sb.append("Tema: ").append(doc.getTema() != null ? doc.getTema() : "").append('\n');
        sb.append("Fluxo: ").append(doc.getFluxo() != null ? doc.getFluxo() : "").append('\n');
        sb.append("Pode Aceitar: ").append(doc.getPodeAceitar() != null ? doc.getPodeAceitar() : false).append('\n');
        // sb.append("Condição: ").append(doc.getCondicao()).append('\n'); // Campo removido na entidade simplificada? Se precisar, adicionar.

        sb.append("Ações do Analista:\n");
        if (doc.getAcaoAnalista() != null) {
            for (String a : doc.getAcaoAnalista()) {
                sb.append("- ").append(a).append('\n');
            }
        }

        // Novos campos: Modelos Aceitos e Não Aceitos
        if (doc.getModelosAceitos() != null && !doc.getModelosAceitos().isEmpty()) {
            sb.append("Modelos Aceitos:\n");
            for (String link : doc.getModelosAceitos()) {
                sb.append("- ").append(link).append('\n');
            }
        }

        if (doc.getModelosNaoAceitos() != null && !doc.getModelosNaoAceitos().isEmpty()) {
            sb.append("Modelos Não Aceitos:\n");
            for (String link : doc.getModelosNaoAceitos()) {
                sb.append("- ").append(link).append('\n');
            }
        }

        sb.append("Resposta de Devolução: ")
                .append(doc.getRespostaDevolucao() != null ? doc.getRespostaDevolucao() : "")
                .append('\n');

        sb.append("Fonte: ").append(doc.getManualLinkFluxo() != null ? doc.getManualLinkFluxo() : "").append('\n');

        return sb.toString();
    }

    private String respostaVazia() {
        return "Tema: \nFluxo: \nAções do Analista:\nResposta de Devolução: \nFonte: ";
    }

    private static String normalize(String s) {
        if (s == null) return "";
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]+", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}
