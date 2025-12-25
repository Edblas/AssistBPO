package com.assistbpo.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.*;

import java.nio.file.*;
import java.text.Normalizer;
import java.util.*;

@RestController
@CrossOrigin
public class ConsultaController {

    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, String> rendaPjMap = new HashMap<>();

    private Path dataRoot;

    /* ======================== INIT ======================= */

    @PostConstruct
    public void init() {
        dataRoot = resolveDataDir();
        loadIndexMappings(dataRoot);

        System.out.println("✔ DATA ROOT = " +
                (dataRoot == null ? "null" : dataRoot.toAbsolutePath()));
        System.out.println("✔ INDEX MAP = " + rendaPjMap);
    }

    /* ======================== API ======================== */

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

        String slug = matchSlug(norm);
        System.out.println("✔ pergunta='" + norm + "' slug=" + slug);

        if (slug == null) {
            resp.put("resposta", respostaVazia());
            return resp;
        }

        Map<String, Object> doc = loadDocBySlug(slug);
        if (doc == null) {
            resp.put("resposta", respostaVazia());
            return resp;
        }

        resp.put("resposta", montarResposta(doc));
        return resp;
    }

    /* ======================== INDEX ======================== */

    private void loadIndexMappings(Path root) {
        rendaPjMap.clear();

        try {
            if (root == null) return;

            Path idx = root.resolve("index.json");
            if (!Files.exists(idx)) return;

            Map<?, ?> raw = mapper.readValue(
                    Files.readAllBytes(idx),
                    new TypeReference<Map<?, ?>>() {}
            );

            Object rendaPj = raw.get("renda_pj");
            if (rendaPj instanceof Map<?, ?> map) {
                for (Map.Entry<?, ?> e : map.entrySet()) {
                    rendaPjMap.put(
                            normalize(String.valueOf(e.getKey())),
                            String.valueOf(e.getValue())
                    );
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String matchSlug(String pergunta) {
        if (rendaPjMap.containsKey(pergunta)) {
            return rendaPjMap.get(pergunta);
        }
        for (Map.Entry<String, String> e : rendaPjMap.entrySet()) {
            if (pergunta.contains(e.getKey())) {
                return e.getValue();
            }
        }
        return null;
    }

    /* ======================== DOC ======================== */

    private Map<String, Object> loadDocBySlug(String slug) {
        try {
            if (dataRoot == null) return null;

            Path p = dataRoot
                    .resolve("renda_pj")
                    .resolve(slug)
                    .resolve("index.json");

            if (!Files.exists(p)) return null;

            return mapper.readValue(
                    Files.readAllBytes(p),
                    new TypeReference<Map<String, Object>>() {}
            );

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /* ======================== RESPOSTA ======================== */

    private String montarResposta(Map<String, Object> doc) {

        StringBuilder sb = new StringBuilder();

        sb.append("Tema: ").append(v(doc, "tema")).append('\n');
        sb.append("Fluxo: ").append(v(doc, "documento")).append('\n');
        sb.append("Pode Aceitar: ").append(v(doc, "pode_aceitar")).append('\n');
        sb.append("Condição: ").append(v(doc, "condicao")).append('\n');

        sb.append("Ações do Analista:\n");
        Object acoes = doc.get("acao_analista");
        if (acoes instanceof List<?> list) {
            for (Object a : list) {
                sb.append("- ").append(a).append('\n');
            }
        }

        sb.append("Resposta de Devolução: ")
          .append(v(doc, "resposta_devolucao"))
          .append('\n');

        Object manual = doc.get("manual");
        if (manual instanceof Map<?, ?> m) {
            Object link = m.get("link_fluxo");
            sb.append("Fonte: ").append(link == null ? "" : link).append('\n');
        } else {
            sb.append("Fonte: \n");
        }

        return sb.toString();
    }

    private String respostaVazia() {
        return "Tema: \nFluxo: \nAções do Analista:\nResposta de Devolução: \nFonte: ";
    }

    /* ======================== UTILS ======================== */

    private static String v(Map<String, Object> m, String k) {
        Object o = m.get(k);
        return o == null ? "" : o.toString();
    }

    private static Path resolveDataDir() {
        Path[] tries = {
                Paths.get("data"),
                Paths.get("backend", "data"),
                Paths.get("../data")
        };
        for (Path p : tries) {
            if (Files.exists(p) && Files.isDirectory(p)) {
                return p;
            }
        }
        return null;
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
