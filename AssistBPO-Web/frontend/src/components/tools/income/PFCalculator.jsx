import React, { useState, useEffect } from 'react'

export function PFCalculator() {
  const [items, setItems] = useState([{ id: 1, value: '' }])
  const [consider13, setConsider13] = useState(false)
  const [considerFerias, setConsiderFerias] = useState(false)
  const [result, setResult] = useState({ total: 0, average: 0, annual: 0 })

  useEffect(() => {
    calculate()
  }, [items, consider13, considerFerias])

  function addItem() {
    setItems([...items, { id: Date.now(), value: '' }])
  }

  function removeItem(id) {
    if (items.length === 1) return
    setItems(items.filter(i => i.id !== id))
  }

  function updateItem(id, val) {
    const newItems = items.map(i => {
        if (i.id === id) return { ...i, value: val }
        return i
    })
    setItems(newItems)
  }

  function calculate() {
    const values = items.map(i => parseFloat(i.value) || 0)
    const total = values.reduce((acc, curr) => acc + curr, 0)
    const count = values.filter(v => v > 0).length || 1 // Evita divisão por zero
    
    // Lógica básica: Média simples dos valores informados
    let average = total / items.length // Média considera todos os campos (mesmo vazios? Geralmente sim se for holerite faltante, mas vamos considerar preenchidos)
    
    // Ajuste: Média deve ser sobre os itens informados ou sobre o total de campos? 
    // Geralmente em BPO, soma-se os 3 últimos e divide por 3.
    // Aqui vou dividir pelo número de inputs visíveis para dar flexibilidade ao analista
    average = total / items.length

    let annual = average * 12
    if (consider13) annual += average
    if (considerFerias) annual += (average / 3)

    setResult({
        total,
        average,
        annual
    })
  }

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Calculadora de Renda PF</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-500">Holerites / Proventos</label>
                    <button onClick={addItem} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">
                        + Adicionar Mês
                    </button>
                </div>
                
                {items.map((item, index) => (
                    <div key={item.id} className="flex gap-2 items-center">
                        <span className="text-sm text-gray-400 w-6 font-mono">{index + 1}º</span>
                        <input
                            type="number"
                            step="0.01"
                            className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0,00"
                            value={item.value}
                            onChange={(e) => updateItem(item.id, e.target.value)}
                        />
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 p-2"
                            disabled={items.length === 1}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Resultados */}
            <div className="bg-blue-50 dark:bg-gray-700/50 p-6 rounded-xl h-fit">
                <h3 className="font-bold text-lg mb-4 text-blue-800 dark:text-blue-300">Resultados</h3>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Soma Total</p>
                        <p className="text-xl font-mono font-semibold">{formatCurrency(result.total)}</p>
                    </div>
                    
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Média Mensal ({items.length} meses)</p>
                        <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{formatCurrency(result.average)}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={consider13} onChange={e => setConsider13(e.target.checked)} className="rounded text-blue-600" />
                                Incluir 13º
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={considerFerias} onChange={e => setConsiderFerias(e.target.checked)} className="rounded text-blue-600" />
                                Incluir 1/3 Férias
                            </label>
                        </div>
                        
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Renda Anual Projetada</p>
                            <p className="text-xl font-mono font-semibold text-green-600 dark:text-green-400">{formatCurrency(result.annual)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
