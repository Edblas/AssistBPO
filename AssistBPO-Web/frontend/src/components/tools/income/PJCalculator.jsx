import React, { useState } from 'react'

export function PJCalculator() {
  const [tab, setTab] = useState('dates') // 'dates' | 'faturamento'

  // State Datas
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [diff, setDiff] = useState(null)

  // State Faturamento
  const [months, setMonths] = useState(Array(12).fill(''))
  const [rbt12, setRbt12] = useState(0)

  function calculateDateDiff() {
    if (!startDate || !endDate) return
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = (diffDays / 30.44).toFixed(1)
    const diffYears = (diffDays / 365.25).toFixed(1)
    setDiff({ days: diffDays, months: diffMonths, years: diffYears })
  }

  function updateMonth(index, val) {
    const newMonths = [...months]
    newMonths[index] = val
    setMonths(newMonths)
    
    // Auto calc
    const total = newMonths.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)
    setRbt12(total)
  }

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Calculadora de Renda PJ</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button 
                onClick={() => setTab('dates')}
                className={`pb-2 px-4 font-medium transition ${tab === 'dates' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                📅 Calculadora de Datas
            </button>
            <button 
                onClick={() => setTab('faturamento')}
                className={`pb-2 px-4 font-medium transition ${tab === 'faturamento' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                💰 RBT12 (Simples Nacional)
            </button>
        </div>

        {tab === 'dates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Data Inicial</label>
                        <input 
                            type="date" 
                            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Data Final</label>
                        <input 
                            type="date" 
                            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={calculateDateDiff}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                        Calcular Diferença
                    </button>
                </div>

                {diff && (
                    <div className="bg-purple-50 dark:bg-gray-700/50 p-6 rounded-xl flex flex-col justify-center items-center text-center">
                        <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 mb-4">Resultado</h3>
                        <div className="space-y-2">
                            <p className="text-3xl font-bold">{diff.days} <span className="text-sm font-normal text-gray-500">dias</span></p>
                            <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">~ {diff.months} <span className="text-sm font-normal">meses</span></p>
                            <p className="text-lg text-gray-500">~ {diff.years} <span className="text-sm font-normal">anos</span></p>
                        </div>
                    </div>
                )}
            </div>
        )}

        {tab === 'faturamento' && (
            <div className="space-y-6">
                <p className="text-sm text-gray-500">Informe o faturamento dos últimos 12 meses para obter o RBT12.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {months.map((val, idx) => (
                        <div key={idx}>
                            <label className="block text-xs font-medium mb-1 text-gray-400">Mês {idx + 1}</label>
                            <input 
                                type="number"
                                className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 outline-none focus:border-purple-500"
                                placeholder="0.00"
                                value={val}
                                onChange={e => updateMonth(idx, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="bg-purple-50 dark:bg-gray-700/50 p-6 rounded-xl flex justify-between items-center mt-6">
                    <div>
                        <h3 className="font-bold text-purple-800 dark:text-purple-300">RBT12 (Receita Bruta Total)</h3>
                        <p className="text-sm text-gray-500">Soma dos últimos 12 meses</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(rbt12)}</p>
                </div>
            </div>
        )}
    </div>
  )
}
