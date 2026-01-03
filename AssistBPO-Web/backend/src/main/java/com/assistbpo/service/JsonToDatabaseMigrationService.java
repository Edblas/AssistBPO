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
    private final ObjectMapper mapper = new ObjectMapper();
    private Path jsonRoot;

    public JsonToDatabaseMigrationService(KnowledgeDocRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    @Transactional
    public void migrate() {
        // MODO DESENVOLVIMENTO: Limpar banco para recarregar JSONs atualizados
        System.out.println("♻ Limpando banco de dados para recarga completa...");
        repository.deleteAll();

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
                    List<String> acaoAnalista = extractList(root, "acaoAnalista", "acao_analista");
                    String respostaDevolucao = getString(root, "respostaDevolucao", getString(root, "resposta_devolucao", ""));
                    
                    Boolean active = Boolean.valueOf(String.valueOf(root.getOrDefault("active", "true")));
                    Integer orderIndex = Integer.valueOf(String.valueOf(root.getOrDefault("order_index", "0")));

                    // Extração de Modelos
                    List<String> modelosAceitos = extractList(root, "modelosAceitos", "modelos_aceitos");
                    List<String> modelosNaoAceitos = extractList(root, "modelosNaoAceitos", "modelos_nao_aceitos");

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
                        respostaDevolucao, linkFluxo, linkResposta
                    );
                    doc.setModelosAceitos(modelosAceitos);
                    doc.setModelosNaoAceitos(modelosNaoAceitos);
                    
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

    private List<String> extractList(Map<String, Object> map, String key1, String key2) {
        Object v = map.getOrDefault(key1, map.get(key2));
        if (v instanceof List<?>) {
            return ((List<?>) v).stream().map(Object::toString).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
