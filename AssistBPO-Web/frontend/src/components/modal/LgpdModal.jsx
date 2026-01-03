import React from 'react'

export function LgpdModal({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📋 Termos de Uso & LGPD
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Por favor, leia antes de usar o sistema
          </p>
        </div>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="font-bold text-lg">🔒 Proteção de Dados (LGPD)</h3>
            <p className="mt-1">
              Este sistema <strong>NÃO coleta, armazena ou processa dados pessoais</strong> dos usuários. 
              Todas as consultas são anônimas e temporárias.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg">🎯 Propósito do Sistema</h3>
            <p className="mt-1">
              O <strong>AssistBPO</strong> é uma ferramenta interna para auxiliar colaboradores 
              do BPO (Business Process Outsourcing) com:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Consulta a fluxos e procedimentos operacionais</li>
              <li>Orientações baseadas em manuais internos</li>
              <li>Padronização de respostas para clientes</li>
              <li>Agilização na tomada de decisões</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg">👨‍💻 Desenvolvimento</h3>
            <p className="mt-1">
              Sistema desenvolvido integralmente por <strong>Adílio dos Santos</strong> 
              (Assist BPO - Desenvolvedor Java) utilizando tecnologias modernas 
              (Spring Boot, React, IA) para melhorar a produtividade e qualidade do trabalho.
            </p>
          </section>

          <section className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="font-bold text-lg">⚠️ Aviso Importante</h3>
            <p className="mt-1">
              Este sistema fornece <strong>orientações com base em documentos internos</strong>, 
              mas a decisão final é de responsabilidade do colaborador. 
              Em caso de dúvidas, consulte sua supervisão.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onAccept}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            ✅ Concordo e Entendi
          </button>
          <a
            href="https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center"
          >
            📚 Ler LGPD Completa
          </a>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Ao continuar, você confirma que leu e concordou com estes termos.
        </p>
      </div>
    </div>
  )
}
