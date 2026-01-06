package com.assistbpo.controller;

import com.assistbpo.model.KnowledgeDoc;
import com.assistbpo.repository.KnowledgeDocRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(controllers = KnowledgeDocsController.class)
class KnowledgeDocsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private KnowledgeDocRepository repository;

    @Test
    void listRetornaContagem() throws Exception {
        KnowledgeDoc a = new KnowledgeDoc();
        KnowledgeDoc b = new KnowledgeDoc();
        when(repository.findAll()).thenReturn(List.of(a, b));

        mockMvc.perform(get("/api/docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(2));
    }
}
