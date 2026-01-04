package com.assistbpo.service;

import com.assistbpo.dto.VolumetricPeriodStats;
import com.assistbpo.dto.VolumetricsDashboardDTO;
import com.assistbpo.dto.VolumetricsSyncDTO;
import com.assistbpo.model.DailyProductionMetric;
import com.assistbpo.repository.DailyProductionMetricRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VolumetricsService {

    private final DailyProductionMetricRepository repository;

    public VolumetricsService(DailyProductionMetricRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void syncMetrics(String userIdentifier, String userRole, List<VolumetricsSyncDTO> metrics) {
        for (VolumetricsSyncDTO dto : metrics) {
            LocalDate date = LocalDate.parse(dto.getDate(), DateTimeFormatter.ISO_LOCAL_DATE);
            
            Optional<DailyProductionMetric> existing = repository.findByUserIdentifierAndDate(userIdentifier, date);
            
            if (existing.isPresent()) {
                DailyProductionMetric metric = existing.get();
                // Update only if count is greater (assuming accumulation) or just update to latest?
                // Frontend is source of truth for its history.
                metric.setCount(dto.getCount());
                metric.setUserRole(userRole); // Update role if changed
                metric.setLastSyncTimestamp(java.time.LocalDateTime.now());
                repository.save(metric);
            } else {
                DailyProductionMetric metric = new DailyProductionMetric(userIdentifier, userRole, date, dto.getCount());
                repository.save(metric);
            }
        }
    }

    public List<String> getAvailableUsers() {
        return repository.findDistinctUserIdentifiers();
    }

    public VolumetricsDashboardDTO getDashboard(String userIdentifier, String roleFilter, LocalDate referenceDate) {
        if (referenceDate == null) referenceDate = LocalDate.now();
        
        // If userIdentifier is null, we aggregate for ALL users (Team View)
        // If userIdentifier is provided, we filter by that user (Personal View or Filtered Team View)
        
        VolumetricsDashboardDTO dashboard = new VolumetricsDashboardDTO();
        
        dashboard.setDaily(calculateStats(userIdentifier, referenceDate, referenceDate)); // 1 day
        dashboard.setWeekly(calculateStats(userIdentifier, referenceDate.minusDays(6), referenceDate)); // 7 days
        dashboard.setBiweekly(calculateStats(userIdentifier, referenceDate.minusDays(14), referenceDate)); // 15 days
        dashboard.setMonthly(calculateStats(userIdentifier, referenceDate.minusDays(29), referenceDate)); // 30 days
        dashboard.setAnnual(calculateStats(userIdentifier, referenceDate.withDayOfYear(1), referenceDate)); // Current Year
        
        return dashboard;
    }

    private VolumetricPeriodStats calculateStats(String userIdentifier, LocalDate startDate, LocalDate endDate) {
        List<DailyProductionMetric> metrics;
        
        if (userIdentifier != null) {
            metrics = repository.findByUserIdentifierAndDateBetween(userIdentifier, startDate, endDate);
        } else {
            metrics = repository.findByDateBetween(startDate, endDate);
        }
        
        int totalFluxos = metrics.stream().mapToInt(DailyProductionMetric::getCount).sum();
        int diasComRegistro = metrics.size(); // Note: for team view, this might count multiple users per day.
        
        // For Team View "Average", we might want "Average per User" or "Average per Day for the Team".
        // "Média diária" usually means "Total / Days".
        // For Team View, it's "Total Production / Days".
        
        // If filtering by user, diasComRegistro is correct.
        // If team view, we want distinct days?
        long distinctDays = metrics.stream().map(DailyProductionMetric::getDate).distinct().count();
        if (distinctDays == 0) distinctDays = 1; // Avoid div by 0 if needed, but logic below handles it.
        
        // Actually, "Média diária" = Total / Number of days in the period? Or number of WORKING days?
        // Usually "Total / Count of days with production".
        
        double media = diasComRegistro > 0 ? (double) totalFluxos / (userIdentifier != null ? diasComRegistro : distinctDays) : 0.0;
        
        // Adjust logic for team view average:
        // If team view, "Média Diária" = Total Produced / Number of Days (active).
        
        if (userIdentifier == null && !metrics.isEmpty()) {
             // For team view, calculate average based on unique dates
             media = (double) totalFluxos / distinctDays;
             diasComRegistro = (int) distinctDays;
        }

        return new VolumetricPeriodStats(totalFluxos, media, diasComRegistro);
    }
}
