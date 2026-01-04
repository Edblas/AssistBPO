package com.assistbpo.controller;

import com.assistbpo.dto.VolumetricsSyncDTO;
import com.assistbpo.service.VolumetricsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/volumetrics")
@CrossOrigin(origins = "*")
public class VolumetricsController {

    private final VolumetricsService service;

    private static final Set<String> MANAGER_ROLES = Set.of(
            "Gerente de Operações",
            "Coordenador(a)",
            "Líder"
    );

    public VolumetricsController(VolumetricsService service) {
        this.service = service;
    }

    private boolean isManager(String role) {
        return role != null && MANAGER_ROLES.contains(role);
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncMetrics(
            @RequestHeader(value = "X-User-Identifier") String userIdentifier,
            @RequestHeader(value = "X-User-Role") String role,
            @RequestBody List<VolumetricsSyncDTO> metrics) {
        
        if (userIdentifier == null || userIdentifier.isBlank()) {
            return ResponseEntity.badRequest().body("User Identifier is required");
        }

        service.syncMetrics(userIdentifier, role, metrics);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestHeader(value = "X-User-Role") String role) {
        if (!isManager(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        return ResponseEntity.ok(service.getAvailableUsers());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            @RequestHeader(value = "X-User-Identifier") String requesterId,
            @RequestHeader(value = "X-User-Role") String requesterRole,
            @RequestParam(required = false) String targetUserId) {
        
        if (requesterId == null || requesterId.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User Identifier required");
        }

        // Access Control
        String effectiveTargetId = targetUserId;
        
        if (!isManager(requesterRole)) {
            // Non-managers can ONLY view their own data
            if (targetUserId != null && !targetUserId.equals(requesterId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied to other users' data");
            }
            effectiveTargetId = requesterId;
        }
        
        // If manager and targetUserId is null, we return Team View (all users aggregated)
        // If manager and targetUserId is set, we return that user's view
        
        return ResponseEntity.ok(service.getDashboard(effectiveTargetId, null, null));
    }
}
