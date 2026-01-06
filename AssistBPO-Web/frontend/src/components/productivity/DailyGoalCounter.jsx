import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../services/api';

export function DailyGoalCounter({ isExpanded, setIsExpanded }) {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('bpo_daily_count');
    const savedDate = localStorage.getItem('bpo_daily_date');
    const today = new Date().toLocaleDateString();

    // Reset automático se mudou o dia
    if (savedDate !== today) {
      return 0;
    }
    return saved ? parseInt(saved, 10) : 0;
  });

  // const [isExpanded, setIsExpanded] = useState(true); // Now controlled by parent

  useEffect(() => {
    localStorage.setItem('bpo_daily_count', count);
    const today = new Date().toLocaleDateString();
    localStorage.setItem('bpo_daily_date', today);

    // Atualiza histórico
    const savedHistory = localStorage.getItem('assistbpo_flow_history');
    let history = savedHistory ? JSON.parse(savedHistory) : [];
    
    // Remove registro de hoje se já existir para atualizar
    history = history.filter(h => h.date !== today);
    
    // Adiciona atualizado
    history.push({ date: today, count });
    
    localStorage.setItem('assistbpo_flow_history', JSON.stringify(history));
    
    // Dispara evento para sincronizar abas/componentes
    window.dispatchEvent(new Event('storage'));

    // Sincroniza com Backend (Debounced)
    const timeoutId = setTimeout(() => {
      syncWithBackend(history, count);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [count]);

  const syncWithBackend = async (history, currentCount) => {
    try {
      const profileStr = localStorage.getItem('assistbpo_user_profile');
      if (!profileStr) return;
      
      const profile = JSON.parse(profileStr);
      const userIdentifier = profile.email || profile.name;
      const userRole = profile.role || 'Assistente BPO';
      
      if (!userIdentifier) return;

      const formatDate = (dateStr) => {
        // Assume DD/MM/YYYY format from toLocaleDateString('pt-BR')
        if (!dateStr) return null;
        if (dateStr.includes('-')) return dateStr; // Already ISO?
        const parts = dateStr.split('/');
        if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
        return dateStr;
      };

      const today = new Date().toLocaleDateString();
      const payload = history.map(h => ({
        date: formatDate(h.date),
        count: h.count
      }));

      // Adiciona/Atualiza o dia de hoje no payload se não estiver no histórico ainda
      const todayFormatted = formatDate(today);
      if (!payload.some(p => p.date === todayFormatted)) {
        payload.push({ date: todayFormatted, count: currentCount });
      } else {
        // Se já estiver (por algum motivo), atualiza
        const idx = payload.findIndex(p => p.date === todayFormatted);
        payload[idx].count = currentCount;
      }

      await fetch(`${API_BASE_URL}/api/volumetrics/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Identifier': userIdentifier,
          'X-User-Role': userRole
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Erro ao sincronizar volumetria:', error);
    }
  };

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => Math.max(0, c - 1));
  const reset = () => {
    if (window.confirm('Deseja zerar a contagem de hoje?')) {
      setCount(0);
    }
  };

  const GOAL_PRO = 220;
  const GOAL_PREMIUM = 250;

  const getProgressColor = () => {
    if (count >= GOAL_PREMIUM) return 'text-purple-600 dark:text-purple-400';
    if (count >= GOAL_PRO) return 'text-green-600 dark:text-green-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getProgressBarColor = () => {
    if (count >= GOAL_PREMIUM) return 'bg-purple-500';
    if (count >= GOAL_PRO) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const percentPro = Math.min(100, (count / GOAL_PRO) * 100);
  const percentPremium = Math.min(100, (count / GOAL_PREMIUM) * 100);

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-24 left-4 z-40 bg-white dark:bg-gray-800 shadow-lg rounded-full w-12 h-12 flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:scale-110 transition"
        title="Abrir Contador de Meta"
      >
        <span className="font-bold text-xs">{count}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 left-4 z-40 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 p-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Diária</span>
        <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {/* Display Principal */}
      <div className="p-4 text-center">
        <div className={`text-5xl font-bold mb-2 transition-colors duration-500 ${getProgressColor()}`}>
          {count}
        </div>
        
        {/* Botões de Ação */}
        <div className="flex justify-center gap-3 mb-4">
          <button 
            onClick={decrement}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-xl font-bold transition"
          >
            -
          </button>
          <button 
            onClick={increment}
            className="w-16 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center text-2xl font-bold transition transform active:scale-95"
          >
            +
          </button>
        </div>

        {/* Barras de Progresso */}
        <div className="space-y-3">
          {/* Meta PRO */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-gray-500">PRO</span>
              <span className="text-gray-400">{count}/{GOAL_PRO}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${count >= GOAL_PRO ? 'bg-green-500' : 'bg-blue-400'}`} 
                style={{ width: `${percentPro}%` }}
              ></div>
            </div>
          </div>

          {/* Meta Premium */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-gray-500">Premium</span>
              <span className="text-gray-400">{count}/{GOAL_PREMIUM}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${count >= GOAL_PREMIUM ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`} 
                style={{ width: `${percentPremium}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
           <button 
             onClick={reset}
             className="text-xs text-gray-400 hover:text-red-500 transition"
           >
             Zerar Contador
           </button>
        </div>

      </div>
    </div>
  );
}
