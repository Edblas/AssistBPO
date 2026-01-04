package com.assistbpo.controller;

import com.assistbpo.dto.TrainingRequest;
import com.assistbpo.model.Training;
import com.assistbpo.model.TrainingAuditLog;
import com.assistbpo.model.TrainingCategory;
import com.assistbpo.repository.TrainingAuditLogRepository;
import com.assistbpo.repository.TrainingCategoryRepository;
import com.assistbpo.repository.TrainingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.Optional;

@RestController
@RequestMapping("/api/training")
@CrossOrigin(origins = "*")
public class TrainingController {

    private final TrainingCategoryRepository categoryRepository;
    private final TrainingRepository trainingRepository;
    private final TrainingAuditLogRepository auditLogRepository;

    private static final Set<String> ADMIN_ROLES = Set.of(
            "Gerente de Operações",
            "Coordenador(a)",
            "Líder",
            "Líder(a)"
    );

    public TrainingController(TrainingCategoryRepository categoryRepository, TrainingRepository trainingRepository, TrainingAuditLogRepository auditLogRepository) {
        this.categoryRepository = categoryRepository;
        this.trainingRepository = trainingRepository;
        this.auditLogRepository = auditLogRepository;
    }

    private boolean isAdmin(String role) {
        return role != null && ADMIN_ROLES.contains(role);
    }

    private void logAction(String entityType, Long entityId, String action, String username, String details) {
        auditLogRepository.save(new TrainingAuditLog(entityType, entityId, action, username, details));
    }

    // --- LEITURA (PÚBLICO PARA TODOS OS PERFIS) ---

    @GetMapping("/categories")
    public List<TrainingCategory> getCategories() {
        return categoryRepository.findByAtivoTrueOrderByOrdemAsc();
    }

    @GetMapping("/categories/all") // Para Admin (inclui inativos)
    public ResponseEntity<?> getAllCategories(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping
    public List<Training> getTrainings(@RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return trainingRepository.findByCategoryIdAndAtivoTrueOrderByOrdemAsc(categoryId);
        }
        return trainingRepository.findByAtivoTrueOrderByOrdemAsc();
    }

    @GetMapping("/all") // Para Admin (inclui inativos)
    public ResponseEntity<?> getAllTrainings(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(trainingRepository.findAll());
    }

    @GetMapping("/audit")
    public ResponseEntity<?> getAuditLogs(@RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }

    // --- ESCRITA (RESTRITO) ---

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestHeader(value = "X-User-Role", required = false) String role, @RequestBody TrainingCategory category) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        TrainingCategory saved = categoryRepository.save(category);
        logAction("CATEGORY", saved.getId(), "CREATE", role, "Created category: " + saved.getNome());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@RequestHeader(value = "X-User-Role", required = false) String role, @PathVariable Long id, @RequestBody TrainingCategory categoryDetails) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        
        return categoryRepository.findById(id).map(category -> {
            category.setNome(categoryDetails.getNome());
            category.setAtivo(categoryDetails.getAtivo());
            category.setOrdem(categoryDetails.getOrdem());
            TrainingCategory updated = categoryRepository.save(category);
            logAction("CATEGORY", updated.getId(), "UPDATE", role, "Updated category: " + updated.getNome());
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@RequestHeader(value = "X-User-Role", required = false) String role, @PathVariable Long id) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");
        
        return categoryRepository.findById(id).map(category -> {
            categoryRepository.delete(category);
            logAction("CATEGORY", id, "DELETE", role, "Deleted category: " + category.getNome());
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTraining(@RequestHeader(value = "X-User-Role", required = false) String role, @RequestBody TrainingRequest request) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");

        Training training = new Training();
        training.setTitulo(request.getTitulo());
        training.setDescricaoCurta(request.getDescricaoCurta());
        training.setUdemyUrl(request.getUdemyUrl());
        training.setAtivo(request.getAtivo());
        training.setOrdem(request.getOrdem());

        if (request.getCategoryId() != null) {
            Optional<TrainingCategory> category = categoryRepository.findById(request.getCategoryId());
            if (category.isPresent()) {
                training.setCategory(category.get());
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Categoria não encontrada com ID: " + request.getCategoryId());
            }
        }

        Training saved = trainingRepository.save(training);
        logAction("TRAINING", saved.getId(), "CREATE", role, "Created training: " + saved.getTitulo());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTraining(@RequestHeader(value = "X-User-Role", required = false) String role, @PathVariable Long id, @RequestBody TrainingRequest request) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");

        return trainingRepository.findById(id).map(training -> {
            training.setTitulo(request.getTitulo());
            training.setDescricaoCurta(request.getDescricaoCurta());
            training.setUdemyUrl(request.getUdemyUrl());
            training.setAtivo(request.getAtivo());
            training.setOrdem(request.getOrdem());

            if (request.getCategoryId() != null) {
                Optional<TrainingCategory> category = categoryRepository.findById(request.getCategoryId());
                if (category.isPresent()) {
                    training.setCategory(category.get());
                }
            }

            Training updated = trainingRepository.save(training);
            logAction("TRAINING", updated.getId(), "UPDATE", role, "Updated training: " + updated.getTitulo());
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTraining(@RequestHeader(value = "X-User-Role", required = false) String role, @PathVariable Long id) {
        if (!isAdmin(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso negado");

        return trainingRepository.findById(id).map(training -> {
            trainingRepository.delete(training);
            logAction("TRAINING", id, "DELETE", role, "Deleted training: " + training.getTitulo());
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
