import React, { useState, useEffect } from 'react';

const USER_ROLES = {
  GERENTE: 'Gerente de Operações',
  COORDENADOR: 'Coordenador(a)',
  LIDER: 'Líder',
  QUALIDADE: 'Qualidade',
  PONTO_FOCAL: 'Ponto Focal',
  ASSISTENTE: 'Assistente BPO'
};

const GOALS = {
  PRO: 220,
  PREMIUM: 250
};

export function UserProfile({ onClose }) {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('assistbpo_user_profile');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      role: USER_ROLES.ASSISTENTE
    };
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('assistbpo_flow_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('assistbpo_user_profile', JSON.stringify(profile));
  }, [profile]);

  // Load latest history on mount
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('assistbpo_flow_history');
      if (saved) setHistory(JSON.parse(saved));
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also poll specifically for local updates within same window
    const interval = setInterval(() => {
        const saved = localStorage.getItem('assistbpo_flow_history');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (JSON.stringify(parsed) !== JSON.stringify(history)) {
                setHistory(parsed);
            }
        }
    }, 1000);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
    }
  }, [history]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const getTodayCount = () => {
    const today = new Date().toLocaleDateString();
    const entry = history.find(h => h.date === today);
    return entry ? entry.count : 0;
  };

  const todayCount = getTodayCount();
  const percentPro = Math.min(100, (todayCount / GOALS.PRO) * 100);
  const percentPremium = Math.min(100, (todayCount / GOALS.PREMIUM) * 100);

  // Calendar Logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    // Padding for empty start days
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getHistoryForDate = (date) => {
    if (!date) return null;
    const dateStr = date.toLocaleDateString(); // DD/MM/YYYY based on locale
    return history.find(h => h.date === dateStr);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const calendarDays = getDaysInMonth(currentDate);

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-end">
      <div className="w-full max-w-md h-full bg-white dark:bg-gray-800 shadow-2xl animate-slide-in-right overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Perfil do Usuário</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Dados do Usuário */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Dados Pessoais</h3>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
              >
                {isEditing ? 'Salvar' : 'Editar'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Nome</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{profile.name || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">E-mail Corporativo</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-white">{profile.email || 'Não informado'}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Função</label>
                {isEditing ? (
                  <select 
                    value={profile.role}
                    onChange={e => setProfile({...profile, role: e.target.value})}
                    className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {Object.values(USER_ROLES).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                ) : (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm font-medium">
                    {profile.role}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Indicador de Produtividade (Apenas Assistente BPO) */}
          {profile.role === USER_ROLES.ASSISTENTE && (
            <section className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Produtividade Hoje</h3>
              
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{todayCount}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">fluxos</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Meta PRO (220)</span>
                    <span className="text-gray-500">{Math.round(percentPro)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${todayCount >= GOALS.PRO ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${percentPro}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Meta Premium (250)</span>
                    <span className="text-gray-500">{Math.round(percentPremium)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${todayCount >= GOALS.PREMIUM ? 'bg-purple-500' : 'bg-gray-400'}`}
                      style={{ width: `${percentPremium}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Histórico Diário - Calendário */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Histórico de Fluxos</h3>
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                  ◀
                </button>
                <span className="text-sm font-semibold capitalize text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
                  {monthName}
                </span>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                  ▶
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden p-4">
              {/* Dias da Semana */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-xs font-bold text-gray-400">
                    {d}
                  </div>
                ))}
              </div>

              {/* Grade de Dias */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) return <div key={index} className="h-10"></div>;

                  const historyEntry = getHistoryForDate(date);
                  const isToday = date.toLocaleDateString() === new Date().toLocaleDateString();
                  const hasFlows = historyEntry && historyEntry.count > 0;
                  
                  return (
                    <div 
                      key={index} 
                      className={`
                        h-10 flex flex-col items-center justify-center rounded-lg text-xs relative border
                        ${isToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}
                      `}
                    >
                      <span className={`font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                        {date.getDate()}
                      </span>
                      
                      {hasFlows && (
                        <span className="absolute bottom-0.5 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1 rounded-full">
                          {historyEntry.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
