package com.assistbpo.repository;

import com.assistbpo.model.MetricSearchLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricSearchLogRepository extends JpaRepository<MetricSearchLog, Long> {

    @Query("SELECT l.theme, COUNT(l) FROM MetricSearchLog l WHERE l.theme IS NOT NULL GROUP BY l.theme ORDER BY COUNT(l) DESC")
    List<Object[]> findMostSearchedThemes();
}
