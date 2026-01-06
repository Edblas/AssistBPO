import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../services/api';

const API_BASE = `${API_BASE_URL}/api/management/metrics`;

export function ManagementPanel({ onBack }) {
  const [period, setPeriod] = useState('Mês');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [chatStats, setChatStats] = useState({ daily: 0, weekly: 0, annual: 0 });
  const [popularFlows, setPopularFlows] = useState([]);
  const [neverAccessedFlows, setNeverAccessedFlows] = useState([]);
  const [outdatedFlows, setOutdatedFlows] = useState([]);
  const [topThemes, setTopThemes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Get user role from local storage
      const savedProfile = localStorage.getItem('assistbpo_user_profile');
      const userRole = savedProfile ? JSON.parse(savedProfile).role : null;

      if (!userRole) {
        setError("Usuário não autenticado ou sem perfil definido.");
        setLoading(false);
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'X-User-Role': userRole
      };

      try {
        const [
          accessedRes,
          neverAccessedRes,
          outdatedRes,
          themesRes,
          questionsRes
        ] = await Promise.all([
          fetch(`${API_BASE}/accessed`, { headers }),
          fetch(`${API_BASE}/never-accessed`, { headers }),
          fetch(`${API_BASE}/outdated?days=90`, { headers }),
          fetch(`${API_BASE}/searched-themes`, { headers }),
          fetch(`${API_BASE}/chat-questions`, { headers })
        ]);

        if (!accessedRes.ok) throw new Error('Falha ao carregar dados de acesso');
        
        const accessedData = await accessedRes.json();
        const neverAccessedData = await neverAccessedRes.json();
        const outdatedData = await outdatedRes.json();
        const themesData = await themesRes.json();
        const questionsData = await questionsRes.json();

        // Map Backend Data to UI Structure
        setPopularFlows(accessedData.map(item => ({
          name: item.fluxo,
          theme: item.tema,
          accesses: item.acessos
        })));

        setNeverAccessedFlows(neverAccessedData.map(item => ({
          name: item.fluxo,
          theme: item.tema,
          created: item.data_ultima_edicao // Using updated_at as proxy for now
        })));

        setOutdatedFlows(outdatedData.map(item => ({
          name: item.fluxo,
          theme: item.tema,
          lastEdit: item.data_ultima_edicao
        })));

        setTopThemes(themesData.map(item => ({
          name: item.tema,
          count: item.buscas
        })));

        setQuestions(questionsData.map(item => ({
          question: item.pergunta,
          count: item.frequencia
        })));

      } catch (err) {
        console.error("Erro ao buscar métricas:", err);
        setError("Não foi possível carregar os dados. Verifique se você tem permissão de 'Gerente de Operações', 'Coordenador(a)' ou 'Líder'.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]); // Reload when period changes (even if backend doesn't support filtering yet, UI does)

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
          Carregando métricas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acesso Negado ou Erro</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
            >
              ⬅️
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              📊 Painel Gerencial <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Live Data</span>
            </h1>
          </div>
          
          <div className="flex gap-2">
            {['Dia', 'Semana', 'Mês'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  period === p 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ROW 0: Métricas de Perguntas (Totais) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wider">Perguntas Hoje</h3>
            <p className="text-4xl font-bold mt-2">{chatStats.daily}</p>
            <p className="text-xs text-blue-100 mt-2 opacity-80">Atualizado agora</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Perguntas na Semana</h3>
            <p className="text-4xl font-bold mt-2">{chatStats.weekly}</p>
            <p className="text-xs text-indigo-100 mt-2 opacity-80">Últimos 7 dias</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-purple-100 text-sm font-medium uppercase tracking-wider">Perguntas no Ano</h3>
            <p className="text-4xl font-bold mt-2">{chatStats.annual}</p>
            <p className="text-xs text-purple-100 mt-2 opacity-80">Acumulado do ano</p>
          </div>
        </div>

        {/* ROW 1: KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Perguntas Mais Feitas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              💬 Perguntas Frequentes
            </h2>
            <div className="space-y-3">
              {questions.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nenhuma pergunta registrada ainda.</p>
              ) : (
                questions.map((q, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{q.question}</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                      {q.count}x
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Temas Mais Buscados */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              🏷️ Temas em Alta
            </h2>
            <div className="space-y-4">
              {topThemes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Nenhuma busca registrada ainda.</p>
              ) : (
                topThemes.map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{t.name}</span>
                      <span className="text-gray-500">{t.count} buscas</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-1000" 
                        style={{ width: `${(t.count / Math.max(...topThemes.map(th => th.count), 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: Análise de Fluxos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Fluxos Mais Acessados */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-green-600 dark:text-green-400">
              🚀 Mais Acessados
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2">Fluxo</th>
                    <th className="px-3 py-2 text-right">Acessos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {popularFlows.length === 0 ? (
                    <tr><td colSpan="2" className="px-3 py-4 text-center text-gray-500">Sem dados</td></tr>
                  ) : (
                    popularFlows.map((f, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{f.name}</div>
                          <div className="text-xs text-gray-500">{f.theme}</div>
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-green-600">{f.accesses}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fluxos Nunca Acessados */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-red-500">
              👻 Nunca Acessados
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2">Fluxo</th>
                    <th className="px-3 py-2 text-right">Data Ref.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {neverAccessedFlows.length === 0 ? (
                    <tr><td colSpan="2" className="px-3 py-4 text-center text-gray-500">Todos os fluxos foram acessados!</td></tr>
                  ) : (
                    neverAccessedFlows.slice(0, 10).map((f, i) => ( // Limit to top 10 to avoid huge lists
                      <tr key={i}>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{f.name}</div>
                          <div className="text-xs text-gray-500">{f.theme}</div>
                        </td>
                        <td className="px-3 py-2 text-right text-gray-500">
                          {f.created ? new Date(f.created).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fluxos Desatualizados */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-orange-500">
              ⚠️ Desatualizados (+90 dias)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-3 py-2">Fluxo</th>
                    <th className="px-3 py-2 text-right">Últ. Edição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {outdatedFlows.length === 0 ? (
                    <tr><td colSpan="2" className="px-3 py-4 text-center text-gray-500">Tudo atualizado!</td></tr>
                  ) : (
                    outdatedFlows.map((f, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-800 dark:text-gray-200">{f.name}</div>
                          <div className="text-xs text-gray-500">{f.theme}</div>
                        </td>
                        <td className="px-3 py-2 text-right text-orange-600 font-medium">
                          {f.lastEdit ? new Date(f.lastEdit).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Warning Footer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-center">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ℹ️ As métricas acima representam o acesso à base de conhecimento real do sistema.
          </p>
        </div>

      </div>
    </div>
  );
}
