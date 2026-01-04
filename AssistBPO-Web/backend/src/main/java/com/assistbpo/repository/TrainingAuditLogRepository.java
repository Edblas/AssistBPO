package com.assistbpo.repository;

import com.assistbpo.model.TrainingAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingAuditLogRepository extends JpaRepository<TrainingAuditLog, Long> {
    List<TrainingAuditLog> findAllByOrderByTimestampDesc();
}
