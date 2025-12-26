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

      <div className="flex flex-col max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap
          ${
            isAssistant
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              : 'bg-blue-600 text-white'
          }`}
          dangerouslySetInnerHTML={{ __html: body }}
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

// Componente Modal LGPD
function LgpdModal({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📋 Termos de Uso & LGPD
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Por favor, leia antes de usar o sistema
          </p>
        </div>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="font-bold text-lg">🔒 Proteção de Dados (LGPD)</h3>
            <p className="mt-1">
              Este sistema <strong>NÃO coleta, armazena ou processa dados pessoais</strong> dos usuários. 
              Todas as consultas são anônimas e temporárias.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg">🎯 Propósito do Sistema</h3>
            <p className="mt-1">
              O <strong>AssistBPO</strong> é uma ferramenta interna para auxiliar colaboradores 
              do BPO (Business Process Outsourcing) com:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Consulta a fluxos e procedimentos operacionais</li>
              <li>Orientações baseadas em manuais internos</li>
              <li>Padronização de respostas para clientes</li>
              <li>Agilização na tomada de decisões</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg">👨‍💻 Desenvolvimento</h3>
            <p className="mt-1">
              Sistema desenvolvido integralmente por <strong>Adílio dos Santos</strong> 
              (Assist BPO - Desenvolvedor Java) utilizando tecnologias modernas 
              (Spring Boot, React, IA) para melhorar a produtividade e qualidade do trabalho.
            </p>
          </section>

          <section className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
            <h3 className="font-bold text-lg">⚠️ Aviso Importante</h3>
            <p className="mt-1">
              Este sistema fornece <strong>orientações com base em documentos internos</strong>, 
              mas a decisão final é de responsabilidade do colaborador. 
              Em caso de dúvidas, consulte sua supervisão.
            </p>
          </section>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onAccept}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            ✅ Concordo e Entendi
          </button>
          <a
            href="https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center"
          >
            📚 Ler LGPD Completa
          </a>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Ao continuar, você confirma que leu e concordou com estes termos.
        </p>
      </div>
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
  
  // ⭐ NOVO ESTADO PARA O MODAL LGPD
  const [showLgpd, setShowLgpd] = useState(() => {
    // Verifica se já aceitou antes (usa localStorage)
    return !localStorage.getItem('lgpdAccepted');
  })

  const endRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    dark ? root.classList.add('dark') : root.classList.remove('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Função para aceitar os termos LGPD
  const acceptLgpd = () => {
    localStorage.setItem('lgpdAccepted', 'true')
    setShowLgpd(false)
  }

  async function send() {
    if (!input.trim()) return

    setMessages(m => [...m, { role: 'user', text: input }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://assistbpo-backend.onrender.com/api/consulta', {
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
      {/* MODAL LGPD - Aparece apenas na primeira visita */}
      {showLgpd && <LgpdModal onAccept={acceptLgpd} />}

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
            // ⭐ ENVIAR COM ENTER (Shift+Enter para nova linha)
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
    </div>
  )
}