import React, { useState, useEffect } from 'react';
import { TrainingAdmin } from './TrainingAdmin';

const API_BASE = 'http://localhost:8080/api/training';

export function TrainingPanel({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'admin'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, trainRes] = await Promise.all([
        fetch(`${API_BASE}/categories`),
        fetch(`${API_BASE}`)
      ]);

      if (!catRes.ok || !trainRes.ok) throw new Error('Erro ao carregar treinamentos');

      const cats = await catRes.json();
      const trains = await trainRes.json();

      setCategories(cats);
      setTrainings(trains);
      
      // Auto-select first category if available
      if (cats.length > 0) setSelectedCategory(cats[0].id);

    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os treinamentos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = selectedCategory 
    ? trainings.filter(t => t.category?.id === selectedCategory)
    : trainings;

  const hasAdminPermission = () => {
    const saved = localStorage.getItem('assistbpo_user_profile');
    if (!saved) return false;
    const profile = JSON.parse(saved);
    const allowedRoles = ['Gerente de Operações', 'Coordenador(a)', 'Líder(a)'];
    return allowedRoles.includes(profile.role);
  };

  if (view === 'admin') {
    return <TrainingAdmin onBack={() => setView('list')} />;
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
              🎓 Painel de Treinamento
            </h1>
          </div>
          {hasAdminPermission() && (
            <button 
                onClick={() => setView('admin')}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition"
            >
                ⚙️ Gerenciar
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Aviso Importante */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Atenção</h3>
            <p className="text-sm text-blue-700 dark:text-blue-200">
              Os vídeos são hospedados na Udemy e abrem em uma nova aba. Certifique-se de estar logado na plataforma se necessário.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 animate-pulse">Carregando conteúdo...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Categorias */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-2">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Categorias</h3>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition text-sm font-medium ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat.nome}
                </button>
              ))}
              {categories.length === 0 && (
                <p className="text-sm text-gray-400 px-2">Nenhuma categoria encontrada.</p>
              )}
            </div>

            {/* Lista de Treinamentos */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {categories.find(c => c.id === selectedCategory)?.nome || 'Todos os Treinamentos'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrainings.map(training => (
                  <div key={training.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition flex flex-col">
                    <div className="p-5 flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2" title={training.titulo}>
                        {training.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {training.descricaoCurta}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700">
                      <a 
                        href={training.udemyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm"
                      >
                        📺 Assistir na Udemy
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTrainings.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                  <p className="text-gray-500">Nenhum treinamento disponível nesta categoria.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
