package com.assistbpo.repository;

import com.assistbpo.model.DailyProductionMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyProductionMetricRepository extends JpaRepository<DailyProductionMetric, Long> {

    Optional<DailyProductionMetric> findByUserIdentifierAndDate(String userIdentifier, LocalDate date);

    List<DailyProductionMetric> findByUserIdentifierOrderByDateDesc(String userIdentifier);

    List<DailyProductionMetric> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<DailyProductionMetric> findByUserIdentifierAndDateBetween(String userIdentifier, LocalDate startDate, LocalDate endDate);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT d.userIdentifier FROM DailyProductionMetric d ORDER BY d.userIdentifier")
    List<String> findDistinctUserIdentifiers();
}
