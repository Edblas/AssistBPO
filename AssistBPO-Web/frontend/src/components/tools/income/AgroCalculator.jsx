import React, { useState } from 'react'

export function AgroCalculator() {
  const [tab, setTab] = useState('nfs') // 'nfs' | 'semoventes' | 'produtor' | 'fcpr'

  // State NFs
  const [notas, setNotas] = useState([{ id: 1, value: '' }])
  const [totalNFs, setTotalNFs] = useState(0)

  // State Semoventes
  const [valorCompra, setValorCompra] = useState('')
  const [valorVenda, setValorVenda] = useState('')
  const [deducaoSemoventes, setDeducaoSemoventes] = useState('')
  const [resultadoSemoventes, setResultadoSemoventes] = useState(0)

  // State Produtor
  const [valorTotalProdutor, setValorTotalProdutor] = useState('')
  const [participacaoProdutor, setParticipacaoProdutor] = useState('')
  const [deducaoProdutor, setDeducaoProdutor] = useState('')
  const [resultadoProdutor, setResultadoProdutor] = useState(0)

  // State FCPR
  const [valorTotalFCPR, setValorTotalFCPR] = useState('')
  const [deducaoFCPR, setDeducaoFCPR] = useState('')
  const [resultadoFCPR, setResultadoFCPR] = useState(0)

  function addNota() {
    setNotas([...notas, { id: Date.now(), value: '' }])
  }

  function removeNota(id) {
    if (notas.length === 1) return
    const newNotas = notas.filter(n => n.id !== id)
    setNotas(newNotas)
    recalcNFs(newNotas)
  }

  function updateNota(id, val) {
    const newNotas = notas.map(n => {
        if (n.id === id) return { ...n, value: val }
        return n
    })
    setNotas(newNotas)
    recalcNFs(newNotas)
  }

  function recalcNFs(list) {
    const sum = list.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0)
    setTotalNFs(sum)
  }

  // Calc Semoventes
  function calcSemoventes() {
      const c = parseFloat(valorCompra) || 0
      const v = parseFloat(valorVenda) || 0
      const d = parseFloat(deducaoSemoventes) || 0
      // (Venda - Compra) * ((100 - Dedução) / 100) ???
      // ApoioBPO logic: (Venda - Compra) - Dedução (if percent logic applied elsewhere?)
      // Assuming straightforward deduction or percentage. 
      // Let's implement generic logic: Profit = Venda - Compra. Taxable = Profit * (1 - Dedução%).
      // Actually, looking at common rules: 
      // If deducaoSemoventes is a value:
      setResultadoSemoventes((v - c) - d)
  }

  // Calc Produtor
  function calcProdutor() {
      const v = parseFloat(valorTotalProdutor) || 0
      const p = parseFloat(participacaoProdutor) || 100
      const d = parseFloat(deducaoProdutor) || 0
      
      const partValue = v * (p / 100)
      setResultadoProdutor(partValue - d)
  }

  // Calc FCPR
  function calcFCPR() {
      const v = parseFloat(valorTotalFCPR) || 0
      const d = parseFloat(deducaoFCPR) || 0
      setResultadoFCPR(v - d)
  }

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2">Calculadora Renda Agro</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button 
                onClick={() => setTab('nfs')}
                className={`pb-2 px-4 font-medium transition whitespace-nowrap ${tab === 'nfs' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                🧾 Notas Fiscais
            </button>
            <button 
                onClick={() => setTab('semoventes')}
                className={`pb-2 px-4 font-medium transition whitespace-nowrap ${tab === 'semoventes' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                🐄 Semoventes
            </button>
            <button 
                onClick={() => setTab('produtor')}
                className={`pb-2 px-4 font-medium transition whitespace-nowrap ${tab === 'produtor' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                👨‍🌾 Produtor
            </button>
            <button 
                onClick={() => setTab('fcpr')}
                className={`pb-2 px-4 font-medium transition whitespace-nowrap ${tab === 'fcpr' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                📉 FCPR
            </button>
        </div>

        {tab === 'nfs' && (
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-500">Lançamento de Notas</label>
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
                                <p className="text-2xl font-mono font-bold text-green-600 dark:text-green-400">{formatCurrency(totalNFs)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {tab === 'semoventes' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Valor de Compra</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={valorCompra} onChange={e => setValorCompra(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Valor de Venda</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={valorVenda} onChange={e => setValorVenda(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Dedução (R$)</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={deducaoSemoventes} onChange={e => setDeducaoSemoventes(e.target.value)} />
                    </div>
                </div>
                <button onClick={calcSemoventes} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto">Calcular Resultado</button>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Resultado da Operação</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(resultadoSemoventes)}</p>
                </div>
            </div>
        )}

        {tab === 'produtor' && (
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Valor Total</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={valorTotalProdutor} onChange={e => setValorTotalProdutor(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Participação (%)</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={participacaoProdutor} onChange={e => setParticipacaoProdutor(e.target.value)} placeholder="100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Dedução (R$)</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={deducaoProdutor} onChange={e => setDeducaoProdutor(e.target.value)} />
                    </div>
                </div>
                <button onClick={calcProdutor} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto">Calcular Parcela</button>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Rendimento Tributável (Sua Parte)</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(resultadoProdutor)}</p>
                </div>
            </div>
        )}

        {tab === 'fcpr' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Valor Bruto</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={valorTotalFCPR} onChange={e => setValorTotalFCPR(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Dedução FCPR (R$)</label>
                        <input type="number" className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900" value={deducaoFCPR} onChange={e => setDeducaoFCPR(e.target.value)} />
                    </div>
                </div>
                <button onClick={calcFCPR} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition w-full md:w-auto">Calcular Líquido</button>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Valor Líquido</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(resultadoFCPR)}</p>
                </div>
            </div>
        )}

    </div>
  )
}
