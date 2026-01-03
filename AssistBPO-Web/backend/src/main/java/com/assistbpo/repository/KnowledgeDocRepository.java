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
    @Query(value = "SELECT * FROM knowledge_docs WHERE searchable_text LIKE %:term%", nativeQuery = true)
    List<KnowledgeDoc> searchByText(String term);
}
