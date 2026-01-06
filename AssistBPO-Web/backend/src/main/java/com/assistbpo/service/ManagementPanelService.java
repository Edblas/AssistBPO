package com.assistbpo.service;

import com.assistbpo.dto.ChatStatsDTO;
import com.assistbpo.model.KnowledgeDoc;
import com.assistbpo.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ManagementPanelService {

    private final MetricAccessLogRepository accessLogRepository;
    private final MetricSearchLogRepository searchLogRepository;
    private final MetricChatLogRepository chatLogRepository;
    private final KnowledgeDocRepository knowledgeDocRepository;

    public ManagementPanelService(MetricAccessLogRepository accessLogRepository,
                                  MetricSearchLogRepository searchLogRepository,
                                  MetricChatLogRepository chatLogRepository,
                                  KnowledgeDocRepository knowledgeDocRepository) {
        this.accessLogRepository = accessLogRepository;
        this.searchLogRepository = searchLogRepository;
        this.chatLogRepository = chatLogRepository;
        this.knowledgeDocRepository = knowledgeDocRepository;
    }

    public List<Map<String, Object>> getMostAccessedFlows() {
        return accessLogRepository.findMostAccessedFlows().stream().map(row -> {
            KnowledgeDoc doc = (KnowledgeDoc) row[0];
            Long count = (Long) row[1];
            Map<String, Object> map = new HashMap<>();
            map.put("id", doc.getId());
            map.put("fluxo", doc.getFluxo());
            map.put("tema", doc.getThemeObj() != null ? doc.getThemeObj().getNome() : doc.getTema());
            map.put("acessos", count);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getNeverAccessedFlows() {
        return knowledgeDocRepository.findNeverAccessedDocs().stream().map(this::mapDocToSummary).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getOutdatedFlows(int days) {
        return knowledgeDocRepository.findOutdatedDocs(LocalDateTime.now().minusDays(days)).stream().map(this::mapDocToSummary).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getMostSearchedThemes() {
        return searchLogRepository.findMostSearchedThemes().stream().map(row -> {
            com.assistbpo.model.Theme theme = (com.assistbpo.model.Theme) row[0];
            Long count = (Long) row[1];
            Map<String, Object> map = new HashMap<>();
            map.put("tema", theme.getNome());
            map.put("buscas", count);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getFrequentChatQuestions() {
        return chatLogRepository.findMostFrequentQuestions().stream().map(row -> {
            String question = (String) row[0];
            Long count = (Long) row[1];
            Map<String, Object> map = new HashMap<>();
            map.put("pergunta", question);
            map.put("frequencia", count);
            return map;
        }).collect(Collectors.toList());
    }

    public ChatStatsDTO getChatStats() {
        LocalDateTime now = LocalDateTime.now();

        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);

        LocalDateTime startOfWeek = now.minusDays(6).with(LocalTime.MIN); // Last 7 days

        LocalDateTime startOfYear = now.withDayOfYear(1).with(LocalTime.MIN);

        Long daily = chatLogRepository.countByDateBetween(startOfDay, endOfDay);
        Long weekly = chatLogRepository.countByDateBetween(startOfWeek, endOfDay);
        Long annual = chatLogRepository.countByDateBetween(startOfYear, endOfDay);

        return new ChatStatsDTO(
                daily != null ? daily : 0,
                weekly != null ? weekly : 0,
                annual != null ? annual : 0
        );
    }

    private Map<String, Object> mapDocToSummary(KnowledgeDoc doc) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", doc.getId());
        map.put("fluxo", doc.getFluxo());
        map.put("tema", doc.getThemeObj() != null ? doc.getThemeObj().getNome() : doc.getTema());
        map.put("data_ultima_edicao", doc.getUpdatedAt());
        return map;
    }
}
