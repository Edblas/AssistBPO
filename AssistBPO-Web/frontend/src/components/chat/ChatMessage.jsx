import React from 'react'

export function ChatMessage({ role, text }) {
  const isAssistant = role === 'assistant'

  const lines = text.split('\n')
  const fonteIdx = lines.findIndex(l => l.startsWith('Fonte:'))
  const fonte =
    isAssistant && fonteIdx >= 0
      ? lines[fonteIdx].replace('Fonte: ', '').trim()
      : null

  const body =
    fonteIdx >= 0
      ? lines.filter((_, i) => i !== fonteIdx).join('\n')
      : text

  // Tratamento de Links de Modelos no texto (markdown to html links)
  // O backend envia "- http://..."
  // Vamos garantir que links virem <a> clicáveis se estiverem nas seções de modelos
  const processedBody = body.replace(
    /(Modelos (Aceitos|Não Aceitos):[\s\S]*?)(?=(Resposta de Devolução|$))/g,
    (match) => {
      return match.replace(/- (http[^\s]+)/g, '- <a href="$1" target="_blank" class="text-blue-500 underline">$1</a>')
    }
  )

  return (
    <div className={`flex gap-3 ${isAssistant ? '' : 'justify-end'}`}>
      {isAssistant && (
        <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
          🤖
        </div>
      )}

      <div className="flex flex-col max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap
          ${
            isAssistant
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              : 'bg-blue-600 text-white'
          }`}
          dangerouslySetInnerHTML={{ __html: processedBody }}
        />
        
        {/* BOTÃO MANUAL DENTRO DO BALÃO */}
        {isAssistant && fonte && (
          <div className="mt-2 px-4">
            <a 
              href={fonte} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg text-xs font-medium transition-colors border border-blue-200 dark:border-blue-700"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span>Acessar Manual</span>
            </a>
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
          🧑
        </div>
      )}
    </div>
  )
}
