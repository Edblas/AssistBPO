import React, { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { API_BASE_URL } from '../../services/api'
import { ThemeList } from './ThemeList'
import { FlowList } from './FlowList'
import { FlowEditor } from './FlowEditor'

export function AdminPanel({ onBack }) {
  // Dados
  const [tree, setTree] = useState({})
  const [loading, setLoading] = useState(true)
  const [showInactive, setShowInactive] = useState(false) // Mantido caso queira filtrar globalmente no fetch
  
  // Navegação e Estado UI
  const [view, setView] = useState('themes') // 'themes' | 'list' | 'editor'
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [editingDoc, setEditingDoc] = useState(null)
  const [searchFlow, setSearchFlow] = useState('')

  useEffect(() => {
    fetchTree()
  }, [showInactive])

  async function fetchTree() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/docs/tree?includeInactive=true`) // Sempre traz tudo, filtro visual nos componentes
      const data = await res.json()
      setTree(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // --- Ações de Navegação ---

  function handleSelectTheme(tema) {
    setSelectedTheme(tema)
    setView('list')
    setSearchFlow('')
  }

  function handleCreateTheme() {
    setEditingDoc(null)
    setSelectedTheme(null) // Tema vazio para obrigar usuário a digitar novo
    setView('editor')
  }

  function handleCreateFlowInTheme(tema) {
    if (typeof tema === 'string') {
        setSelectedTheme(tema)
    }
    setEditingDoc(null)
    // Mantém selectedTheme
    setView('editor')
  }

  async function handleToggleThemeActive(tema) {
    const flows = tree[tema] || [];
    if (flows.length === 0) return;

    const allActive = flows.every(doc => doc.active);
    const newStatus = !allActive;
    const action = newStatus ? 'ativar' : 'inativar';

    if (!window.confirm(`Deseja realmente ${action} todos os ${flows.length} fluxos do tema "${tema}"?`)) return;

    setLoading(true);
    try {
        await Promise.all(flows.map(doc => {
            if (doc.active !== newStatus) {
                return fetch(`${API_BASE_URL}/api/docs/${doc.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...doc, active: newStatus })
                });
            }
            return Promise.resolve();
        }));
        await fetchTree();
    } catch (e) {
        alert(`Erro ao ${action} tema.`);
        console.error(e);
        setLoading(false);
    }
  }

  function handleEditTheme(tema) {
    // Implementação futura: Renomear tema
    // Por enquanto, apenas avisa ou abre um prompt simples
    const newName = window.prompt("Renomear Tema (Isso atualizará todos os fluxos deste tema):", tema);
    if (newName && newName !== tema) {
       // Seria necessário implementar lógica de update em massa ou endpoint específico
       alert("Funcionalidade de renomear em massa ainda não implementada no backend.");
    }
  }

  function handleBackToThemes() {
    setView('themes')
    setSelectedTheme(null)
  }

  function handleCancelEdit() {
    if (selectedTheme) {
      setView('list')
    } else {
      setView('themes')
    }
    setEditingDoc(null)
  }

  // --- Ações de CRUD (Fluxos) ---

  function handleEditFlow(doc) {
    setEditingDoc(doc)
    setView('editor')
  }

  async function handleSaveFlow(docPayload) {
    const url = docPayload.id 
      ? `http://localhost:8080/api/docs/${docPayload.id}` 
      : 'http://localhost:8080/api/docs'
    
    const method = docPayload.id ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(docPayload)
    })

    if (!res.ok) throw new Error('Erro ao salvar')
    
    await fetchTree()
    
    // Redirecionamento inteligente
    if (selectedTheme) {
        setView('list')
    } else {
        // Se criou um tema novo, vai para a lista desse tema novo
        setSelectedTheme(docPayload.tema)
        setView('list')
    }
  }

  async function handleToggleActive(doc) {
    const newStatus = !doc.active
    const action = newStatus ? 'ativar' : 'inativar'
    if (!window.confirm(`Deseja realmente ${action} o fluxo "${doc.fluxo}"?`)) return

    try {
      const res = await fetch(`http://localhost:8080/api/docs/${doc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...doc, active: newStatus })
      })
      if (res.ok) {
        fetchTree()
      } else {
        alert(`Erro ao ${action}.`)
      }
    } catch (e) {
      alert('Erro de conexão.')
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('ATENÇÃO: Exclusão Definitiva!\n\nTem certeza que deseja apagar permanentemente este fluxo?')) return

    try {
      const res = await fetch(`http://localhost:8080/api/docs/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('Fluxo excluído permanentemente.')
        fetchTree()
      } else {
        alert('Erro ao excluir.')
      }
    } catch (e) {
      alert('Erro de conexão.')
    }
  }

  function handleReorder(event, tema) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      const oldIndex = tree[tema].findIndex(item => item.id === active.id);
      const newIndex = tree[tema].findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(tree[tema], oldIndex, newIndex);
      
      // Atualizar estado local imediatamente para feedback visual
      setTree({
        ...tree,
        [tema]: newItems
      });

      // Persistir ordem
      const orderMap = {};
      newItems.forEach((doc, index) => {
        orderMap[doc.id] = index;
      });

      fetch('http://localhost:8080/api/docs/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderMap)
      }).catch(console.error);
    }
  }

  // --- Renderização ---

  if (loading && !tree) return <div className="p-10 text-center">Carregando painel...</div>

  const allThemes = Object.keys(tree).sort()

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 overflow-y-auto">
        
        {/* Header Global (Botão Voltar ao Chat) */}
        {view === 'themes' && (
             <div className="flex justify-end mb-4">
                <button 
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
                >
                    Voltar ao Chat
                </button>
            </div>
        )}

        {view === 'themes' && (
            <ThemeList 
                tree={tree} 
                onSelectTheme={handleSelectTheme} 
                onCreateTheme={handleCreateTheme}
                onEditTheme={handleEditTheme}
                onToggleThemeActive={handleToggleThemeActive}
                onCreateFlowInTheme={handleCreateFlowInTheme}
            />
        )}

        {view === 'list' && selectedTheme && (
            <FlowList 
                themeName={selectedTheme}
                docs={tree[selectedTheme] || []}
                onEdit={handleEditFlow}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
                onReorder={handleReorder}
                onBack={handleBackToThemes}
                onCreateNew={handleCreateFlowInTheme}
                search={searchFlow}
                setSearch={setSearchFlow}
            />
        )}

        {view === 'editor' && (
            <FlowEditor 
                initialData={editingDoc || (selectedTheme ? { tema: selectedTheme } : null)}
                onSave={handleSaveFlow}
                onCancel={handleCancelEdit}
                temas={allThemes}
            />
        )}

    </div>
  )
}
