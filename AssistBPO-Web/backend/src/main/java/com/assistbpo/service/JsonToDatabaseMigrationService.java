package com.assistbpo.service;

import com.assistbpo.model.KnowledgeDoc;
import com.assistbpo.repository.KnowledgeDocRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JsonToDatabaseMigrationService {

    private final KnowledgeDocRepository repository;
    private final com.assistbpo.repository.ThemeRepository themeRepository;
    private final ObjectMapper mapper = new ObjectMapper();
    private Path jsonRoot;

    public JsonToDatabaseMigrationService(KnowledgeDocRepository repository, com.assistbpo.repository.ThemeRepository themeRepository) {
        this.repository = repository;
        this.themeRepository = themeRepository;
    }

    @PostConstruct
    @Transactional
    public void migrate() {
        // MODO DESENVOLVIMENTO: Limpar banco para recarregar JSONs atualizados
        System.out.println("♻ Limpando banco de dados para recarga completa...");
        repository.deleteAll();
        themeRepository.deleteAll();

        System.out.println("🚀 Iniciando migração de JSON para Banco de Dados...");
        jsonRoot = resolveJsonDir();
        if (jsonRoot != null) {
            loadJsonFiles(jsonRoot);
            System.out.println("✔ Migração concluída com sucesso!");
        } else {
            System.err.println("❌ Pasta de dados não encontrada para migração.");
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

    private void loadJsonFiles(Path dir) {
        try {
            List<Path> files = Files.walk(dir)
                    .filter(Files::isRegularFile)
                    .filter(f -> f.toString().toLowerCase().endsWith(".json"))
                    .filter(f -> !f.getFileName().toString().startsWith("_")) // Ignora _catalogo.json
                    .collect(Collectors.toList());

            for (Path file : files) {
                try {
                    String raw = Files.readString(file, StandardCharsets.UTF_8);
                    Map<String, Object> root = mapper.readValue(raw, new TypeReference<Map<String,Object>>() {});

                    String id = getString(root, "id", file.getFileName().toString().replace(".json", ""));
                    String tema = getString(root, "tema", "Renda PJ");
                    String fluxo = getString(root, "fluxo", getString(root, "documento", ""));
                    String tipoRenda = getString(root, "tipoRenda", "");
                    Boolean podeAceitar = Boolean.valueOf(String.valueOf(root.getOrDefault("podeAceitar", "false")));
                    List<String> keywords = extractList(root, "keywords", "keywords");
                    List<String> acaoAnalista = extractList(root, "acaoAnalista", "acao_analista");
                    
                    // Migração de Resposta de Devolução (String -> List)
                    List<String> respostasDevolucao = new ArrayList<>();
                    Object rawResp = mapHasKey(root, "respostaDevolucao", "resposta_devolucao");
                    if (rawResp instanceof List<?>) {
                         respostasDevolucao = ((List<?>) rawResp).stream().map(Object::toString).collect(Collectors.toList());
                    } else if (rawResp != null && !rawResp.toString().isBlank()) {
                         respostasDevolucao.add(rawResp.toString());
                    }

                    Boolean active = Boolean.valueOf(String.valueOf(root.getOrDefault("active", "true")));
                    Integer orderIndex = Integer.valueOf(String.valueOf(root.getOrDefault("order_index", "0")));

                    // Extração de Modelos
                    List<String> modelosAceitos = extractList(root, "modelosAceitos", "modelos_aceitos");
                    List<String> modelosNaoAceitos = extractList(root, "modelosNaoAceitos", "modelos_nao_aceitos");
                    
                    // Merge old lists into new field
                    List<String> combinedModels = new ArrayList<>(modelosAceitos);
                    if (!modelosNaoAceitos.isEmpty()) {
                        combinedModels.add("--- Modelos Não Aceitos (Legado) ---");
                        combinedModels.addAll(modelosNaoAceitos);
                    }
                    
                    String condicao = getString(root, "condicao", "");
                    String videoExplicativo = getString(root, "videoExplicativo", getString(root, "video_explicativo", ""));

                    // Extração de Manual
                    String linkFluxo = "";
                    String linkResposta = "";
                    Object mObj = root.get("manual");
                    if (mObj instanceof Map<?,?> mMap) {
                        Object lf = mMap.get("link_fluxo");
                        linkFluxo = lf != null ? lf.toString() : "";
                        
                        Object lr = mMap.get("link_resposta");
                        linkResposta = lr != null ? lr.toString() : "";
                    }

                    KnowledgeDoc doc = new KnowledgeDoc(
                        id, tema, fluxo, tipoRenda, podeAceitar, acaoAnalista, 
                        respostasDevolucao, linkFluxo, linkResposta
                    );
                    doc.setModelosAceitosNaoAceitos(combinedModels);
                    doc.setCondicao(condicao);
                    doc.setVideoExplicativo(videoExplicativo);
                    doc.setKeywords(keywords);
                    // doc.setModelosNaoAceitos(modelosNaoAceitos); // Removed
                    
                    doc.setActive(active);
                    doc.setOrderIndex(orderIndex);

                    // Metadados de Arquivo e Auditoria
                    doc.setSourceFile(file.toString());
                    
                    BasicFileAttributes attrs = Files.readAttributes(file, BasicFileAttributes.class);
                    LocalDateTime fileCreated = LocalDateTime.ofInstant(attrs.creationTime().toInstant(), ZoneId.systemDefault());
                    LocalDateTime fileModified = LocalDateTime.ofInstant(attrs.lastModifiedTime().toInstant(), ZoneId.systemDefault());
                    
                    String jsonCreated = getString(root, "created_at", null);
                    String jsonUpdated = getString(root, "updated_at", null);
                    
                    doc.setCreatedAt(jsonCreated != null ? LocalDateTime.parse(jsonCreated) : fileCreated);
                    doc.setUpdatedAt(jsonUpdated != null ? LocalDateTime.parse(jsonUpdated) : fileModified);

                    if (tema != null && !tema.isBlank()) {
                        String themeName = tema.trim();
                        com.assistbpo.model.Theme themeEntity = themeRepository.findByNome(themeName)
                                .orElseGet(() -> themeRepository.save(new com.assistbpo.model.Theme(themeName)));
                        doc.setThemeObj(themeEntity);
                    }

                    repository.save(doc);

                } catch (IOException e) {
                    System.err.println("⚠ Erro ao ler JSON: " + file);
                    e.printStackTrace();
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String getString(Map<String, Object> map, String key, String defaultValue) {
        return Optional.ofNullable(map.get(key))
                .map(Object::toString)
                .orElse(defaultValue);
    }

    private Object mapHasKey(Map<String, Object> map, String key1, String key2) {
        if (map.containsKey(key1)) return map.get(key1);
        if (map.containsKey(key2)) return map.get(key2);
        return null;
    }

    private List<String> extractList(Map<String, Object> map, String key1, String key2) {
        Object v = map.getOrDefault(key1, map.get(key2));
        if (v instanceof List<?>) {
            return ((List<?>) v).stream().map(Object::toString).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
