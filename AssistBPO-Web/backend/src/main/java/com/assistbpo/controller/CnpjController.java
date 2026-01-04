package com.assistbpo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.ssl.TrustAllStrategy;
import org.apache.hc.core5.ssl.SSLContexts;

import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

@RestController
@RequestMapping("/api/cnpj")
@CrossOrigin(origins = "*")
public class CnpjController {

    @GetMapping("/{cnpj}")
    public ResponseEntity<?> consultarCnpj(@PathVariable String cnpj) {
        // Limpar CNPJ mantendo apenas números
        String cleanCnpj = cnpj.replaceAll("\\D", "");
        
        if (cleanCnpj.length() != 14) {
            return ResponseEntity.badRequest().body("CNPJ deve conter 14 dígitos.");
        }

        try {
            // Configurar RestTemplate para ignorar erros de SSL (Cert Authority Invalid)
            RestTemplate restTemplate = createSslTrustingRestTemplate();
            
            String url = "https://brasilapi.com.br/api/cnpj/v1/" + cleanCnpj;
            ResponseEntity<Object> response = restTemplate.getForEntity(url, Object.class);
            
            return ResponseEntity.ok(response.getBody());

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao consultar BrasilAPI: " + e.getMessage());
        }
    }

    private RestTemplate createSslTrustingRestTemplate() throws Exception {
        // Configurar SSL Context que confia em tudo
        SSLContext sslContext = SSLContexts.custom()
                .loadTrustMaterial(null, TrustAllStrategy.INSTANCE)
                .build();

        // Configurar Socket Factory com NoopHostnameVerifier
        SSLConnectionSocketFactory csf = SSLConnectionSocketFactoryBuilder.create()
                .setSslContext(sslContext)
                .setHostnameVerifier(NoopHostnameVerifier.INSTANCE)
                .build();

        // Configurar Connection Manager
        PoolingHttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(csf)
                .build();

        // Criar HttpClient
        CloseableHttpClient httpClient = HttpClients.custom()
                .setConnectionManager(connectionManager)
                .build();

        // Configurar Factory do Spring
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(httpClient);

        return new RestTemplate(requestFactory);
    }
}
