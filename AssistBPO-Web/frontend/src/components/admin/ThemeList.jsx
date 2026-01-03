import React from 'react'

export function ThemeList({ tree, onSelectTheme, onCreateTheme, onEditTheme, onToggleThemeActive }) {
  const temas = Object.keys(tree).sort();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Gerenciar Fluxos por Tema</h1>
        <button 
            onClick={onCreateTheme}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md font-medium transition flex items-center gap-2"
        >
            ✨ Criar Novo Tema
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {temas.map(tema => {
            const fluxos = tree[tema];
            const activeCount = fluxos.filter(d => d.active).length;
            const inactiveCount = fluxos.length - activeCount;
            const isAllInactive = activeCount === 0 && fluxos.length > 0;

            return (
                <div key={tema} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group ${isAllInactive ? 'opacity-80 grayscale-[0.3]' : ''}`}>
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 line-clamp-2" title={tema}>
                                {tema}
                            </h3>
                            {isAllInactive && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                                    Inativo
                                </span>
                            )}
                        </div>
                        
                        <div className="mt-auto space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <span>Fluxos Totais</span>
                                <span className="font-bold text-gray-900 dark:text-white">{fluxos.length}</span>
                            </div>
                            <div className="flex gap-2 text-xs">
                                <span className="flex-1 text-center bg-green-50 text-green-700 py-1 rounded border border-green-100">
                                    {activeCount} Ativos
                                </span>
                                <span className="flex-1 text-center bg-gray-100 text-gray-600 py-1 rounded border border-gray-200">
                                    {inactiveCount} Inativos
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                            onClick={() => onSelectTheme(tema)}
                            className="flex-1 text-blue-600 font-medium hover:underline text-sm"
                        >
                            Ver Fluxos
                        </button>
                        <div className="w-px h-4 bg-gray-300 mx-3"></div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => onCreateFlowInTheme(tema)}
                                className="text-gray-500 hover:text-green-600 p-1"
                                title="Adicionar Fluxo neste Tema"
                            >
                                ➕
                            </button>
                            <button 
                                onClick={() => onEditTheme(tema)}
                                className="text-gray-500 hover:text-blue-600 p-1"
                                title="Renomear Tema"
                            >
                                ✏️
                            </button>
                            <button 
                                onClick={() => onToggleThemeActive(tema)}
                                className="text-gray-500 hover:text-yellow-600 p-1"
                                title="Ativar/Inativar Todos"
                            >
                                {isAllInactive ? '▶️' : '⏸️'}
                            </button>
                        </div>
                    </div>
                </div>
            )
        })}
        
        {/* Card de Adicionar Rápido (Opcional) */}
        <button 
            onClick={onCreateTheme}
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition group"
        >
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                <span className="text-2xl">+</span>
            </div>
            <span className="font-medium">Novo Tema</span>
        </button>
      </div>
    </div>
  )
}
