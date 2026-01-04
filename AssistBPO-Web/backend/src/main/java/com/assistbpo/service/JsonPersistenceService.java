package com.assistbpo.service;

import com.assistbpo.model.KnowledgeDoc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class JsonPersistenceService {

    private final ObjectMapper mapper;
    private static final String DEFAULT_DATA_DIR = "data/renda_pj/user_created";

    public JsonPersistenceService() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.enable(SerializationFeature.INDENT_OUTPUT);
    }

    public void save(KnowledgeDoc doc) throws IOException {
        if (doc.getSourceFile() == null || doc.getSourceFile().isEmpty()) {
            // Define new file path
            Path dir = Paths.get(DEFAULT_DATA_DIR);
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }
            String filename = doc.getSlug() + ".json";
            doc.setSourceFile(dir.resolve(filename).toString());
        }

        Map<String, Object> jsonMap = toMap(doc);
        File file = new File(doc.getSourceFile());
        mapper.writeValue(file, jsonMap);
    }

    public void delete(KnowledgeDoc doc) throws IOException {
        if (doc.getSourceFile() != null) {
            Files.deleteIfExists(Paths.get(doc.getSourceFile()));
        }
    }

    private Map<String, Object> toMap(KnowledgeDoc doc) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", doc.getSlug());
        map.put("tema", doc.getTema());
        map.put("fluxo", doc.getFluxo()); // fluxo is "documento" in some contexts, but sticking to flux name
        map.put("documento", doc.getFluxo()); // keeping compatibility
        map.put("tipoRenda", doc.getTipoRenda());
        map.put("podeAceitar", doc.getPodeAceitar());
        map.put("active", doc.getActive());
        map.put("order_index", doc.getOrderIndex());
        
        // Lists
        map.put("keywords", doc.getKeywords());
        map.put("acao_analista", doc.getAcaoAnalista());
        map.put("modelos_aceitos", doc.getModelosAceitosNaoAceitos());
        map.put("condicao", doc.getCondicao());
        map.put("video_explicativo", doc.getVideoExplicativo());
        // map.put("modelos_nao_aceitos", doc.getModelosNaoAceitos()); // Removed
        
        map.put("resposta_devolucao", doc.getRespostasDevolucao()); // Agora é lista
        
        // Manual links
        Map<String, String> manual = new LinkedHashMap<>();
        manual.put("link_fluxo", doc.getManualLinkFluxo());
        manual.put("link_resposta", doc.getManualLinkResposta()); // Assuming getter exists or will be added
        map.put("manual", manual);

        // Audit
        if (doc.getCreatedAt() != null) map.put("created_at", doc.getCreatedAt().toString());
        if (doc.getUpdatedAt() != null) map.put("updated_at", doc.getUpdatedAt().toString());

        return map;
    }
}
