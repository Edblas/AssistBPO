package com.assistbpo.controller;

import com.assistbpo.model.KnowledgeResponse;
import com.assistbpo.service.JsonKnowledgeBaseService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/api/docs")
public class KnowledgeDocsController {

    private final JsonKnowledgeBaseService kb;

    public KnowledgeDocsController(JsonKnowledgeBaseService kb) {
        this.kb = kb;
    }

    @GetMapping
    public Map<String, Object> list() {
        Map<String, Object> m = new HashMap<>();
        m.put("count", kb.listDocuments().size());
        m.put("docs", kb.listDocuments());
        return m;
    }

    @GetMapping("/{slug}")
    public KnowledgeResponse bySlug(@PathVariable String slug) {
        return kb.getBySlug(slug);
    }

    @GetMapping("/{slug}/debug")
    public Map<String, Object> debug(@PathVariable String slug) {
        KnowledgeResponse r = kb.getBySlug(slug);
        Map<String, Object> m = new HashMap<>();
        m.put("found", r != null);
        m.put("tema", r == null ? null : r.getTema());
        m.put("fluxo", r == null ? null : r.getFluxo());
        m.put("acoes", r == null ? 0 : r.getAcaoAnalista().size());
        return m;
    }
}
