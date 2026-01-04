package com.assistbpo.repository;

import com.assistbpo.model.MetricAccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricAccessLogRepository extends JpaRepository<MetricAccessLog, Long> {

    @Query("SELECT l.flux, COUNT(l) FROM MetricAccessLog l GROUP BY l.flux ORDER BY COUNT(l) DESC")
    List<Object[]> findMostAccessedFlows();
}
