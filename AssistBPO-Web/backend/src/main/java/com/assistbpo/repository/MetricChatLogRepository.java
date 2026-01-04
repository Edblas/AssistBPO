package com.assistbpo.repository;

import com.assistbpo.model.MetricChatLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricChatLogRepository extends JpaRepository<MetricChatLog, Long> {

    @Query("SELECT l.question, COUNT(l) FROM MetricChatLog l GROUP BY l.question ORDER BY COUNT(l) DESC")
    List<Object[]> findMostFrequentQuestions();
}
