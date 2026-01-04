import React, { useState, useMemo, useEffect } from 'react';

const PARECERES_DATA = {
  "Pareceres Gerais": {
    "DOCUMENTO ILEGÍVEL": "FAVOR ANEXAR DOCUMENTO LEGÍVEL, POIS NÃO FOI POSSÍVEL IDENTIFICAR COM NITIDEZ AS INFORMAÇÕES NO DOCUMENTO ANEXADO.",
    "DOCUMENTO INVÁLIDO": "O DOCUMENTO ANEXADO NÃO É VÁLIDO PARA COMPROVAR O TIPO DE FLUXO VIGENTE. FAVOR ANEXAR A DOCUMENTAÇÃO VÁLIDA.",
    "ARQUIVO CORROMPIDO": "ERRO AO TENTAR ABRIR O ARQUIVO ANEXADO. FAVOR SALVAR O DOCUMENTO NOVAMENTE (PREFERENCIALMENTE EM PDF) E REENVIAR.",
    "INFORMAÇÕES FALTANTES":"A INFORMAÇÃO DE {} NÃO FOI ENCONTRADA NO DOCUMENTO ANEXADO. FAVOR ANEXAR DOCUMENTO QUE CONSTE ESSA INFORMAÇÃO", 
    "INFORMAÇÕES DIVERGENTES": "FAVOR CORRIGIR A INFORMAÇÃO DO CAMPO {} PARA {}.",
    "PRAZO DE VALIDADE": "O DOCUMENTO ANEXADO ESTÁ FORA DO PRAZO DE VALIDADE (90 DIAS). FAVOR ANEXAR UM DOCUMENTO ATUALIZADO QUE COMPROVE A INCLUSÃO/ALTERAÇÃO.",
    "CHAVES INCORRETAS": "O DOCUMENTO FOI ANEXADO NA CHAVE INCORRETA. FAVOR CORRIGIR.",
    "ASSINATURAS INVÁLIDAS": "O DOCUMENTO ANEXADO CONTÉM ASSINATURAS INVÁLIDAS OU HÍBRIDAS. FAVOR ANEXAR DOCUMENTO COM ASSINATURAS VÁLIDAS.",
    "ASSINATURAS FALTANTES": "O DOCUMENTO ANEXADO NÃO CONTÉM AS ASSINATURAS OBRIGATÓRIAS. FAVOR ANEXAR DOCUMENTO COM ASSINATURAS VÁLIDAS.",
    "VÍNCULO NÃO ENCONTRADO": "NÃO FOI POSSÍVEL LOCALIZAR O VÍNCULO DO ASSOCIADO COM O TERCEIRO MENCIONADO NO DOCUMENTO. FAVOR ANEXAR DOCUMENTO QUE COMPROVE O VÍNCULO.",
    "FALTA DE DOCUMENTO COMPROBATÓRIO": "FAVOR ANEXAR A DOCUMENTAÇÃO QUE COMPROVE A INCLUSÃO/ALTERAÇÃO.",
    "DESCRIÇÃO DIVERGENTE": "A DESCRIÇÃO INFORMADA NO FLUXO NÃO CONDIZ COM OS COMPROVANTES ANEXADOS.",
    "DOCUMENTO CORTADO OU RASURADO": "O DOCUMENTO ANEXADO ESTÁ CORTADO OU RASURADO. FAVOR ANEXAR A DOCUMENTAÇÃO COMPLETA E LEGÍVEL.",
    "EXCLUSÃO NÃO PERMITIDA": "A EXCLUSÃO DO FLUXO NÃO FOI PERMITIDA PELO SISTEMA, QUE EXIBIU UMA MENSAGEM DE ERRO DURANTE A TENTATIVA.",
    "CADASTRO DIVERGENTE DO COMPROVANTE": "AS INFORMAÇÕES CADASTRADAS DIVERGEM DO COMPROVANTE ANEXADO OU NÃO FORAM DEVIDAMENTE ATUALIZADAS.",
    "CAPTURA DE TELA INVÁLIDA": "O DOCUMENTO ANEXADO É UMA CAPTURA DE TELA (PRINT). FAVOR ANEXAR O DOCUMENTO ORIGINAL E VÁLIDO.",
    "APROVAÇÃO SEM VALIDAÇÃO": "APROVAÇÃO REALIZADA CONFORME DOCUMENTAÇÃO VIGENTE, DEVIDO À FALTA DE DOCUMENTOS NO CAMPO NOVO.",
    "DECLARAÇÃO DE TERCEIROS": "SOLICITAMOS QUE SEJA ANEXADA UMA AUTODECLARAÇÃO ASSINADA PELO ASSOCIADO, VISTO QUE NÃO ACEITAMOS DECLARAÇÃO EMITIDA POR TERCEIROS PARA ESTE FIM."
  },
  "Fluxos de Fontes de Renda": {
    "Pareceres Gerais de Renda": {
      "RENDA MENSAL INVÁLIDA": "A RENDA CADASTRADA NÃO É VÁLIDA PARA COMPROVAÇÃO. FAVOR UTILIZAR UMA FONTE DE RENDA VÁLIDA PARA A INCLUSÃO/ALTERAÇÃO.",
      "RENDA DE RESCISÃO": "A RENDA CADASTRADA NÃO PODE SER ACEITA POIS CONSTA NO DOCUMENTO COMO 'RESCISÃO DE CONTRATO DE TRABALHO' (ITEM 04). FAVOR ANEXAR UMA FONTE DE RENDA MENSAL VÁLIDA.",
      "TIPO DE RENDA INCORRETO": "CORRIGIR O TIPO DE RENDA PARA {}.",
      "RENDA NÃO ENCONTRADA:": "NÃO FOI POSSÍVEL LOCALIZAR O VALOR CADASTRADO, SE POSSÍVEL, EXPLICAR O CALCULO UTILIZADO PARA O CADASTRO",
      "DIVISÃO DE RENDA MENSAL INCORRETA": "A DIVISÃO DA RENDA MENSAL ESTÁ INCORRETA. FAVOR CORRIGIR PARA R$ {}.",
      "DIVISÃO DE RENDA MENSAL DE APOSENTADORIA INCORRETA": "O VALOR SOMADO NÃO É CONSIDERADO RECORRENTE. SOLICITAMOS A CORREÇÃO DA RENDA MENSAL PARA R$ {}, SEM A SOMA DO 13º SALÁRIO.",
      "RENDA PROVENIENTE DE FONTES PAGADORAS DIVERGENTES": "A RENDA UTILIZADA É UMA SOMA DE FONTES DISTINTAS. FAVOR CADASTRÁ-LAS SEPARADAMENTE.",
      "ASSINATURAS PRO-LABORE": "O DOCUMENTO ANEXADO NECESSITA DA ASSINATURA DO CONTADOR, REPRESENTANTE DA EMPRESA OU EMPREGADO SICOOB. SOLICITAMOS QUE O MESMO SEJA REENVIADO DEVIDAMENTE ASSINADO.",
      "PRAZO DE VALIDADE IRPF": "O PRAZO DO IRPF DE 2023/2024 ESTÁ ENCERRADO. SOLICITAMOS QUE SEJA ANEXADO O IRPF ATUALIZADO PARA O ANO 2024/2025.",
      "CNPJ BAIXADO": "AO CONSULTAR O CNPJ DA FONTE PAGADORA, CONSTATAMOS QUE O MESMO ENCONTRA-SE BAIXADO. SOLICITAMOS QUE SEJA CADASTRADA UMA RENDA MENSAL VÁLIDA.",
      "IRPF EM PREENCHIMENTO": "NÃO ACEITAMOS IMPOSTO DE RENDA EM STATUS DE PREENCHIMENTO (RASCUNHO). SOLICITAMOS QUE SEJA ANEXADO O IRPF TRANSMITIDO E VÁLIDO.",
      "FALTA RECIBO IRPF": "SOLICITAMOS QUE SEJA ANEXADO O RECIBO DE ENTREGA DO IRPF JUNTAMENTE COM O DECLARATÓRIO COMPLETO.",
      "HOLERITE SEM CNPJ": "O HOLERITE ANEXADO NÃO APRESENTA O CNPJ DA EMPRESA DE FORMA VISÍVEL. FAVOR ANEXAR DOCUMENTO ONDE CONSTE O CNPJ PARA VALIDAÇÃO DO CADASTRO."
    },
    "Pareceres de Renda Agropecuária": {
      "RENDA NÃO PROVENIENTE DE ATIVIDADE RURAL": "A RENDA CADASTRADA NÃO É AGROPECUÁRIA. FAVOR CORRIGIR O TIPO DE RENDA PARA R$ {}.",
      "DIVISÃO DE RENDA AGROPECUÁRIA INCORRETA": "A DIVISÃO DA RENDA FAMILIAR ESTÁ INCORRETA. FAVOR CORRIGIR PARA R$ {}.",
      "FALTA DE EXTRATO PARA NOTAS FISCAIS": "CONFORME CONSTA NO MANUAL DE CADASTRO, É NECESSÁRIO O ENVIO DAS VALIDAÇÕES DAS NOTAS FISCAIS (UMA POR UMA) PELO SITE QUE CONSTA NO MANUAL PÁGINA 53.",
      "LAUDO DE PRODUÇÃO AGROPECUÁRIA": "FAVOR AJUSTAR O LAUDO DE PRODUÇÃO AGROPECUÁRIA. O DOCUMENTO INDICA {} QUANDO O CORRETO SERIA {}.",
      "RENDA EFETIVA SOMADA COM PREVISÃO": "FOI UTILIZADA RENDA EFETIVA SOMADA COM PREVISÃO PARA A RENDA ANUAL. FAVOR CORRIGIR O VALOR DA RENDA PARA R$ {}."
    },
    "Pareceres de Renda - SIMPLES Nacional": {
      "COMPROVANTE DO SIMPLES NACIONAL": "SÓ SÃO PERMITIDOS DOCUMENTOS DO SIMPLES PARA EMPRESAS OPTANTES DO SIMPLES NACIONAL. FAVOR ANEXAR O COMPROVANTE CORRETO.",
      "CONSULTA DE OPÇÃO DO SIMPLES": "FAVOR ANEXAR O COMPROVANTE DE OPÇÃO PELO SIMPLES NACIONAL.",
      "OPÇÃO DO OPTANTE DO SIMPLES": "AJUSTAR O CAMPO OPTANTE DO SIMPLES NACIONAL PARA SIM OU NÃO.",
      "CÁLCULO DO SIMPLES": "A RENDA CADASTRADA ESTÁ INCORRETA. FAVOR CORRIGIR PARA R$ {} (1ª FORMA DE CÁLCULO) OU PARA R$ {} (2ª FORMA DE CÁLCULO)."
    },
    "Pareceres de Renda - Pessoa Física": {
      "PRÓ-LABORE ACIMA DO LIMITE (MEI)": "A RENDA CADASTRADA ULTRAPASSA O LIMITE DE R$ 6.750,00 PARA PRÓ-LABORE DE EMPRESAS MEI.",
      "RENDA DE TERCEIRO": "A RENDA CADASTRADA ESTÁ EM NOME DE TERCEIROS. FAVOR INFORMAR UMA RENDA PRÓPRIA.",
      "RENDA INFORMADA NÃO RECORRENTE": "A RENDA UTILIZADA NÃO É RECORRENTE. FAVOR CADASTRÁ-LA SEPARADAMENTE COM O TIPO DE RENDA OUTROS."
    }
  },
  "Fluxos de Pessoa": {
    "Pareceres Gerais de Pessoa": {
      "TIPO DE DOCUMENTO": "CORRIGIR O TIPO DE DOCUMENTO PARA {}.",
      "NÚMERO DO DOCUMENTO": "O NÚMERO CADASTRADO DIVERGE DO DOCUMENTO ANEXADO. CORRIGIR PARA {}.",
      "DATA DE EMISSÃO": "CORRIGIR A DATA DE EMISSÃO PARA {}.",
      "FICHA CADASTRAL": "DADOS INCORRETOS NA FICHA CADASTRAL. FAVOR AJUSTAR.",
      "FICHA PEP": "PREENCHIMENTO INCORRETO DA FICHA DE PESSOA POLITICAMENTE EXPOSTA (PEP).",
      "UF DO ÓRGÃO EXPEDIDOR": "CORRIGIR A UF DO ÓRGÃO EXPEDIDOR PARA {}."
    },
    "Pareceres de Pessoa Física": {
      "ESTADO CIVIL": "CORRIGIR O ESTADO CIVIL PARA {}, CONFORME DOCUMENTO ANEXADO.",
      "ÓRGÃO EXPEDIDOR": "CORRIGIR O ÓRGÃO EXPEDIDOR PARA {}, CONFORME DOCUMENTO ANEXADO.",
      "NATURALIDADE": "CORRIGIR A NATURALIDADE PARA {}, CONFORME DOCUMENTO ANEXADO.",
      "FILIAÇÃO": "CORRIGIR O NOME DO PAI/MÃE PARA {}, CONFORME DOCUMENTO ANEXADO."
    },
    "Pareceres de Pessoa Jurídica": {
      "DATA DE CONSTITUIÇÃO": "CORRIGIR A DATA DE CONSTITUIÇÃO PARA {}.",
      "NÚMERO DE REGISTRO NO ÓRGÃO COMPETENTE": "CORRIGIR O NÚMERO DE REGISTRO NO ÓRGÃO COMPETENTE PARA {}.",
      "NÚMERO DA ÚLTIMA ALTERAÇÃO DO CONTRATO SOCIAL": "CORRIGIR O NÚMERO DA ÚLTIMA ALTERAÇÃO DO CONTRATO SOCIAL PARA {}.",
      "DATA DA ÚLTIMA ALTERAÇÃO DO CONTRATO SOCIAL": "CORRIGIR A DATA DA ÚLTIMA ALTERAÇÃO DO CONTRATO SOCIAL PARA {}.",
      "NÚMERO DE REGISTRO DE REPRESENTAÇÃO": "CORRIGIR O NÚMERO DE REGISTRO DE REPRESENTAÇÃO PARA {}.",
      "DATA DE REGISTRO DE REPRESENTAÇÃO": "CORRIGIR A DATA DE REGISTRO DE REPRESENTAÇÃO PARA {}.",
      "OPÇÃO MEI": "SOLICITAMOS A CORREÇÃO DA OPÇÃO MEI PARA {}, CONFORME CONSTA NO DOCUMENTO ANEXADO.",
      "NÚMERO DO CONTRATO SOCIAL": "CORRIGIR O NÚMERO DO CONTRATO SOCIAL PARA {}.",
      "CAPITAL SOCIAL": "CORRIGIR O CAPITAL SOCIAL PARA R$ {}.",
      "INSCRIÇÃO ESTADUAL": "CORRIGIR A INSCRIÇÃO ESTADUAL PARA {}.",
      "DATA DE REGISTRO NO ÓRGÃO COMPETENTE": "CORRIGIR A DATA DE REGISTRO NO ÓRGÃO COMPETENTE PARA {}."
    }
  },
  "Fluxos de Endereço": {
    "TIPO DE ENDEREÇO": "CORRIGIR O TIPO DE ENDEREÇO PARA {}.",
    "LOGRADOURO": "CORRIGIR O LOGRADOURO PARA {}.",
    "NÚMERO": "CORRIGIR O NÚMERO PARA {}."
  },
  "Fluxos de Relacionamento": {
    "Pareceres Gerais de Relacionamento": {
      "TIPO DE RELACIONAMENTO INCORRETO": "O TIPO DE RELACIONAMENTO NÃO CONDIZ COM A DOCUMENTAÇÃO FORNECIDA. FAVOR AJUSTAR.",
      "DATA DE INÍCIO DO MANDATO INVÁLIDA": "A DATA DE INÍCIO DO MANDATO ESTÁ INVÁLIDA OU NÃO CONDIZ COM O DOCUMENTO. FAVOR CORRIGIR PARA {}.",
      "DATA DE FIM DO MANDATO INVÁLIDA": "A DATA DE FIM DO MANDATO ESTÁ INCORRETA OU NÃO É COMPATÍVEL COM O DOCUMENTO. FAVOR CORRIGIR PARA {}.",
      "FALTA NÚMERO DO REGISTRO": "FAVOR INFORMAR O NÚMERO DO REGISTRO.",
      "FALTA NÚMERO DO LIVRO": "FAVOR INFORMAR O NÚMERO DO LIVRO.",
      "FALTA NÚMERO DA FOLHA": "FAVOR INFORMAR O NÚMERO DA FOLHA.",
      "FALTA NOME DO CARTÓRIO": "FAVOR INFORMAR O NOME DO CARTÓRIO."
    },
    "Pareceres de Relacionamento - Pessoa Jurídica": {
      "PERCENTUAL NO CAPITAL SOCIAL INCORRETO": "O PERCENTUAL INFORMADO NO CAPITAL SOCIAL ESTÁ INCORRETO OU INCONSISTENTE. FAVOR CORRIGIR PARA {}%."
    }
  },
  "Fluxos de Bem": {
    "Pareceres Gerais de Bem": {
      "TIPO DO BEM INCORRETO": "O TIPO DO BEM NÃO FOI INFORMADO OU ESTÁ INCORRETO. FAVOR CORRIGIR PARA {}.",
      "VALOR DE AVALIAÇÃO INCORRETO": "O VALOR DE AVALIAÇÃO ESTÁ INCORRETO OU NÃO CONDIZ COM O LAUDO. FAVOR CORRIGIR PARA R$ {}.",
      "ÁREA DIVERGENTE": "A ÁREA INFORMADA DIVERGE DA DOCUMENTAÇÃO. FAVOR CORRIGIR PARA {}.",
      "DATA DE AVALIAÇÃO DIVERGENTE": "A DATA DA AVALIAÇÃO NÃO CORRESPONDE À DATA DO LAUDO. FAVOR CORRIGIR PARA {}.",
      "VALOR DO BEM INCORRETO": "O VALOR DO BEM INFORMADO NÃO ESTÁ CORRETO. FAVOR CORRIGIR PARA R$ {}.",
      "DESCRIÇÃO DO BEM INCOMPLETA/INCORRETA": "A DESCRIÇÃO DO BEM NÃO CONDIZ COM O TIPO DE BEM OU ESTÁ INCOMPLETA. FAVOR AJUSTAR.",
      "CADASTRO INDEVIDO DE BEM EM AQUISIÇÃO": "NÃO É PERMITIDO CADASTRAR BEM EM PROCESSO DE AQUISIÇÃO COMO SE FOSSE DE POSSE PLENA.",
      "BEM NÃO COMPROVADO COMO PATRIMÔNIO": "O BEM INFORMADO NÃO FOI COMPROVADO COMO PATRIMÔNIO. FAVOR ANEXAR DOCUMENTAÇÃO COMPROBATÓRIA.",
      "LAUDO DE AVALIAÇÃO INVÁLIDO": "O LAUDO DE AVALIAÇÃO NÃO É VÁLIDO OU NÃO CORRESPONDE AO BEM INFORMADO. FAVOR ANEXAR LAUDO VÁLIDO.",
      "PERCENTUAL DE PROPRIEDADE INCORRETO": "O PERCENTUAL DE PROPRIEDADE DO BEM NÃO FOI INFORMADO OU ESTÁ INCORRETO. FAVOR CORRIGIR PARA {}%.",
      "CADASTRO INDEVIDO DE BENS EM CONJUNTO": "OS BENS FORAM INFORMADOS EM CONJUNTO QUANDO DEVERIAM SER CADASTRADOS SEPARADAMENTE. FAVOR REALIZAR CADASTROS INDIVIDUAIS.",
      "PERCENTUAL INCORRETO NA EXCLUSÃO DE BEM": "POR SE TRATAR DE EXCLUSÃO, O PERCENTUAL DE PROPRIEDADE DEVE SER ZERADO. FAVOR AJUSTAR.",
      "TIPO DE BEM INVÁLIDO (EMPREENDIMENTO)": "EMPREENDIMENTOS NÃO SÃO ACEITOS COMO BENS PATRIMONIAIS. FAVOR REMOVER O CADASTRO."
    },
    "Pareceres de Bens Móveis": {
      "TIPO DO CHASSI INCORRETO": "O TIPO DE CHASSI ESTÁ INCORRETO. FAVOR CORRIGIR PARA {}.",
      "NÚMERO DO CHASSI INVÁLIDO": "O NÚMERO DO CHASSI ESTÁ INVÁLIDO OU NÃO FOI REGISTRADO CORRETAMENTE. FAVOR CORRIGIR PARA {}.",
      "RENAVAM INCORRETO": "O NÚMERO DO RENAVAM ESTÁ INCORRETO OU NÃO CORRESPONDE AO VEÍCULO. FAVOR CORRIGIR PARA {}.",
      "PLACA INVÁLIDA": "A PLACA DO VEÍCULO ESTÁ INVÁLIDA OU NÃO FOI REGISTRADA CORRETAMENTE. FAVOR CORRIGIR PARA {}.",
      "ANO DE FABRICAÇÃO INCORRETO": "O ANO DE FABRICAÇÃO INFORMADO ESTÁ INCORRETO. FAVOR CORRIGIR PARA {}.",
      "ANO MODELO INCORRETO": "O ANO MODELO NÃO CORRESPONDE AO VEÍCULO REGISTRADO. FAVOR CORRIGIR PARA {}."
    },
    "Pareceres de Bens Imóveis": {
      "ÁREA DO IMÓVEL DIVERGENTE": "A ÁREA DO IMÓVEL INFORMADA DIVERGE DA DOCUMENTAÇÃO. FAVOR CORRIGIR PARA {}.",
      "UNIDADE DE MEDIDA INCOERENTE": "A UNIDADE DE MEDIDA NÃO ESTÁ COERENTE COM O DOCUMENTO. FAVOR CORRIGIR PARA {}.",
      "BEM EM GARANTIA": "O IMÓVEL INFORMADO ESTÁ CADASTRADO COMO EM GARANTIA NA PLATAFORMA DE ATENDIMENTO. FAVOR VERIFICAR, POIS ESTANDO EM GARANTIA NÃO É POSSÍVEL ALTERAR O VALOR DO IMÓVEL.",
      "BEM EM PROCESSO DE AQUISIÇÃO": "O IMÓVEL INFORMADO ESTÁ CADASTRADO COMO EM PROCESSO DE AQUISIÇÃO NA PLATAFORMA DE ATENDIMENTO. FAVOR ASSINALAR A FLAG DE BEM EM AQUISIÇÃO NO CADASTRO DO IMÓVEL.",
      "MATRICULA": "O NÚMERO DA MATRÍCULA INFORMADO ESTÁ INCORRETO. FAVOR CORRIGIR PARA {}.",
      "PERCENTUAL DE PROPRIEDADE INCORRETO": "O PERCENTUAL DE PROPRIEDADE ESTÁ INCORRETO. FAVOR AJUSTAR PARA {}%.",
      "FALTA DE CALCULO DETALHADO DO IMÓVEL": "O CALCULO DETALHADO DO IMÓVEL NÃO FOI INFORMADO NO DOCUMENTO ANEXADO. FAVOR ANEXAR DOCUMENTO QUE CONTENHA ESSA INFORMAÇÃO.",
      "ÁREA DO TERRENO NÃO ENCONTRADA": "A ÁREA DO TERRENO NÃO FOI INFORMADA NO DOCUMENTO ANEXADO. FAVOR ANEXAR DOCUMENTO QUE CONTENHA ESSA INFORMAÇÃO.",
      "ÁREA CONSTRUÍDA NÃO ENCONTRADA": "A ÁREA CONSTRUÍDA NÃO FOI INFORMADA NO DOCUMENTO ANEXADO. FAVOR ANEXAR DOCUMENTO QUE CONTENHA ESSA INFORMAÇÃO.",
      "VALOR VENAL NÃO ENCONTRADO": "O VALOR VENAL NÃO FOI INFORMADO NO DOCUMENTO ANEXADO. FAVOR ANEXAR DOCUMENTO QUE CONTENHA ESSA INFORMAÇÃO.",
      "VALOR INCORRETO DO BEM IMÓVEL": "O VALOR DO IMÓVEL INFORMADO ESTÁ INCORRETO. FAVOR CORRIGIR PARA R$ {}."
    },
    "Pareceres de Bens Agropecuários": {
      "QUANTIDADE DE SEMOVENTES DIVERGENTE": "A QUANTIDADE DE SEMOVENTES INFORMADA DIVERGE DO COMPROVANTE. FAVOR CORRIGIR PARA {}.",
      "PERCENTUAL DE ARRENDAMENTO INCORRETO": "O PERCENTUAL DE ARRENDAMENTO NÃO FOI INFORMADO OU ESTÁ INCORRETO. FAVOR CORRIGIR PARA {}%.",
      "DESCRIÇÃO DE SEMOVENTES DIVERGENTE": "A DESCRIÇÃO DO SEMOVENTE DIVERGE DO DOCUMENTO. FAVOR AJUSTAR."
    }
  },
  "Fluxos de Produtor": {
    "Pareceres Gerais de Produtor": {
      "CATEGORIA DO PRODUTOR": "A CATEGORIA DO PRODUTOR ESTÁ INCORRETA. FAVOR AJUSTAR PARA {}.",
      "SITUAÇÃO CADASTRAL": "A SITUAÇÃO CADASTRAL DO PRODUTOR NÃO ENCONTRA-SE COMO ATIVA OU HABILITADA. PORTANTO, NÃO PODENDO SER ACEITA. FAVOR AJUSTAR.",
      "CATEGORIA DO PRODUTOR INCORRETA (CAF PRONAF)": "A CATEGORIA DO PRODUTOR ESTÁ INCORRETA. FAVOR AJUSTAR PARA PEQUENO PRODUTOR, VISTO QUE O ASSOCIADO POSSUI CAF PRONAF CADASTRADO."
    }
  }
};

