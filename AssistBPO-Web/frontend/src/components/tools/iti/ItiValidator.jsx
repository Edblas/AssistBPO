import React from 'react';

export function ItiValidator({ onBack }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          🔏 Validador de Assinaturas (ITI)
        </h2>
        <button 
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
        >
          Voltar
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Lado Esquerdo: Explicação e Ação */}
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
            <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">
              Serviço Oficial do Governo Federal
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              O Verificador de Conformidade é um serviço gratuito disponibilizado pelo Instituto Nacional de Tecnologia da Informação (ITI).
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
              Ele permite verificar se um arquivo assinado digitalmente com certificado ICP-Brasil está em conformidade com as normas vigentes.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
             <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Como usar:</h3>
             <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-400">
               <li>Clique no botão abaixo para abrir o site oficial.</li>
               <li>Selecione a opção <strong>"Selecionar Arquivo"</strong> ou arraste seu documento PDF/P7S.</li>
               <li>Aguarde o processamento do relatório.</li>
               <li>Verifique se o status é <span className="text-green-600 font-bold">Aprovado</span>.</li>
             </ol>
          </div>

          <a 
            href="https://validar.iti.gov.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            Acessar Validador ITI ↗
          </a>
          
          <p className="text-xs text-center text-gray-400">
            O link abrirá em uma nova guia segura do navegador.
          </p>
        </div>

        {/* Lado Direito: Dicas e Informações Extras */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    💡 O que verificar no relatório?
                </h3>
                <ul className="space-y-4">
                    <li className="flex gap-3">
                        <span className="text-green-500 text-xl">✅</span>
                        <div>
                            <strong className="block text-gray-700 dark:text-gray-300">Validade Jurídica</strong>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Confirma se a assinatura tem validade legal no Brasil (MP 2.200-2/2001).</span>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-blue-500 text-xl">🛡️</span>
                        <div>
                            <strong className="block text-gray-700 dark:text-gray-300">Integridade</strong>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Garante que o documento não foi alterado após a assinatura.</span>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-purple-500 text-xl">📅</span>
                        <div>
                            <strong className="block text-gray-700 dark:text-gray-300">Carimbo do Tempo</strong>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Verifica a data e hora exata da assinatura (se disponível).</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800 flex gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-bold mb-1">Atenção:</p>
                    <p>Assinaturas de plataformas privadas (DocuSign, ClickSign, etc.) sem certificado ICP-Brasil podem aparecer como "Indeterminadas" no ITI, mas ainda podem ter validade jurídica por acordo entre as partes.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
