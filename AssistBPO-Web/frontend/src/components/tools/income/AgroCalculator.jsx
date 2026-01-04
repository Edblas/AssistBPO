import React, { useState } from 'react'

export function AgroCalculator() {
  const [notas, setNotas] = useState([{ id: 1, value: '' }])
  const [total, setTotal] = useState(0)

  function addNota() {
    setNotas([...notas, { id: Date.now(), value: '' }])
  }

  function removeNota(id) {
    if (notas.length === 1) return
    const newNotas = notas.filter(n => n.id !== id)
    setNotas(newNotas)
    recalc(newNotas)
  }

  function updateNota(id, val) {
    const newNotas = notas.map(n => {
        if (n.id === id) return { ...n, value: val }
        return n
    })
    setNotas(newNotas)
    recalc(newNotas)
  }

  function recalc(list) {
    const sum = list.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0)
    setTotal(sum)
  }

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Calculadora Renda Agro</h2>

        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-500">Notas Fiscais</label>
                    <button onClick={addNota} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                        + Adicionar NF
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {notas.map((nota, index) => (
                        <div key={nota.id} className="flex gap-2 items-center">
                            <span className="text-sm text-gray-400 w-6 font-mono">{index + 1}</span>
                            <input
                                type="number"
                                className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-green-500 outline-none"
                                placeholder="Valor da NF"
                                value={nota.value}
                                onChange={(e) => updateNota(nota.id, e.target.value)}
                            />
                            <button 
                                onClick={() => removeNota(nota.id)}
                                className="text-gray-400 hover:text-red-500 p-2"
                                disabled={notas.length === 1}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:w-64">
                <div className="bg-green-50 dark:bg-gray-700/50 p-6 rounded-xl sticky top-0">
                    <h3 className="font-bold text-lg mb-4 text-green-800 dark:text-green-300">Totalização</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Quantidade de NFs</p>
                            <p className="text-xl font-mono font-semibold">{notas.length}</p>
                        </div>
                        
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Valor Total Bruto</p>
                            <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">{formatCurrency(total)}</p>
                        </div>

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-400">
                            * O cálculo considera apenas a soma simples dos valores brutos informados.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