// Helper function to flatten the data structure
const flattenData = (data) => {
  const templates = [];
  let idCounter = Date.now(); // Use timestamp for unique IDs

  Object.entries(data).forEach(([category, content]) => {
    if (typeof content === 'string') {
      templates.push({
        id: idCounter++,
        category: category,
        subcategory: null,
        title: category, // Use category as title if direct
        content: content
      });
    } else {
      Object.entries(content).forEach(([subKey, subContent]) => {
        if (typeof subContent === 'string') {
          templates.push({
            id: idCounter++,
            category: category,
            subcategory: null,
            title: subKey,
            content: subContent
          });
        } else {
          Object.entries(subContent).forEach(([itemTitle, itemContent]) => {
            templates.push({
              id: idCounter++,
              category: category,
              subcategory: subKey,
              title: itemTitle,
              content: itemContent
            });
          });
        }
      });
    }
  });
  return templates;
};

export function OpinionTemplates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  
  const profile = JSON.parse(localStorage.getItem('assistbpo_user_profile') || '{}');
  const userRole = profile.role || 'Assistente BPO';
  const canEdit = ['Gerente de Operações', 'Coordenador(a)', 'Líder'].includes(userRole);

  // State for editable templates
  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('assistbpo_pareceres');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved pareces", e);
      }
    }
    return flattenData(PARECERES_DATA);
  });

  // Edit/Add Mode States
  const [isEditing, setIsEditing] = useState(false); // Global toggle for edit mode
  const [editingItem, setEditingItem] = useState(null); // Item currently being edited
  const [isAdding, setIsAdding] = useState(false); // Mode for adding new item
  const [newItem, setNewItem] = useState({ category: '', subcategory: '', title: '', content: '' });

  // Save to localStorage whenever templates change
  useEffect(() => {
    localStorage.setItem('assistbpo_pareceres', JSON.stringify(templates));
  }, [templates]);

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja restaurar os pareceres originais? Todas as alterações personalizadas serão perdidas.')) {
      const defaults = flattenData(PARECERES_DATA);
      setTemplates(defaults);
      setEditingItem(null);
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este parecer?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      setTemplates(prev => prev.map(t => t.id === editingItem.id ? editingItem : t));
      setEditingItem(null);
    }
  };

  const handleCreate = () => {
    if (!newItem.category || !newItem.title || !newItem.content) {
      alert('Preencha pelo menos Categoria, Título e Conteúdo.');
      return;
    }
    
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      subcategory: newItem.subcategory || null
    };
    
    setTemplates(prev => [itemToAdd, ...prev]);
    setIsAdding(false);
    setNewItem({ category: '', subcategory: '', title: '', content: '' });
  };

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.subcategory && t.subcategory.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [templates, searchTerm]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const groupedDisplay = useMemo(() => {
    const groups = {};
    
    filteredTemplates.forEach(template => {
      if (!groups[template.category]) {
        groups[template.category] = { items: [], subcategories: {} };
      }
      
      if (template.subcategory) {
        if (!groups[template.category].subcategories[template.subcategory]) {
          groups[template.category].subcategories[template.subcategory] = [];
        }
        groups[template.category].subcategories[template.subcategory].push(template);
      } else {
        groups[template.category].items.push(template);
      }
    });
    
    return groups;
  }, [filteredTemplates]);

  // Extract unique categories and subcategories for autocomplete/select
  const existingCategories = useMemo(() => [...new Set(templates.map(t => t.category))], [templates]);
  
  return (
    <div className="max-w-md mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span>📋</span> Pareceres
        </h2>
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-1.5 rounded-lg transition ${isEditing ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`}
              title={isEditing ? "Sair do modo edição" : "Editar pareceres"}
            >
              {isEditing ? '✏️ Ativo' : '✏️'}
            </button>
          )}
          {isEditing && canEdit && (
            <>
              <button
                onClick={() => setIsAdding(true)}
                className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-gray-700"
                title="Adicionar novo parecer"
              >
                ➕
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
                title="Restaurar padrões"
              >
                🔄
              </button>
            </>
          )}
        </div>
      </div>

      {/* Busca */}
      {!isAdding && !editingItem && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar parecer..."
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Formulário de Adição */}
      {isAdding && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-sm mb-2 text-blue-800 dark:text-blue-300">Novo Parecer</h3>
          <div className="space-y-2">
            <div>
               <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Categoria</label>
               <input 
                 list="categories"
                 className="w-full p-1.5 rounded border text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                 value={newItem.category}
                 onChange={e => setNewItem({...newItem, category: e.target.value})}
                 placeholder="Ex: Fluxos de Renda"
               />
               <datalist id="categories">
                 {existingCategories.map(c => <option key={c} value={c} />)}
               </datalist>
            </div>
            <div>
               <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Subcategoria (Opcional)</label>
               <input 
                 className="w-full p-1.5 rounded border text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                 value={newItem.subcategory}
                 onChange={e => setNewItem({...newItem, subcategory: e.target.value})}
                 placeholder="Ex: Renda PF"
               />
            </div>
            <div>
               <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Título</label>
               <input 
                 className="w-full p-1.5 rounded border text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                 value={newItem.title}
                 onChange={e => setNewItem({...newItem, title: e.target.value})}
               />
            </div>
            <div>
               <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Conteúdo</label>
               <textarea 
                 className="w-full p-1.5 rounded border text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white h-20"
                 value={newItem.content}
                 onChange={e => setNewItem({...newItem, content: e.target.value})}
               />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setIsAdding(false)} className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-700">Cancelar</button>
              <button onClick={handleCreate} className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded text-white">Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {Object.keys(groupedDisplay).length > 0 ? (
          Object.entries(groupedDisplay).map(([category, { items, subcategories }]) => (
            <div key={category} className="mb-4">
              <h3 className="font-bold text-gray-800 dark:text-blue-400 mb-2 sticky top-0 bg-white dark:bg-gray-800 py-1 z-10 border-b border-gray-100 dark:border-gray-700">
                {category}
              </h3>
              
              <div className="space-y-2 mb-2">
                {items.map(template => (
                  <ParecerCard 
                    key={template.id} 
                    template={template} 
                    copiedId={copiedId} 
                    onCopy={copyToClipboard}
                    isEditing={isEditing}
                    editingItem={editingItem}
                    setEditingItem={setEditingItem}
                    onSave={handleSaveEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {Object.entries(subcategories).map(([subcatName, subcatItems]) => (
                <div key={subcatName} className="ml-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700 mt-2">
                  <h4 className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {subcatName}
                  </h4>
                  <div className="space-y-2">
                    {subcatItems.map(template => (
                      <ParecerCard 
                        key={template.id} 
                        template={template} 
                        copiedId={copiedId} 
                        onCopy={copyToClipboard}
                        isEditing={isEditing}
                        editingItem={editingItem}
                        setEditingItem={setEditingItem}
                        onSave={handleSaveEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 text-sm mt-4">Nenhum parecer encontrado.</p>
        )}
      </div>
    </div>
  );
}

function ParecerCard({ template, copiedId, onCopy, isEditing, editingItem, setEditingItem, onSave, onDelete }) {
  const isBeingEdited = editingItem?.id === template.id;

  if (isBeingEdited) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="space-y-2">
          <input 
            className="w-full p-1.5 rounded border text-sm font-bold dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={editingItem.title}
            onChange={e => setEditingItem({...editingItem, title: e.target.value})}
            placeholder="Título"
          />
          <textarea 
            className="w-full p-1.5 rounded border text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white h-24"
            value={editingItem.content}
            onChange={e => setEditingItem({...editingItem, content: e.target.value})}
            placeholder="Conteúdo"
          />
          <div className="flex justify-end gap-2">
             <button onClick={() => setEditingItem(null)} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">Cancelar</button>
             <button onClick={onSave} className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded text-white">Salvar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700/40 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition group relative">
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-bold text-sm text-gray-700 dark:text-gray-200 pr-2">{template.title}</h5>
        
        <div className="flex gap-1">
          {isEditing && (
            <>
              <button 
                onClick={() => setEditingItem(template)}
                className="text-xs p-1 text-blue-500 hover:bg-blue-100 rounded"
                title="Editar"
              >
                ✏️
              </button>
              <button 
                onClick={() => onDelete(template.id)}
                className="text-xs p-1 text-red-500 hover:bg-red-100 rounded"
                title="Excluir"
              >
                🗑️
              </button>
            </>
          )}
          
          <button
            onClick={() => onCopy(template.content, template.id)}
            className={`text-xs px-2 py-1 rounded transition flex items-center gap-1 flex-shrink-0 ${
              copiedId === template.id 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-500 hover:bg-blue-50 dark:hover:bg-gray-500 opacity-0 group-hover:opacity-100 focus:opacity-100'
            }`}
            title="Copiar texto"
          >
            {copiedId === template.id ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed break-words">
        "{template.content}"
      </p>
    </div>
  );
}
