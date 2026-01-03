import React from 'react'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b z-40">
      <div className="max-w-3xl mx-auto h-full px-4 flex flex-col justify-center">
        <h1 className="text-xl font-bold">Jarvis</h1>
        <p className="text-xs text-gray-500">AssistBPO Chat-Respostas baseadas nos manuais</p>
      </div>
    </header>
  )
}
