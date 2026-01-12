import React, { useState } from 'react';
import { PFCalculator } from './income/PFCalculator';
import { PJCalculator } from './income/PJCalculator';
import { AgroCalculator } from './income/AgroCalculator';
import { CnpjFinder } from './cnpj/CnpjFinder';
import { OpinionTemplates } from './pareceres/OpinionTemplates';
import { RulesPanel } from './regras/RulesPanel';

export function QuickToolsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState(null);

  const tools = [
    {
      id: 'pf',
      title: 'Renda PF',
      icon: '👤',
      color: 'bg-blue-100 text-blue-700',
      component: PFCalculator
    },
    {
      id: 'pj',
      title: 'Renda PJ',
      icon: '🏢',
      color: 'bg-purple-100 text-purple-700',
      component: PJCalculator
    },
    {
      id: 'agro',
      title: 'Renda Agro',
      icon: '🚜',
      color: 'bg-green-100 text-green-700',
      component: AgroCalculator
    },
    {
      id: 'regras',
      title: 'Regras IRPF',
      icon: '📜',
      color: 'bg-yellow-100 text-yellow-700',
      component: RulesPanel
    },
    {
      id: 'cnpj',
      title: 'Consulta CNPJ',
      icon: '🔍',
      color: 'bg-orange-100 text-orange-700',
      component: CnpjFinder
    },
    {
      id: 'pareceres',
      title: 'Pareceres',
      icon: '📋',
      color: 'bg-teal-100 text-teal-700',
      component: OpinionTemplates
    },
    {
      id: 'iti',
      title: 'Validador ITI',
      icon: '🔏',
      color: 'bg-indigo-100 text-indigo-700',
      action: () => window.open('https://validar.iti.gov.br/', '_blank')
    }
  ];

  const handleToolClick = (tool) => {
    if (tool.action) {
      tool.action();
      setIsOpen(false);
    } else {
      setActiveTool(tool.id);
      setIsOpen(false); // Fecha o menu, abre a ferramenta
    }
  };

  const closeTool = () => {
    setActiveTool(null);
    setIsOpen(true); // Reabre o menu ao fechar a ferramenta
  };

  const ActiveComponent = activeTool ? tools.find(t => t.id === activeTool)?.component : null;

  return (
    <>
      {/* Botão Principal (Toggle) */}
      {!activeTool && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isOpen ? 'bg-red-500 text-white rotate-45' : 'bg-blue-600 text-white'
          }`}
          title="Ferramentas Rápidas"
        >
          <span className="text-2xl font-bold">+</span>
        </button>
      )}

      {/* Menu de Ferramentas */}
      {isOpen && !activeTool && (
        <div className="fixed bottom-40 right-4 z-40 flex flex-col gap-3 animate-fade-in-up">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition w-48 group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tool.color}`}>
                {tool.icon}
              </div>
              <span className="font-medium text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600">
                {tool.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Janela da Ferramenta Ativa */}
      {activeTool && ActiveComponent && (
        <div className={`fixed bottom-4 right-4 z-50 w-[450px] max-h-[80vh] bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden animate-slide-in-right transition-all duration-300`}>
          
          {/* Header da Ferramenta */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <span className="text-xl">{tools.find(t => t.id === activeTool)?.icon}</span>
              <h3 className="font-bold text-gray-700 dark:text-gray-200">
                {tools.find(t => t.id === activeTool)?.title}
              </h3>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={closeTool}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition text-gray-500"
                    title="Voltar ao menu"
                >
                    ↩️
                </button>
                <button 
                    onClick={() => { setActiveTool(null); setIsOpen(false); }}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition text-gray-500 hover:text-red-500"
                    title="Fechar"
                >
                    ✕
                </button>
            </div>
          </div>

          {/* Corpo da Ferramenta (Scrollável) */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ActiveComponent onBack={closeTool} isWidget={true} />
          </div>
        </div>
      )}
    </>
  );
}
