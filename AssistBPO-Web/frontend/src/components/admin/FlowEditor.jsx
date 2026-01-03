import React, { useState, useEffect } from 'react'

export function FlowEditor({ initialData, onSave, onCancel, temas }) {
  const [doc, setDoc] = useState({
    id: null,
    tema: '',
    fluxo: '',
    tipoRenda: '',
    podeAceitar: false,
    active: true,
    respostaDevolucao: '',
    manualLinkFluxo: '',
    modelosAceitosText: '',
    modelosNaoAceitosText: '',
    acaoAnalistaText: ''
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (initialData) {
      setDoc({
        ...initialData,
        modelosAceitosText: (initialData.modelosAceitos || []).join('\n'),
        modelosNaoAceitosText: (initialData.modelosNaoAceitos || []).join('\n'),
        acaoAnalistaText: (initialData.acaoAnalista || []).join('\n')
      })
    }
  }, [initialData])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    // Converter textos em arrays
    const payload = {
      ...doc,
      modelosAceitos: doc.modelosAceitosText.split('\n').map(s => s.trim()).filter(Boolean),
      modelosNaoAceitos: doc.modelosNaoAceitosText.split('\n').map(s => s.trim()).filter(Boolean),
      acaoAnalista: doc.acaoAnalistaText.split('\n').map(s => s.trim()).filter(Boolean)
    }

    try {
      await onSave(payload)
      setMsg('Salvo com sucesso!')
    } catch (error) {
      setMsg('Erro ao salvar.')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{doc.id ? 'Editar Fluxo' : 'Novo Fluxo'}</h2>
        <button 
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          ✕ Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">Tema</label>
          <input 
            list="temas-list"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
            value={doc.tema}
            onChange={e => setDoc({...doc, tema: e.target.value})}
            required
            placeholder="Ex: Renda PJ"
          />
          <datalist id="temas-list">
            {temas.map(t => <option key={t} value={t} />)}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome do Fluxo</label>
          <input 
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
            value={doc.fluxo}
            onChange={e => setDoc({...doc, fluxo: e.target.value})}
            required
            placeholder="Ex: Declaração de Faturamento"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Renda (Opcional)</label>
          <input 
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
            value={doc.tipoRenda}
            onChange={e => setDoc({...doc, tipoRenda: e.target.value})}
          />
        </div>

        <div className="flex items-center mt-6 gap-6">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="podeAceitar"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={doc.podeAceitar}
              onChange={e => setDoc({...doc, podeAceitar: e.target.checked})}
            />
            <label htmlFor="podeAceitar" className="ml-2 text-sm font-medium cursor-pointer">Pode Aceitar?</label>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="active"
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
              checked={doc.active}
              onChange={e => setDoc({...doc, active: e.target.checked})}
            />
            <label htmlFor="active" className="ml-2 text-sm font-medium cursor-pointer">Ativo?</label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Ações do Analista (uma ação por linha)</label>
          <textarea 
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
            rows="4"
            value={doc.acaoAnalistaText}
            onChange={e => setDoc({...doc, acaoAnalistaText: e.target.value})}
            placeholder="- Verificar assinatura&#10;- Confirmar CNPJ"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Resposta de Devolução</label>
          <textarea 
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
            rows="2"
            value={doc.respostaDevolucao}
            onChange={e => setDoc({...doc, respostaDevolucao: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Link do Manual (Fonte)</label>
          <input 
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
            value={doc.manualLinkFluxo}
            onChange={e => setDoc({...doc, manualLinkFluxo: e.target.value})}
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Modelos Aceitos (um link por linha)</label>
          <textarea 
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
            placeholder="http://exemplo.com/doc1.pdf&#10;http://exemplo.com/doc2.pdf"
            value={doc.modelosAceitosText}
            onChange={e => setDoc({...doc, modelosAceitosText: e.target.value})}
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">Modelos Não Aceitos (um link por linha)</label>
          <textarea 
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            rows="3"
            placeholder="http://exemplo.com/recusado.pdf"
            value={doc.modelosNaoAceitosText}
            onChange={e => setDoc({...doc, modelosNaoAceitosText: e.target.value})}
          />
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
           <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm"
          >
            {saving ? 'Salvando...' : (doc.id ? 'Salvar Alterações' : 'Cadastrar Fluxo')}
          </button>
        </div>
        {msg && <div className="md:col-span-2 text-center text-sm font-medium text-green-600 dark:text-green-400 mt-2">{msg}</div>}
      </form>
    </div>
  )
}
