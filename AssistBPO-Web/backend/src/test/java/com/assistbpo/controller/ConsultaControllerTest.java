package com.assistbpo.controller;

import com.assistbpo.model.KnowledgeDoc;
import com.assistbpo.repository.KnowledgeDocRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(controllers = ConsultaController.class)
class ConsultaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private KnowledgeDocRepository repository;

    @Test
    void consultaRetornaRespostaQuandoEncontraPorTituloOuKeyword() throws Exception {
        KnowledgeDoc doc = new KnowledgeDoc();
        doc.setTema("Renda PJ");
        doc.setFluxo("Declaração de Faturamento");
        doc.setPodeAceitar(true);
        doc.setAcaoAnalista(List.of("Validar documentos", "Registrar no sistema"));
        doc.setRespostasDevolucao(List.of("Solicitar comprovantes"));
        doc.setManualLinkFluxo("http://manual");

        when(repository.searchByTitleOrKeyword("faturamento")).thenReturn(List.of(doc));

        String body = "{\"pergunta\":\"faturamento\"}";

        mockMvc.perform(post("/api/consulta")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Fluxo: Declaração de Faturamento")));
    }
}
