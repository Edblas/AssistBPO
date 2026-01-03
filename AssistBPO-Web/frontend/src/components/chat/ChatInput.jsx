import React from 'react'

export function ChatInput({ input, setInput, send, loading }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-40">
      <div className="max-w-3xl mx-auto px-4 flex items-center gap-3">
        <textarea
          className="flex-1 resize-none border rounded-xl p-3 text-sm bg-white dark:bg-gray-900"
          placeholder="Digite sua pergunta..."
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!loading && input.trim()) send()
            }
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          className="h-[52px] px-6 rounded-xl bg-blue-600 text-white"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
