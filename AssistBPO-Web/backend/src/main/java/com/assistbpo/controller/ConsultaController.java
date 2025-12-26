package com.assistbpo.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.web.bind.annotation.*;

import java.nio.file.*;
import java.text.Normalizer;
import java.util.*;

@RestController
@CrossOrigin
public class ConsultaController {

    private final ObjectMapper mapper = new ObjectMapper();
    private final Map<String, String> rendaPjMap = new HashMap<>();

    private Path dataRoot;

    /* ======================== INIT ======================= */

    @PostConstruct
    public void init() {
        System.out.println("========================================");
        System.out.println("🔍 DEBUG INICIADO - Procurando pasta data");
        System.out.println("========================================");
        
        // DEBUG: Mostre diretório atual
        Path currentDir = Paths.get(".").toAbsolutePath();
        System.out.println("📂 Diretório atual: " + currentDir);
        
        // DEBUG: Liste conteúdo
        System.out.println("📋 Conteúdo do diretório atual:");
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(currentDir)) {
            for (Path file : stream) {
                System.out.println("   - " + file.getFileName() + 
                                 (Files.isDirectory(file) ? " (DIR)" : " (FILE)"));
            }
        } catch (Exception e) {
            System.err.println("   ❌ Erro ao listar: " + e.getMessage());
        }
        
        System.out.println("🔍 Iniciando busca pela pasta data...");
        dataRoot = resolveDataDir();
        
        if (dataRoot == null) {
            System.err.println("❌ CRÍTICO: Pasta data não encontrada!");
            System.err.println("   O backend não terá acesso aos dados.");
        } else {
            System.out.println("✅ DATA ROOT encontrado: " + dataRoot.toAbsolutePath());
        }
        
