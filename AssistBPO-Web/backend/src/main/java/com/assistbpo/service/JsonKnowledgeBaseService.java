package com.assistbpo.service;

import com.assistbpo.model.KnowledgeResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JsonKnowledgeBaseService {

    private final Map<String, KnowledgeResponse> knowledgeMap = new HashMap<>();
    private final List<KnowledgeResponse> allDocs = new ArrayList<>();
    private Path jsonRoot;
    private final ObjectMapper mapper = new ObjectMapper();
    private static final Set<String> JSON_EXT = Set.of(".json");

    @PostConstruct
    public void init() {
        jsonRoot = resolveJsonDir();
        if (jsonRoot != null) {
            loadJsonFiles(jsonRoot);
            System.out.println("✔ Knowledge Base carregada de: " + jsonRoot);
            System.out.println("✔ Documentos carregados: " + allDocs.size());
        } else {
            System.err.println("❌ Pasta renda_pj não encontrada");
        }
    }

    private Path resolveJsonDir() {
        List<Path> candidates = List.of(
                Paths.get("data/renda_pj"),
                Paths.get("backend/data/renda_pj"),
                Paths.get("../data/renda_pj")
        );
        return candidates.stream()
                .filter(p -> Files.exists(p) && Files.isDirectory(p))
                .findFirst()
                .orElse(null);
    }

    private static String normalize(String s) {
        if (s == null) return "";
        String t = java.text.Normalizer.normalize(s, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        t = t.replace('–', '-');
        t = t.toLowerCase(Locale.ROOT);
        t = t.replaceAll("[^a-z0-9\\s]+", " ").replaceAll("\\s+", " ").trim();
        return t;
    }

    private void loadJsonFiles(Path dir) {
        try {
            List<Path> files = Files.walk(dir)
                    .filter(Files::isRegularFile)
                    .filter(f -> f.toString().toLowerCase().endsWith(".json"))
                    .collect(Collectors.toList());

            for (Path file : files) {
                try {
                    String raw = Files.readString(file, StandardCharsets.UTF_8);
                    Map<String, Object> root = mapper.readValue(raw, new TypeReference<Map<String,Object>>() {});

                    String id = getString(root, "id", "");
                    String tema = getString(root, "tema", "");
                    String fluxo = getString(root, "fluxo", getString(root, "documento", ""));
                    String tipoRenda = getString(root, "tipoRenda", "");
                    Boolean podeAceitar = Boolean.valueOf(String.valueOf(root.getOrDefault("podeAceitar", "false")));
                    List<String> acaoAnalista = extractList(root, "acaoAnalista", "acao_analista");
                    String respostaDevolucao = getString(root, "respostaDevolucao", getString(root, "resposta_devolucao", ""));
                    String link = getString(root, "link", "");

                    // Conversão segura de manual
                    Map<String, Object> manual = null;
                    Object mObj = root.get("manual");
                    if (mObj instanceof Map<?,?> mMap) {
                        manual = new HashMap<>();
                        for (Map.Entry<?,?> entry : mMap.entrySet()) {
                            if (entry.getKey() instanceof String key) {
                                manual.put(key, entry.getValue());
                            }
                        }
                    }

                    KnowledgeResponse kr = new KnowledgeResponse(id, tema, fluxo, tipoRenda,
                            podeAceitar, acaoAnalista, respostaDevolucao, manual, link);

                    knowledgeMap.put(buildKey(tema, fluxo), kr);
                    allDocs.add(kr);

                } catch (IOException e) {
                    System.err.println("⚠ Erro ao ler JSON: " + file);
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
            System.err.println("❌ Erro ao carregar arquivos JSON");
            e.printStackTrace();
        }
    }

    private List<String> extractList(Map<String,Object> root, String... keys) {
        for (String key : keys) {
            Object obj = root.get(key);
            if (obj instanceof List<?> list) {
                return list.stream().filter(Objects::nonNull).map(Object::toString).collect(Collectors.toList());
            }
        }
        return Collections.emptyList();
    }

    public KnowledgeResponse getResponse(String tema, String fluxo) {
        if (tema == null) tema = "";
        if (fluxo == null) fluxo = "";
        return knowledgeMap.get(buildKey(tema, fluxo));
    }

    public KnowledgeResponse getBySlug(String slug) {
        return knowledgeMap.get(slug.toLowerCase());
    }

    public Map<String,Object> selectDocInSlug(String slug, String normQuestion) {
        try {
            if (jsonRoot == null) return null;
            Path base = jsonRoot.resolve(slug);
            if (!Files.exists(base) || !Files.isDirectory(base)) return null;

            List<Path> candidates = new ArrayList<>();
            try (var stream = Files.list(base)) {
                stream.filter(Files::isRegularFile)
                        .filter(p -> JSON_EXT.stream().anyMatch(ext -> p.getFileName().toString().toLowerCase().endsWith(ext)))
                        .forEach(candidates::add);
            }
            if (candidates.isEmpty()) return null;

            String norm = normalize(normQuestion);
            Path best = null;
            int bestScore = -1;

            for (Path p : candidates) {
                // Evitar priorizar index.json; ele só deve ser fallback
                boolean isIndex = p.getFileName().toString().equalsIgnoreCase("index.json");
                Map<?, ?> raw = mapper.readValue(Files.readAllBytes(p), new TypeReference<Map<?, ?>>() {});
                String id = Objects.toString(raw.get("id"), "");
                Object docObj = raw.get("documento");
                Object fluxoObj = raw.get("fluxo");
                String documento = Objects.toString(docObj != null ? docObj : fluxoObj, "");
                String concat = normalize(id + " " + documento);
                int score = scoreMatch(concat, norm);
                if (score > bestScore || (score == bestScore && best == null)) {
                    // Não escolher index como melhor se houver outro com mesma pontuação
                    if (score > 0 && isIndex) {
                        continue;
                    }
                    bestScore = score;
                    best = p;
                }
            }

            if (best == null) {
                // Fallback: primeiro arquivo não-index.json, senão o primeiro mesmo
                Optional<Path> nonIndex = candidates.stream()
                        .filter(p -> !p.getFileName().toString().equalsIgnoreCase("index.json"))
                        .findFirst();
                best = nonIndex.orElse(candidates.get(0));
            }

            System.out.println("✔ selectDocInSlug slug=" + slug + " best=" + best.getFileName());
            Map<?, ?> rawBest = mapper.readValue(Files.readAllBytes(best), new TypeReference<Map<?, ?>>() {});
            Map<String, Object> doc = new HashMap<>();
            rawBest.forEach((k, v) -> doc.put(Objects.toString(k), v));
            return doc;
        } catch (Exception e) {
            return null;
        }
    }

    private int scoreMatch(String candidate, String query) {
        if (query == null || query.isBlank()) return 0;
        if (candidate == null) return 0;
        String[] terms = query.split("\\s+");
        int score = 0;
        for (String t : terms) {
            if (!t.isBlank() && candidate.contains(t)) score++;
        }
        return score;
    }

    public Map<String,Object> getCatalogBySlug(String slug) {
        KnowledgeResponse kr = getBySlug(slug);
        if (kr == null) return null;
        Map<String,Object> map = new HashMap<>();
        map.put("id", kr.getId());
        map.put("tema", kr.getTema());
        map.put("fluxo", kr.getFluxo());
        map.put("tipoRenda", kr.getTipoRenda());
        map.put("podeAceitar", kr.getPodeAceitar());
        map.put("manual", kr.getManual());
        map.put("link", kr.getLink());
        return map;
    }

    public List<String> listDocuments() {
        return allDocs.stream()
                .map(kr -> (kr.getTema() == null ? "" : kr.getTema()) + " || " +
                           (kr.getFluxo() == null ? "" : kr.getFluxo()))
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> listCatalogSlugs() {
        return allDocs.stream()
                .map(KnowledgeResponse::getId)
                .filter(id -> id != null && !id.isEmpty())
                .sorted()
                .collect(Collectors.toList());
    }

    public KnowledgeResponse searchOne(String text) {
        if (text == null || text.isBlank()) return null;
        String norm = text.toLowerCase().trim();
        for (KnowledgeResponse k : allDocs) {
            if ((k.getTema() != null && k.getTema().toLowerCase().contains(norm)) ||
                (k.getFluxo() != null && k.getFluxo().toLowerCase().contains(norm))) {
                return k;
            }
        }
        return null;
    }

    private String buildKey(String tema, String fluxo) {
        return (tema.trim() + "||" + fluxo.trim()).toLowerCase();
    }

    private String getString(Map<String,Object> map, String key, String def) {
        Object obj = map.get(key);
        return obj != null ? obj.toString() : def;
    }
}
