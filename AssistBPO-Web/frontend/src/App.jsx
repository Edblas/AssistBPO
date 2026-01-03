import React, { useState } from 'react'
import { AdminPanel } from './components/admin/AdminPanel'
import { LgpdModal } from './components/modal/LgpdModal'
import { Header } from './components/layout/Header'
import { SideMenu } from './components/layout/SideMenu'
import { ChatList } from './components/chat/ChatList'
import { ChatInput } from './components/chat/ChatInput'
import { useDarkMode } from './hooks/useDarkMode'
import { api } from './services/api'

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Olá! Seja Bem-vindo!\n\nDigite sua pergunta e eu te ajudo.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState('chat') // 'chat' | 'admin'
  
  const { dark, toggleDarkMode } = useDarkMode()
  
  const [showLgpd, setShowLgpd] = useState(() => {
    return !localStorage.getItem('lgpdAccepted');
  })

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
      const resp = await api.consultar(input)
      setMessages(m => [...m, { role: 'assistant', text: resp }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Erro no backend.' }])
    } finally {
      setLoading(false)
    }
  }

  if (view === 'admin') {
    return <AdminPanel onBack={() => setView('chat')} />
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* MODAL LGPD - Aparece apenas na primeira visita */}
      {showLgpd && <LgpdModal onAccept={acceptLgpd} />}

      {/* HEADER FIXO */}
      <Header />

      {/* BLOCO DIREITA (Menu Lateral) */}
      <SideMenu setView={setView} toggleDarkMode={toggleDarkMode} dark={dark} />

      {/* ÁREA COM SCROLL (Lista de Mensagens) */}
      <ChatList messages={messages} />

      {/* INPUT FIXO */}
      <ChatInput input={input} setInput={setInput} send={send} loading={loading} />
    </div>
  )
}
