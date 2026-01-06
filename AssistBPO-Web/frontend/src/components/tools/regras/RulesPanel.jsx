import React, { useState, useMemo } from 'react';
import regrasData from '../../../data/regrasData';

export function RulesPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');

  const types = useMemo(() => {
    const allTypes = new Set();
    regrasData.forEach(rule => {
      if (rule.type) {
        rule.type.forEach(t => allTypes.add(t));
      }
    });
    return ['Todos', ...Array.from(allTypes).sort()];
  }, []);

  const filteredRules = useMemo(() => {
    return regrasData.filter(rule => {
      const matchesSearch = rule.ref.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'Todos' || (rule.type && rule.type.includes(selectedType));
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Regras IRPF</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input
                    type="text"
                    placeholder="Pesquisar regra (ex: Bolsa de estudo...)"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <select
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                {types.map(t => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {filteredRules.length > 0 ? (
            <div className="space-y-2">
                {filteredRules.map((rule, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{rule.ref}</h3>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded font-bold">
                                Item {rule.item}
                            </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {rule.type && rule.type.map(t => (
                                <span key={t} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-2">🤷‍♂️</p>
                <p>Nenhuma regra encontrada para "{searchTerm}"</p>
            </div>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400">
        Total de registros: {regrasData.length} | Filtrados: {filteredRules.length}
      </div>
    </div>
  );
}
