package com.assistbpo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @Autowired
    private DataSource dataSource;

    @Value("${spring.application.name:AssistBPO-Backend}")
    private String appName;

    @GetMapping
    public String welcome() {
        logger.info("Welcome endpoint accessed");
        return "Bem-vindo ao Backend do AssistBPO! O sistema está operante.";
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        logger.info("Health check requested");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Backend OK");
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        response.put("service", appName);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health/db")
    public ResponseEntity<Map<String, Object>> dbCheck() {
        logger.info("Database health check requested");
        
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        try (Connection connection = dataSource.getConnection()) {
            boolean isValid = connection.isValid(2); // Timeout de 2 segundos
            
            if (isValid) {
                response.put("status", "Database Connected");
                response.put("database", connection.getMetaData().getDatabaseProductName());
                response.put("version", connection.getMetaData().getDatabaseProductVersion());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "Database Unreachable");
                return ResponseEntity.status(503).body(response);
            }
        } catch (SQLException e) {
            logger.error("Database connection failed", e);
            response.put("status", "Connection Failed");
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        logger.info("Info endpoint accessed");
        
        Map<String, Object> response = new HashMap<>();
        response.put("app", appName);
        response.put("version", "1.0.0");
        response.put("description", "AssistBPO Backend API Service");
        response.put("java_version", System.getProperty("java.version"));
        response.put("os", System.getProperty("os.name"));
        
        return ResponseEntity.ok(response);
    }
}
