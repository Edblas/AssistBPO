import React, { useEffect, useState, useRef } from 'react'

function ChatMessage({ role, text }) {
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

  return (
    <div className={`flex gap-3 ${isAssistant ? '' : 'justify-end'}`}>
      {isAssistant && (
        <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center">
          🤖
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap
        ${
          isAssistant
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            : 'bg-blue-600 text-white'
        }`}
        dangerouslySetInnerHTML={{ __html: body }}
      />

      {!isAssistant && (
        <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
          🧑
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Olá! Bem-vindo ao AssistBPO.\n\nDigite sua pergunta e eu te ajudo.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  const endRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    dark ? root.classList.add('dark') : root.classList.remove('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim()) return

    setMessages(m => [...m, { role: 'user', text: input }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: input })
      })
      const data = await res.json()

      let resp = data.resposta || 'Sem resposta.'

      resp = resp.replace(
        'Pode Aceitar: true',
        'Pode Aceitar: <span style="color:#16a34a;font-weight:600">Sim</span>'
      )

      resp = resp.replace(
        'Pode Aceitar: false',
        'Pode Aceitar: <span style="color:#dc2626;font-weight:600">Não</span>'
      )

      setMessages(m => [...m, { role: 'assistant', text: resp }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Erro no backend.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* HEADER FIXO */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b z-40">
        <div className="max-w-3xl mx-auto h-full px-4 flex flex-col justify-center">
          <h1 className="text-xl font-bold">AssistBPO Chat</h1>
          <p className="text-xs text-gray-500">Respostas baseadas nos manuais</p>
        </div>
      </header>

      {/* BLOCO DIREITA */}
      <div className="fixed top-20 right-4 w-44 bg-white dark:bg-gray-800 border rounded-md p-3 space-y-2 shadow z-40">
        <button
          onClick={() => setDark(d => !d)}
          className="w-full py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-sm font-semibold"
        >
          {dark ? '🌞 Claro' : '🌙 Escuro'}
        </button>

        <a
          href="https://grupometa-my.sharepoint.com"
          target="_blank"
          rel="noreferrer"
          className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
        >
          Regramento Sicoob
        </a>

        <a
          href="https://validar.iti.gov.br/"
          target="_blank"
          rel="noreferrer"
          className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
        >
          Validador ITI
        </a>

        <a
          href="https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp"
          target="_blank"
          rel="noreferrer"
          className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
        >
          Consultar CNPJ
        </a>

        {/* NOVO LINK */}
        <a
          href="https://wellingtn.github.io/ApoioBPO/"
          target="_blank"
          rel="noreferrer"
          className="block text-sm px-2 py-1 rounded bg-blue-50 dark:bg-gray-700"
        >
          ApoioBPO
        </a>
      </div>

      {/* ÁREA COM SCROLL */}
      <main className="pt-4 pb-24 overflow-y-auto h-full">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} text={m.text} />
          ))}
          <div ref={endRef} />
        </div>
      </main>

      {/* INPUT FIXO */}
      <div className="fixed bottom-4 left-0 right-0 z-40">
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-3">
          <textarea
            className="flex-1 resize-none border rounded-xl p-3 text-sm bg-white dark:bg-gray-900"
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={2}
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
    </div>
  )
}
