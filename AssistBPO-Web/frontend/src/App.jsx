import React, { useState, useEffect } from 'react'
import { AdminPanel } from './components/admin/AdminPanel'
import { ManagementPanel } from './components/admin/ManagementPanel'
import { ToolsPanel } from './components/tools/ToolsPanel'
import { QuickToolsPanel } from './components/tools/QuickToolsPanel'
import { DailyGoalCounter } from './components/productivity/DailyGoalCounter'
import { LgpdModal } from './components/modal/LgpdModal'
import { Header } from './components/layout/Header'
import { SideMenu } from './components/layout/SideMenu'
import { ChatList } from './components/chat/ChatList'
import { ChatInput } from './components/chat/ChatInput'
import { UserProfile } from './components/profile/UserProfile'
import { TrainingPanel } from './components/training/TrainingPanel'
import { VolumetricsPanel } from './components/productivity/VolumetricsPanel'
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
  const [view, setView] = useState('chat') // 'chat' | 'admin' | 'tools' | 'management' | 'training'
  const [isCounterExpanded, setIsCounterExpanded] = useState(false) // Lifted state
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const { dark, toggleDarkMode } = useDarkMode()

  useEffect(() => {
    const handleTrainingNav = () => setView('training');
    window.addEventListener('navigate-training', handleTrainingNav);
    return () => window.removeEventListener('navigate-training', handleTrainingNav);
  }, []);
  
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

  if (view === 'management') {
    return <ManagementPanel onBack={() => setView('chat')} />
  }

  if (view === 'tools') {
    return <ToolsPanel onBack={() => setView('chat')} />
  }

  if (view === 'training') {
    return <TrainingPanel onBack={() => setView('chat')} />
  }

  if (view === 'volumetrics') {
    return <VolumetricsPanel onBack={() => setView('chat')} />
  }

  const checkPermission = () => {
    const saved = localStorage.getItem('assistbpo_user_profile');
    if (!saved) return false;
    const profile = JSON.parse(saved);
    const allowedRoles = ['Gerente de Operações', 'Coordenador(a)', 'Líder'];
    return allowedRoles.includes(profile.role);
  };

  const hasManagementAccess = checkPermission();

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* MODAL LGPD - Aparece apenas na primeira visita */}
      {showLgpd && <LgpdModal onAccept={acceptLgpd} />}

      {/* HEADER FIXO */}
      <Header toggleDarkMode={toggleDarkMode} dark={dark} onOpenProfile={() => setIsProfileOpen(true)} />

      {/* BLOCO DIREITA (Menu Lateral) */}
      <SideMenu setView={setView} toggleDarkMode={toggleDarkMode} dark={dark} />

      {/* ÁREA COM SCROLL (Lista de Mensagens) */}
      <ChatList messages={messages} />

      {/* INPUT FIXO */}
      <ChatInput input={input} setInput={setInput} send={send} loading={loading} />

      {/* FERRAMENTA DE PRODUTIVIDADE (CONTADOR - ESQUERDA) */}
      <DailyGoalCounter isExpanded={isCounterExpanded} setIsExpanded={setIsCounterExpanded} />

      {/* PAINEL DE FERRAMENTAS RÁPIDAS (DIREITA) */}
      <QuickToolsPanel />

      {/* BOTÃO GERENCIAR FLUXOS (ADMIN) - FIXO NO TOPO ESQUERDO */}
      <div className="fixed left-4 top-20 z-50 flex flex-col gap-2">
        {hasManagementAccess && (
          <>
            <button
              onClick={() => setView('admin')}
              className="p-3 rounded-xl bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold text-sm w-full"
              title="Gerenciar Fluxos"
            >
              ⚙️ Fluxos
            </button>

            <button
              onClick={() => setView('management')}
              className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold text-sm w-full"
              title="Painel Gerencial"
            >
              📊 Painel
            </button>

            <button
              onClick={() => setView('volumetrics')}
              className="p-3 rounded-xl bg-cyan-600 text-white shadow-lg hover:bg-cyan-700 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-bold text-sm w-full"
              title="Painel de Volumetria"
            >
              📈 Volumetria
            </button>
          </>
        )}
      </div>
      {/* MODAL DE PERFIL */}
      {isProfileOpen && <UserProfile onClose={() => setIsProfileOpen(false)} />}
    </div>
  )
}
