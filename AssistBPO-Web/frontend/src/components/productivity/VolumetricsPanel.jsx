import React, { useState, useEffect } from 'react';

export function VolumetricsPanel({ onBack }) {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  
  const profile = JSON.parse(localStorage.getItem('assistbpo_user_profile') || '{}');
  // Se não tiver identificador, usamos um genérico para permitir a visualização do layout
  const userIdentifier = profile.email || profile.name || 'Visitante';
  const userRole = profile.role || 'Assistente BPO';
  const isManager = ['Gerente de Operações', 'Coordenador(a)', 'Líder'].includes(userRole);

  useEffect(() => {
    fetchDashboard();
    if (isManager) fetchUsers();
  }, [selectedUser]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8080/api/volumetrics/dashboard';
      if (selectedUser) {
        url += `?targetUserId=${encodeURIComponent(selectedUser)}`;
      }

      const res = await fetch(url, {
        headers: {
          'X-User-Identifier': userIdentifier,
          'X-User-Role': userRole
        }
      });
      
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch volumetrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/volumetrics/users', {
        headers: { 'X-User-Role': userRole }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const getStatusInfo = (count) => {
    // Regras:
    // Verde: meta atingida (>= 220)
    // Amarelo: próximo da meta (>= 180)
    // Vermelho: abaixo da meta (< 180)
    const GOAL_PRO = 220;
    
    if (count >= GOAL_PRO) {
        return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' };
    }
    if (count >= 180) {
        return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' };
    }
    return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 pt-20 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
              📊
            </span>
            Painel de Volumetria
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Acompanhamento de produção e metas operacionais
          </p>
        </div>
        
        <div className="flex gap-3">
            {isManager && (
                <select 
                    value={selectedUser} 
                    onChange={e => setSelectedUser(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Visão da Equipe (Todos)</option>
                    {users.map(u => (
                        <option key={u} value={u}>{u}</option>
                    ))}
                </select>
            )}
            <button 
                onClick={onBack}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
            >
                Voltar
            </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard title="Hoje" stats={data?.daily} showGoal={true} />
                <StatCard title="Últimos 7 dias" stats={data?.weekly} />
                <StatCard title="Últimos 15 dias" stats={data?.biweekly} />
                <StatCard title="Últimos 30 dias" stats={data?.monthly} />
                <StatCard title="Este Ano" stats={data?.annual} />
            </div>

            {/* Seção de Detalhes / Gráficos (Futuro) */}
            {/* Aqui poderia entrar um gráfico de linha com a evolução diária */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Detalhes da Produção</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Período</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Total Fluxos</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Média Diária</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Dias Ativos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                             <TableRow label="Hoje" stats={data?.daily} />
                             <TableRow label="Semanal" stats={data?.weekly} />
                             <TableRow label="Quinzenal" stats={data?.biweekly} />
                             <TableRow label="Mensal" stats={data?.monthly} />
                             <TableRow label="Anual" stats={data?.annual} />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, stats, showGoal }) {
    const safeStats = stats || { totalFluxos: 0, mediaDiaria: 0, diasComRegistro: 0 };
    
    // Meta Diária
    const GOAL = 220; 
    const percent = Math.min(100, (safeStats.totalFluxos / GOAL) * 100);
    
    let statusColor = 'text-gray-600 dark:text-gray-300';
    let barColor = 'bg-blue-500';

    if (showGoal) {
        if (safeStats.totalFluxos >= 220) {
            statusColor = 'text-green-600 dark:text-green-400';
            barColor = 'bg-green-500';
        } else if (safeStats.totalFluxos >= 180) {
            statusColor = 'text-yellow-600 dark:text-yellow-400';
            barColor = 'bg-yellow-500';
        } else {
            statusColor = 'text-red-600 dark:text-red-400';
            barColor = 'bg-red-500';
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">{title}</h3>
            
            <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-3xl font-bold ${statusColor}`}>{safeStats.totalFluxos}</span>
                <span className="text-xs text-gray-400">fluxos</span>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Média: {safeStats.mediaDiaria?.toFixed(1) || '0.0'}/dia</span>
                </div>
                
                {showGoal && (
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${barColor}`} 
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TableRow({ label, stats }) {
    const safeStats = stats || { totalFluxos: 0, mediaDiaria: 0, diasComRegistro: 0 };
    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-750 transition">
            <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">{label}</td>
            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{safeStats.totalFluxos}</td>
            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{safeStats.mediaDiaria?.toFixed(1) || '0.0'}</td>
            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{safeStats.diasComRegistro}</td>
        </tr>
    );
}
