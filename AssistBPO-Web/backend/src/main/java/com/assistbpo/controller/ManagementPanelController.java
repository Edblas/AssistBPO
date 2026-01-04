package com.assistbpo.controller;

import com.assistbpo.service.ManagementPanelService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/management/metrics")
@CrossOrigin(origins = "*")
public class ManagementPanelController {

    private final ManagementPanelService service;

    private static final Set<String> ALLOWED_ROLES = Set.of(
            "Gerente de Operações",
            "Coordenador(a)",
            "Líder"
    );

    public ManagementPanelController(ManagementPanelService service) {
        this.service = service;
    }

    private boolean isAuthorized(String role) {
        return role != null && ALLOWED_ROLES.contains(role);
    }

    @GetMapping("/accessed")
    public ResponseEntity<?> getMostAccessedFlows(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAuthorized(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(service.getMostAccessedFlows());
    }

    @GetMapping("/never-accessed")
    public ResponseEntity<?> getNeverAccessedFlows(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAuthorized(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(service.getNeverAccessedFlows());
    }

    @GetMapping("/outdated")
    public ResponseEntity<?> getOutdatedFlows(@RequestHeader(value = "X-User-Role", required = false) String role,
                                              @RequestParam(defaultValue = "90") int days) {
        if (!isAuthorized(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(service.getOutdatedFlows(days));
    }

    @GetMapping("/searched-themes")
    public ResponseEntity<?> getMostSearchedThemes(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAuthorized(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(service.getMostSearchedThemes());
    }

    @GetMapping("/chat-questions")
    public ResponseEntity<?> getFrequentChatQuestions(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAuthorized(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(service.getFrequentChatQuestions());
    }
}