        loadIndexMappings(dataRoot);
        System.out.println("📊 INDEX MAP carregado com " + rendaPjMap.size() + " entradas");
    }

    /* ======================== API ======================== */

    @PostMapping("/api/consulta")
    public Map<String, Object> consultar(
            @RequestBody(required = false) Map<String, Object> body) {

        String pergunta = body == null
                ? ""
                : Objects.toString(body.get("pergunta"), "");

        String norm = normalize(pergunta);

        Map<String, Object> resp = new HashMap<>();

        if (norm.isBlank()) {
            resp.put("resposta", respostaVazia());
            return resp;
        }

        String slug = matchSlug(norm);
        System.out.println("🤖 Consulta: pergunta='" + norm + "' → slug=" + slug);

        if (slug == null) {
            resp.put("resposta", respostaVazia());
            return resp;
        }

        Map<String, Object> doc = loadDocBySlug(slug);
        if (doc == null) {
            System.err.println("⚠️  Documento não encontrado para slug: " + slug);
            resp.put("resposta", respostaVazia());
            return resp;
        }

        resp.put("resposta", montarResposta(doc));
        return resp;
    }

    /* ======================== INDEX ======================== */

    private void loadIndexMappings(Path root) {
        rendaPjMap.clear();

        try {
            if (root == null) {
                System.err.println("❌ Não é possível carregar index: root é null");
                return;
            }

            System.out.println("📂 Procurando index.json em: " + root.toAbsolutePath());
            Path idx = root.resolve("index.json");
            
            if (!Files.exists(idx)) {
                System.err.println("❌ Arquivo index.json não encontrado em: " + idx.toAbsolutePath());
                System.err.println("   Conteúdo do diretório:");
                try (DirectoryStream<Path> stream = Files.newDirectoryStream(root)) {
                    for (Path file : stream) {
                        System.err.println("   - " + file.getFileName());
                    }
                } catch (Exception e) {
                    System.err.println("   (não foi possível listar diretório)");
                }
                return;
            }

            System.out.println("✅ index.json encontrado, carregando...");
            Map<?, ?> raw = mapper.readValue(
                    Files.readAllBytes(idx),
                    new TypeReference<Map<?, ?>>() {}
            );

            Object rendaPj = raw.get("renda_pj");
            if (rendaPj instanceof Map<?, ?> map) {
                for (Map.Entry<?, ?> e : map.entrySet()) {
                    rendaPjMap.put(
                            normalize(String.valueOf(e.getKey())),
                            String.valueOf(e.getValue())
                    );
                }
                System.out.println("✅ " + map.size() + " mapeamentos carregados de renda_pj");
            } else {
                System.err.println("⚠️  Chave 'renda_pj' não encontrada ou não é um mapa no index.json");
            }

        } catch (Exception e) {
            System.err.println("❌ Erro ao carregar index.json:");
            e.printStackTrace();
        }
    }

    private String matchSlug(String pergunta) {
        if (rendaPjMap.containsKey(pergunta)) {
            return rendaPjMap.get(pergunta);
        }
        for (Map.Entry<String, String> e : rendaPjMap.entrySet()) {
            if (pergunta.contains(e.getKey())) {
                return e.getValue();
            }
        }
        return null;
    }

    /* ======================== DOC ======================== */

    private Map<String, Object> loadDocBySlug(String slug) {
        try {
            if (dataRoot == null) {
                System.err.println("❌ dataRoot é null, não é possível carregar documento");
                return null;
            }

            Path p = dataRoot
                    .resolve("renda_pj")
                    .resolve(slug)
                    .resolve("index.json");

            System.out.println("📄 Tentando carregar documento: " + p.toAbsolutePath());

            if (!Files.exists(p)) {
                System.err.println("❌ Documento não existe: " + p.toAbsolutePath());
                
                // Verifica se a pasta renda_pj existe
                Path rendaPjDir = dataRoot.resolve("renda_pj");
                if (!Files.exists(rendaPjDir)) {
                    System.err.println("❌ Pasta renda_pj não existe em: " + rendaPjDir.toAbsolutePath());
                } else {
                    System.err.println("   Conteúdo de renda_pj:");
                    try (DirectoryStream<Path> stream = Files.newDirectoryStream(rendaPjDir)) {
                        for (Path file : stream) {
                            System.err.println("   - " + file.getFileName());
                        }
                    } catch (Exception e) {
                        System.err.println("   (não foi possível listar diretório)");
                    }
                }
                return null;
            }

            System.out.println("✅ Documento encontrado, carregando...");
            return mapper.readValue(
                    Files.readAllBytes(p),
                    new TypeReference<Map<String, Object>>() {}
            );

        } catch (Exception e) {
            System.err.println("❌ Erro ao carregar documento para slug '" + slug + "':");
            e.printStackTrace();
            return null;
        }
    }

    /* ======================== RESPOSTA ======================== */

    private String montarResposta(Map<String, Object> doc) {

        StringBuilder sb = new StringBuilder();

        sb.append("Tema: ").append(v(doc, "tema")).append('\n');
        sb.append("Fluxo: ").append(v(doc, "documento")).append('\n');
        sb.append("Pode Aceitar: ").append(v(doc, "pode_aceitar")).append('\n');
        sb.append("Condição: ").append(v(doc, "condicao")).append('\n');

        sb.append("Ações do Analista:\n");
        Object acoes = doc.get("acao_analista");
        if (acoes instanceof List<?> list) {
            for (Object a : list) {
                sb.append("- ").append(a).append('\n');
            }
        }

        sb.append("Resposta de Devolução: ")
          .append(v(doc, "resposta_devolucao"))
          .append('\n');

        Object manual = doc.get("manual");
        if (manual instanceof Map<?, ?> m) {
            Object link = m.get("link_fluxo");
            sb.append("Fonte: ").append(link == null ? "" : link).append('\n');
        } else {
            sb.append("Fonte: \n");
        }

        return sb.toString();
    }

    private String respostaVazia() {
        return "Tema: \nFluxo: \nAções do Analista:\nResposta de Devolução: \nFonte: ";
    }

    /* ======================== UTILS ======================== */

    private static String v(Map<String, Object> m, String k) {
        Object o = m.get(k);
        return o == null ? "" : o.toString();
    }

    private static Path resolveDataDir() {
        Path[] tries = {
                Paths.get("data"),                      // Dentro de backend/
                Paths.get("backend", "data"),           // Raiz do projeto local
                Paths.get("../data"),                   // Um nível acima
                Paths.get("AssistBPO-Web", "data"),     // Estrutura Render alternativa
                Paths.get("..", "AssistBPO-Web", "data") // Outra alternativa
        };
        
        for (Path p : tries) {
            System.out.println("   🔍 Tentando: " + p.toAbsolutePath());
            if (Files.exists(p) && Files.isDirectory(p)) {
                System.out.println("   ✅ ENCONTRADO: " + p.toAbsolutePath());
                return p;
            } else {
                System.out.println("   ❌ Não existe");
            }
        }
        
        System.err.println("❌ Pasta data não encontrada em nenhum local!");
        System.err.println("   Locais testados:");
        for (Path p : tries) {
            System.err.println("   - " + p.toAbsolutePath());
        }
        return null;
    }

    private static String normalize(String s) {
        if (s == null) return "";
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]+", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }
}