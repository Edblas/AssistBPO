package com.assistbpo.repository;

import com.assistbpo.model.KnowledgeDoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KnowledgeDocRepository extends JpaRepository<KnowledgeDoc, Long> {

    Optional<KnowledgeDoc> findBySlug(String slug);

    // Busca simplificada por texto (no Postgres real, ideal usar Full Text Search)
    // Aqui usamos ILIKE para buscar em qualquer parte do searchableText
    @Query(value = "SELECT DISTINCT k.* FROM knowledge_docs k " +
                   "LEFT JOIN doc_keywords dk ON k.id = dk.doc_id " +
                   "WHERE k.searchable_text LIKE %:term% " +
                   "OR dk.keyword LIKE %:term%", nativeQuery = true)
    List<KnowledgeDoc> searchByText(String term);

    @Query(value = "SELECT DISTINCT k.* FROM knowledge_docs k " +
                   "LEFT JOIN doc_keywords dk ON k.id = dk.doc_id " +
                   "WHERE LOWER(k.fluxo) LIKE %:term% " +
                   "OR LOWER(dk.keyword) LIKE %:term%", nativeQuery = true)
    List<KnowledgeDoc> searchByTitleOrKeyword(String term);

    @Query("SELECT k FROM KnowledgeDoc k WHERE k.id NOT IN (SELECT m.flux.id FROM MetricAccessLog m)")
    List<KnowledgeDoc> findNeverAccessedDocs();

    @Query("SELECT k FROM KnowledgeDoc k WHERE k.updatedAt < :cutoffDate")
    List<KnowledgeDoc> findOutdatedDocs(java.time.LocalDateTime cutoffDate);
}
