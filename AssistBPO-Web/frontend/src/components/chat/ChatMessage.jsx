import React, { useState } from 'react'

export function ChatMessage({ role, text }) {
  const isAssistant = role === 'assistant'
  const [copiedIndex, setCopiedIndex] = useState(null)

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

  // 1. Processar link do vídeo (substituir por botão na posição original)
  let cleanBody = body.replace(/Vídeo Explicativo: (http[^\n]+)/, (match, url) => {
    const videoUrl = url.trim()
    // Retorna o HTML do botão diretamente no texto para manter a posição
    return `<div class="mt-4 mb-2"><strong class="block mb-1">Vídeo Explicativo:</strong><a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors shadow-sm"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>Assistir</a></div>`
  })

  // 2. Extrair Respostas de Devolução (múltiplas)
  const respostas = []
  cleanBody = cleanBody.replace(/Resposta de Devolução:\s*((?:>>>.*(?:\n|$))*)/, (match, content) => {
    if (content) {
      const parts = content.split('>>>').map(s => s.trim()).filter(Boolean)
      respostas.push(...parts)
    }
    return '' // Remove do corpo principal
  })

  // 3. Tratamento de Links de Modelos
  let processedBody = cleanBody.replace(
    /(Modelos (Aceitos|Não Aceitos|Aceitos\/Não Aceitos):[\s\S]*?)(?=$)/g, // Ajustado regex final
    (match) => {
      return match.replace(/- (http[^\s]+)/g, '- <a href="$1" target="_blank" class="text-blue-500 underline">$1</a>')
    }
  )

  // 4. Negrito nas palavras-chave
  const keywords = [
    'Tema',
    'Fluxo',
    'Pode Aceitar',
    'Condição',
    'Ações do Analista',
    'Modelos Aceitos/Não Aceitos'
  ]

  keywords.forEach(keyword => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedKeyword}:)`, 'g')
    processedBody = processedBody.replace(regex, '<strong>$1</strong>')
  })

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className={`flex gap-3 ${isAssistant ? '' : 'justify-end'}`}>
      {isAssistant && (
        <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
          🤖
        </div>
      )}

      <div className="flex flex-col max-w-[85%]">
        <div
          className={`rounded-2xl px-4 py-3 text-base whitespace-pre-wrap
          ${
            isAssistant
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              : 'bg-blue-600 text-white'
          }`}
        >
          {/* Corpo Principal HTML */}
          <div dangerouslySetInnerHTML={{ __html: processedBody }} />

          {/* Respostas de Devolução (Cards) */}
          {respostas.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
              <strong className="block mb-2">Respostas de Devolução:</strong>
              <div className="space-y-3">
                {respostas.map((resp, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm relative group">
                    <p className="text-sm text-gray-800 dark:text-gray-200 pr-8">{resp}</p>
                    <button
                      onClick={() => handleCopy(resp, idx)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Copiar texto"
                    >
                      {copiedIndex === idx ? (
                        <span className="text-green-500 text-xs font-bold">Copiado!</span>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m2 4h6a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* BOTÃO MANUAL DENTRO DO BALÃO (Rodapé) */}
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
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
          🧑
        </div>
      )}
    </div>
  )
}
