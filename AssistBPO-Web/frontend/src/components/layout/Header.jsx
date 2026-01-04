import React from 'react'

export function Header({ toggleDarkMode, dark, onOpenProfile }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b z-40">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <button 
          onClick={onOpenProfile}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 transition"
        >
          Perfil
        </button>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('navigate-training'))}
          className="px-4 py-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg text-sm font-semibold text-blue-700 dark:text-blue-200 transition"
        >
          🎓 Treinamento
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition"
          title={dark ? "Mudar para Claro" : "Mudar para Escuro"}
        >
          {dark ? '🌞' : '🌙'}
        </button>
      </div>
      <div className="max-w-3xl mx-auto h-full px-4 flex flex-col justify-center">
        <h1 className="text-xl font-bold">Jarvis</h1>
        <p className="text-xs text-gray-500">AssistBPO Chat-Respostas baseadas nos manuais</p>
      </div>
    </header>
  )
}
