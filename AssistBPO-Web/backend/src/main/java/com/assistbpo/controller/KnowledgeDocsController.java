package com.assistbpo.controller;

import com.assistbpo.model.KnowledgeDoc;
import com.assistbpo.repository.KnowledgeDocRepository;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/docs")
public class KnowledgeDocsController {

    private final KnowledgeDocRepository repository;

    public KnowledgeDocsController(KnowledgeDocRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public Map<String, Object> list() {
        List<KnowledgeDoc> docs = repository.findAll();
        Map<String, Object> m = new HashMap<>();
        m.put("count", docs.size());
        m.put("docs", docs);
        return m;
    }

    @GetMapping("/tree")
    public Map<String, List<KnowledgeDoc>> getTree(@RequestParam(required = false, defaultValue = "false") boolean includeInactive) {
        List<KnowledgeDoc> all = repository.findAll();
        Map<String, List<KnowledgeDoc>> tree = new TreeMap<>(); // TreeMap para ordenar chaves (Temas)
        
        for (KnowledgeDoc doc : all) {
            // Filtrar inativos se não solicitado
            if (!includeInactive && Boolean.FALSE.equals(doc.getActive())) {
                continue;
            }

            String t = doc.getTema() != null ? doc.getTema().trim() : "Sem Tema";
            tree.computeIfAbsent(t, k -> new ArrayList<>()).add(doc);
        }
        
        // Ordenar fluxos dentro de cada tema (Order Index -> Nome)
        for (List<KnowledgeDoc> list : tree.values()) {
            list.sort(Comparator.comparingInt((KnowledgeDoc d) -> d.getOrderIndex() != null ? d.getOrderIndex() : 0)
                    .thenComparing(d -> d.getFluxo() != null ? d.getFluxo() : ""));
        }
        
        return tree;
    }
    
    @PostMapping("/reorder")
    public void reorder(@RequestBody Map<Long, Integer> newOrders) throws IOException {
        List<KnowledgeDoc> docs = repository.findAllById(newOrders.keySet());
        for (KnowledgeDoc doc : docs) {
            if (newOrders.containsKey(doc.getId())) {
                doc.setOrderIndex(newOrders.get(doc.getId()));
            }
        }
        repository.saveAll(docs);
    }

    @PostMapping
    public KnowledgeDoc create(@RequestBody KnowledgeDoc doc) throws IOException {
        if (doc.getSlug() == null || doc.getSlug().isBlank()) {
            // Gerar slug simples se não vier
            String base = (doc.getTema() + "-" + doc.getFluxo()).toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("^-|-$", "");
            doc.setSlug(base + "-" + System.currentTimeMillis());
        }
        
        doc.setCreatedAt(LocalDateTime.now());
        doc.setUpdatedAt(LocalDateTime.now());
        doc.updateSearchableText();
        
        KnowledgeDoc saved = repository.save(doc);
        return saved;
    }

    @PutMapping("/{id}")
    public KnowledgeDoc update(@PathVariable Long id, @RequestBody KnowledgeDoc updates) throws IOException {
        KnowledgeDoc doc = repository.findById(id).orElseThrow(() -> new RuntimeException("Doc not found"));
        
        doc.setTema(updates.getTema());
        doc.setFluxo(updates.getFluxo());
        doc.setTipoRenda(updates.getTipoRenda());
        doc.setPodeAceitar(updates.getPodeAceitar());
        doc.setAcaoAnalista(updates.getAcaoAnalista());
        doc.setModelosAceitosNaoAceitos(updates.getModelosAceitosNaoAceitos());
        doc.setCondicao(updates.getCondicao());
        doc.setVideoExplicativo(updates.getVideoExplicativo());
        doc.setRespostasDevolucao(updates.getRespostasDevolucao());
        doc.setManualLinkFluxo(updates.getManualLinkFluxo());
        doc.setManualLinkResposta(updates.getManualLinkResposta());
        doc.setKeywords(updates.getKeywords());
        
        // Active Status
        if (updates.getActive() != null) {
            doc.setActive(updates.getActive());
        }
        
        doc.setUpdatedAt(LocalDateTime.now());
        doc.updateSearchableText();
        
        KnowledgeDoc saved = repository.save(doc);
        return saved;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) throws IOException {
        KnowledgeDoc doc = repository.findById(id).orElseThrow(() -> new RuntimeException("Doc not found"));
        repository.delete(doc);
    }

    @GetMapping("/{slug}")
    public KnowledgeDoc bySlug(@PathVariable String slug) {
        return repository.findBySlug(slug).orElse(null);
    }

    @GetMapping("/{slug}/debug")
    public Map<String, Object> debug(@PathVariable String slug) {
        KnowledgeDoc r = repository.findBySlug(slug).orElse(null);
        Map<String, Object> m = new HashMap<>();
        m.put("found", r != null);
        m.put("tema", r == null ? null : r.getTema());
        m.put("fluxo", r == null ? null : r.getFluxo());
        m.put("acoes", r == null ? 0 : r.getAcaoAnalista().size());
        return m;
    }
}
