package com.assistbpo.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

@WebMvcTest(controllers = CnpjController.class)
class CnpjControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void retornaBadRequestQuandoCnpjInvalido() throws Exception {
        mockMvc.perform(get("/api/cnpj/123"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("CNPJ deve conter 14 dígitos")));
    }
}
