const checklistData = {
    "flows": {
        "bem_novo": { 
            "icon": "🏠",
            "name": "Bem Novo",
            "documents": {
                "Ficha Sanitária - Animal": {
                    "name": "Ficha Sanitária - Animal",
                    "icon": "🦏",
                    "imageUrl": "/documents/bem/ficha_sanitaria_animal/ficha_sanitaria_animal.jpg",
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "O nome do associado está correto?": "VÍNCULO NÃO ENCONTRADO",
                        "O quantidade de rebanhos está correta?": "QUANTIDADE DE SEMOVENTES DIVERGENTE",
                    }
                }, 
                "CCIR": {
                    "name": "CCIR",
                    "icon": "🌳",
                    "imageUrl": "/documents/bem/ccir/ccir.jpg",
                    "checklist": {
                        "O bem não se encontra em garantia?": "BEM EM GARANTIA",
                        "O bem não se encontra em aquisição?": "BEM EM PROCESSO DE AQUISIÇÃO",
                        "O documento anexado está correto?": "DOCUMENTO INVÁLIDO",
                        "O ano de exercício do CCIR está dentro do prazo aceito?": "PRAZO DE VALIDADE",
                        "A matrícula no fluxo está condizente com a matrícula do documento?": "MATRICULA",
                        "O percentual de divisão está correto?": "PERCENTUAL DE PROPRIEDADE INCORRETO"
                    }
                },
                "ITR": {
                    "name": "ITR",
                    "icon": "🏞️",
                    "imageUrls": [
                        "/documents/bem/itr/itr_1.png",
                        "/documents/bem/itr/itr_2.png",
                        "/documents/bem/itr/itr_3.png"
                    ],
                    "checklist": {
                        "O bem não se encontra em garantia?": "BEM EM GARANTIA",
                        "O bem não se encontra em aquisição?": "BEM EM PROCESSO DE AQUISIÇÃO",
                        "O documento anexado está correto?": "DOCUMENTO INVÁLIDO",
                        "O documento está dentro do prazo de emissão válido?": "PRAZO DE VALIDADE",
                        "O recibo de pagamento está anexado ao ITR?": "FALTA DE DOCUMENTO COMPROBATÓRIO",
                        "O documento apresenta o cálculo detalhado do imposto?": "FALTA DE CALCULO DETALHADO DO IMÓVEL",
                        "O documento especifica a área do terreno?": "ÁREA DO TERRENO NÃO ENCONTRADA",
                        "O documento especifica a área construída do imóvel?": "ÁREA CONSTRUÍDA NÃO ENCONTRADA",
                        "O documento informa o valor venal (seja o valor do terreno sozinho ou o valor somado)?": "VALOR VENAL NÃO ENCONTRADO"
                    }
                },
                "Laudo de Avaliação": {
                    "name": "Laudo de Avaliação",
                    "icon": "📄",
                    "imageUrls": [
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_1.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_2.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_3.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_4.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_5.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_6.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_7.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_8.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_9.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_10.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_11.jpg",
                        "/documents/bem/laudo_avaliacao/laudo_avaliacao_12.jpg"
                    ],
                    "checklist": {
                        "O bem não se encontra em garantia?": "BEM EM GARANTIA",
                        "O bem não se encontra em aquisição?": "BEM EM PROCESSO DE AQUISIÇÃO",
                        "O documento anexado está correto?": "DOCUMENTO INVÁLIDO",
                        "O valor do bem no documento está compatível com o valor cadastrado": "VALOR INCORRETO DO BEM IMÓVEL",
                        "O laudo está devidamente assinado por uma imobiliária ou por um contador habilitado?": "ASSINATURAS FALTANTES",
                    }
                }
            }
        },
        "certidao": {
            "icon": "📄",
            "name": "Certidão",
            "documents": {
                "caf_pronaf": {
                    "name": "CAF Pronaf",
                    "icon": "📄",
                    "imageUrl": "/documents/certidao/caf_pronaf/caf_pronaf.jpg",
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "O número do documento está correto?": "NÚMERO DO DOCUMENTO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O titular do documento tem vinculo com o associado?": "VÍNCULO NÃO ENCONTRADO"
                    }
                },
                "comprovante_inscricao": {
                    "name": "Comprovante de Inscricao",
                    "icon": "📄",
                    "imageUrl": "/documents/certidao/comprovante_inscricao/comprovante_inscricao.jpg",
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O numero de inscrição está correto?": "INSCRIÇÃO ESTADUAL",
                    }
                }
            } 
        },
        "endereco": { 
            "icon": "📍",
            "name": "Endereço",
            "documents": {
                "conta_energia": { 
                    "name": "Conta de Energia", 
                    "icon": "⚡",
                    "imageUrls": ["/documents/endereco/conta_energia/conta_energia_1.jpg", "/documents/endereco/conta_energia/conta_energia_2.jpg"],
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "O logradouro está correto?": "LOGRADOURO",
                        "O número do endereço é valido?": "NÚMERO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O titular do documento tem vinculo com o associado?": "VÍNCULO NÃO ENCONTRADO"
                    }
                },
                "conta_internet": {
                    "name": "Conta de Internet",
                    "icon": "🌐",
                    "imageUrl": "/documents/endereco/conta_internet/conta_internet.jpg",
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "O logradouro está correto?": "LOGRADOURO",
                        "O número do endereço é valido?": "NÚMERO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O titular do documento tem vinculo com o associado?": "VÍNCULO NÃO ENCONTRADO"
                    }
                },
                "recibo_do_pagador": {
                    "name": "Recibo do Pagador",
                    "icon": "📄",
                    "imageUrl": "/documents/endereco/recibo_do_pagador/recibo_do_pagador.jpg",
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "O logradouro está correto?": "LOGRADOURO",
                        "O número do endereço é valido?": "NÚMERO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O titular do documento tem vinculo com o associado?": "VÍNCULO NÃO ENCONTRADO"
                    }
                },
                "cartao_cnpj": {
                    "name": "Cartão CNPJ",
                    "icon": "📄",
                    "imageUrl": "/documents/endereco/cartao_cnpj/cartao_cnpj.JPG",
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "O tipo de endereço é valido?": "TIPO DE ENDEREÇO",
                        "O logradouro está correto?": "LOGRADOURO",
                        "O número do endereço é valido?": "NÚMERO",
                    }
                }
            }
         },
        "fonte_de_renda": { 
            "icon": "💰", 
            "name": "Fonte de Renda", 
            "documents": {
                "declaracao_de_renda": { 
                    "name": "Declaração de Renda", 
                    "icon": "📝", 
                    "imageUrl": "/documents/renda/declaracao_renda/declaracao_renda.jpg",
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento é válido?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "As assinaturas estão corretas?": "ASSINATURAS INVÁLIDAS"
                    }
                },
                "pgdas_d" : {
                    "name": "PGDAS-D",
                    "icon": "📄",
                    "imageUrls": ["/documents/renda/pgdas_d/pgdas_d.jpg",
                                  "/documents/renda/pgdas_d/recibo_pgdas_d.jpg",
                                  "/documents/renda/pgdas_d/comprovante_opcao_simples.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O calculo está correto no sisbr?":"CÁLCULO DO SIMPLES",
                        "Foi anexado o comprovante do simples":"CONSULTA DE OPÇÃO DO SIMPLES",
                        "A opção do simples está correta?":"OPÇÃO DO OPTANTE DO SIMPLES"
                    }
                },
                "extrato_simples": {
                    "name": "Extrato do simples",
                    "icon": "🏪",
                    "imageUrls": ["/documents/renda/extrato_simples/extrato_simples_1.jpg",
                                  "/documents/renda/extrato_simples/extrato_simples_2.jpg",
                                  "/documents/renda/extrato_simples/extrato_simples_3.jpg",
                                  "/documents/renda/extrato_simples/comprovante_opcao_simples.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O calculo está correto no sisbr?":"CÁLCULO DO SIMPLES",
                        "Foi anexado o comprovante do simples":"CONSULTA DE OPÇÃO DO SIMPLES",
                        "A opção do simples está correta?":"CAMPO 'OPTANTE DO SIMPLES'"
                    }   
                },
                "relatorio_inss":{
                    "name": "Relatório INSS",
                    "icon": "👴",
                    "imageUrl": ["/documents/renda/relatorio_inss/relatorio_inss.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                    }
                }, 
                "holerite":{
                    "name": "Holerite",
                    "icon": "📃",
                    "imageUrls": ["/documents/renda/holerite/holerite_1.jpg",
                                  "/documents/renda/holerite/holerite_2.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                    }
                },
                "declaracao_inss":{
                    "name": "Declaração INSS",
                    "icon": "👵",
                    "imageUrl": "/documents/renda/declaracao_inss/declaracao_inss.jpg",
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                    }
                },
                "Notas Fiscais":{
                    "name": "Notas Fiscais",
                    "icon": "📄",
                    "imageUrls": ["/documents/renda/nota_fiscal/nota_fiscal.jpg","/documents/renda/nota_fiscal/recibo_nf.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                    }
                },
                "extrato_pagamento": {
                    "name": "Extrato de pagamento",
                    "icon": "📄",
                    "imageUrls": ["/documents/renda/extrato_pagamento/extrato_pagamento_1.jpg", "/documents/renda/extrato_pagamento/extrato_pagamento_2.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                    }
                },
                "fcpr": {
                    "name": "FCPR",
                    "icon": "🚜",
                    "imageUrls": ["/documents/renda/fcpr/fcpr_1.jpg", "/documents/renda/fcpr/fcpr_2.jpg","/documents/renda/fcpr/caf_pronaf.jpg", "/documents/renda/planilha_rebanho/comprovante_assinatura.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O documento está assinado?": "ASSINATURAS FALTANTES"
                    }
                },
                "planilha_rebanho": {
                    "name": "Planilha de Rebanho",
                    "icon": "🐑",
                    "imageUrls": ["/documents/renda/planilha_rebanho/planilha_rebanho.jpg", "/documents/renda/planilha_rebanho/comprovante_assinatura.jpg"],
                    "checklist": {
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O valor da renda está correto?": "RENDA MENSAL INVÁLIDA",
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "A data de emissão está dentro do prazo?": "PRAZO DE VALIDADE",
                        "O documento está assinado?": "ASSINATURAS FALTANTES"
                    }
                },
                "declaracao_faturamento":{
                    "name": "Declaração de Faturamento",
                    "icon": "📄",
                    "imageUrls": ["/documents/renda/declaracao_faturamento/declaracao_faturamento.jpg", "/documents/renda/declaracao_faturamento/comprovante_opcao_simples.jpg"],
                    "checklist": {
                        "O documento esta correto?": "DOCUMENTO INVÁLIDO",
                        "O tipo de renda está correto?": "TIPO DE RENDA INCORRETO",
                        "O cnpj da empresa é correto?": "CADASTRO DIVERGENTE DO COMPROVANTE",
                        "A divisão de faturamento está de acordo com os meses apresentados?": "DIVISÃO DE RENDA MENSAL INCORRETA",                        
                        "A data de emissão está dentro do prazo(ultimos 12 meses)?": "PRAZO DE VALIDADE",
                        "O campo de opção MEI está marcada corretamente?(Se sim, assinatura do contador dispensada)": "OPÇÃO MEI",
                        "As assinaturas estão corretas?": "ASSINATURAS FALTANTES"
                    }
                }
            }
        },
        "tributacao": { "icon": "🧾", "name": "Tributação", "documents": {} },
        "pessoa": { 
            "icon": "🧑",
            "name": "Pessoa",
            "documents": {
                "cnh_digital":{
                    "name": "CNH Digital",
                    "icon": "🚗",
                    "imageUrl": "/documents/pessoa/cnh_digital/cnh_digital.jpg",
                    "checklist": {
                        "O documento é válido?": "DOCUMENTO INVÁLIDO",
                        "O tipo de documento é correto?": "TIPO DE DOCUMENTO",
                        "O número do documento é correto?": "NÚMERO DO DOCUMENTO",
                        "A data de emissão é correta?": "DATA DE EMISSÃO",
                        "O orgão expedidor é correto?": "ÓRGÃO EXPEDIDOR",
                        "A uf de emissão é correta?": "UF DO ÓRGÃO EXPEDIDOR",
                        "O estado civil é correto?": "ESTADO CIVIL",
                        "A naturalidade é correta?": "NATURALIDADE",
                    }
                },
                "alteracao_contratual": {
                    "name": "Alteração Contratual",
                    "icon": "📄",
                    "imageUrls": ["/documents/pessoa/alteracao_contratual/alteracao_contratual_1.jpg",
                                  "/documents/pessoa/alteracao_contratual/alteracao_contratual_2.jpg",
                                  "/documents/pessoa/alteracao_contratual/alteracao_contratual_3.jpg",
                                  "/documents/pessoa/alteracao_contratual/alteracao_contratual_4.jpg",
                                  "/documents/pessoa/alteracao_contratual/alteracao_contratual_5.jpg",
                                  "/documents/pessoa/alteracao_contratual/alteracao_contratual_6.jpg",
                                  "/documents/pessoa/alteracao_contratual/termo_autenticacao.jpg"],
                    "checklist": {
                        "Possui documentos na aba 'Novo'?": "APROVAÇÃO SEM VALIDAÇÃO",
                        "A data de constituição está correta?": "DATA DE CONSTITUIÇÃO",
                        "O número de registro no órgão competente está correto?": "NÚMERO DE REGISTRO NO ÓRGÃO COMPETENTE",
                        "A data de registro no órgão competente está correta?": "DATA DE REGISTRO NO ÓRGÃO COMPETENTE",
                        "O número da última alteração do contrato social está correto?": "NÚMERO DA ÚLTIMA ALTERAÇÃO DO CONTRATO SOCIAL",
                        "A data da última alteração do contrato social está correta?": "DATA DA ÚLTIMA ALTERAÇÃO DO CONTRATO SOCIAL",
                        "O número do contrato social está correto?": "NÚMERO DO CONTRATO SOCIAL",
                        "O capital social está correto?": "CAPITAL SOCIAL",
                        "A inscrição estadual está correta?": "INSCRIÇÃO ESTADUAL",
                        "Opção MEI está correta?": "OPÇÃO MEI",
                    }
                }
            }
        },
        "produtividade": { "icon": "📊", "name": "Produtividade", "documents": {} },
        "produtor": { 
            "icon": "🌾",
            "name": "Produtor",
            "documents": {
                "checklist_produtor":{
                    "name": "Checklist Produtor",
                    "icon": "✅",
                    "imageUrls": [
                        "/documents/produtor/inscricao_estadual/inscricao_estadual.jpg",
                        "/documents/produtor/portal_atendimento/portal_atendimento_rendas.png",
                        "/documents/produtor/portal_atendimento/portal_atendimento_certidoes.png",
                        "/documents/produtor/caf_pronaf/caf_pronaf.jpg"
                    ],
                    "checklist": {
                        "O documento anexado é valido?": "DOCUMENTO INVÁLIDO",
                        "Os documentos estão anexados nas chaves corretas?": "CHAVES INCORRETAS",
                        "A inscrição estadual está correta?": "INSCRIÇÃO ESTADUAL",
                        "A situação cadastral está ativa?": "SITUAÇÃO CADASTRAL",
                        "A categoria do produtor está correta?": "CATEGORIA DO PRODUTOR",
                        "Possui CAF Pronaf cadastrado na plataforma de atendimento?": "CATEGORIA DO PRODUTOR INCORRETA (CAF PRONAF)"

                    } 
                }
            }
        },
        "relacionamento": { 
            "icon": "🤝",
            "name": "Relacionamento",
            "documents": {
                "alteracao_sociedade" : {
                    "name": "Alteração de Sociedade",
                    "icon": "📄",
                    "imageUrls": ["/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_1.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_2.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_3.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_4.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_5.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_6.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_7.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_8.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_9.jpg",
                                  "/documents/relacionamento/alteracao_sociedade/alteracao_sociedade_10.jpg"
                                  ],
                    "checklist": {
                        "O documento é valido?": "DOCUMENTO INVÁLIDO",
                        "O socio cadastrado foi encontrado no documento?": "VÍNCULO NÃO ENCONTRADO",
                        "O tipo de relacionamento é correto?": "TIPO DE RELACIONAMENTO INCORRETO",
                        "O percentual de capital social é correto?": "PERCENTUAL NO CAPITAL SOCIAL INCORRETO",
                        "Data de início do mandato está de acordo com o documento?": "DATA DE INÍCIO DO MANDATO INVÁLIDA",
                        "Data de fim do mandato está de acordo com o documento?": "DATA DE FIM DO MANDATO INVÁLIDA",
                        "As assinaturas estão corretas?": "ASSINATURAS FALTANTES",
                    }
                }
            } 
        },
        "responsavel": { "icon": "👨‍💼", "name": "Responsável", "documents": {} }
};

export default checklistData;
