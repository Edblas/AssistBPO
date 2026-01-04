package com.assistbpo.repository;

import com.assistbpo.model.TrainingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingCategoryRepository extends JpaRepository<TrainingCategory, Long> {
    List<TrainingCategory> findByAtivoTrueOrderByOrdemAsc();
}
