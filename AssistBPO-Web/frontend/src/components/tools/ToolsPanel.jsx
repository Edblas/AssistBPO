import React, { useState } from 'react'
import { PFCalculator } from './income/PFCalculator'
import { PJCalculator } from './income/PJCalculator'
import { AgroCalculator } from './income/AgroCalculator'
import { CnpjFinder } from './cnpj/CnpjFinder'
import { ItiValidator } from './iti/ItiValidator'

export function ToolsPanel({ onBack }) {
  const [activeTool, setActiveTool] = useState(null)

  const tools = [
    {
      id: 'pf',
      title: 'Renda PF',
      description: 'Calculadora de média de holerites e anualização.',
      icon: '👤',
      color: 'bg-blue-100 text-blue-700',
      component: PFCalculator
    },
    {
      id: 'pj',
      title: 'Renda PJ',
      description: 'Cálculo de Simples Nacional, RPA e Datas.',
      icon: '🏢',
      color: 'bg-purple-100 text-purple-700',
      component: PJCalculator
    },
    {
      id: 'agro',
      title: 'Renda Agro',
      description: 'Soma de notas fiscais e semoventes.',
      icon: '🚜',
      color: 'bg-green-100 text-green-700',
      component: AgroCalculator
    },
    {
      id: 'cnpj',
      title: 'Consulta CNPJ',
      description: 'Dados cadastrais, QSA e Situação via Receita Federal.',
      icon: '🔍',
      color: 'bg-orange-100 text-orange-700',
      component: CnpjFinder
    },
    {
      id: 'iti',
      title: 'Validador ITI',
      description: 'Verificação de conformidade de assinaturas digitais.',
      icon: '🔏',
      color: 'bg-indigo-100 text-indigo-700',
      component: ItiValidator
    }
  ]

  const ActiveComponent = activeTool ? tools.find(t => t.id === activeTool)?.component : null

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 overflow-y-auto min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
            {activeTool ? (
                <>
                    <span className="text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setActiveTool(null)}>Ferramentas</span>
                    <span className="text-gray-400">/</span>
                    <span>{tools.find(t => t.id === activeTool)?.title}</span>
                </>
            ) : (
                '🧮 Ferramentas e Calculadoras'
            )}
        </h1>
        <button 
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
        >
            Voltar ao Chat
        </button>
      </div>

      {/* Grid de Ferramentas */}
      {!activeTool && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
                <div 
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition cursor-pointer group"
                >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 ${tool.color}`}>
                        {tool.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition">{tool.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{tool.description}</p>
                </div>
            ))}
        </div>
      )}

      {/* Ferramenta Ativa */}
      {activeTool && ActiveComponent && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex-1">
            <ActiveComponent onBack={() => setActiveTool(null)} />
        </div>
      )}

    </div>
  )
}
