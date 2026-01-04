import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api/training';

export function TrainingAdmin({ onBack }) {
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'audit'
  const [categories, setCategories] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados de Edição
  const [editingCategory, setEditingCategory] = useState(null); // null = mode list, {} = mode create, {id...} = mode edit
  const [editingTraining, setEditingTraining] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getHeaders = () => {
    const saved = localStorage.getItem('assistbpo_user_profile');
    const role = saved ? JSON.parse(saved).role : '';
    return {
      'Content-Type': 'application/json',
      'X-User-Role': role
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'content') {
        const [catRes, trainRes] = await Promise.all([
          fetch(`${API_BASE}/categories/all`, { headers: getHeaders() }),
          fetch(`${API_BASE}/all`, { headers: getHeaders() })
        ]);
        
        if (!catRes.ok || !trainRes.ok) throw new Error("Falha ao carregar dados. Verifique suas permissões.");
        
        setCategories(await catRes.json());
        setTrainings(await trainRes.json());
      } else {
        const res = await fetch(`${API_BASE}/audit`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Falha ao carregar histórico.");
        setLogs(await res.json());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD CATEGORIAS ---

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const isNew = !editingCategory.id;
    const url = isNew ? `${API_BASE}/categories` : `${API_BASE}/categories/${editingCategory.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(editingCategory)
      });
      if (!res.ok) throw new Error("Erro ao salvar categoria");
      setEditingCategory(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Tem certeza? Isso pode falhar se houver treinamentos vinculados.")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Erro ao excluir categoria (verifique se está vazia)");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- CRUD TREINAMENTOS ---

  const handleSaveTraining = async (e) => {
    e.preventDefault();
    const isNew = !editingTraining.id;
    const url = isNew ? `${API_BASE}` : `${API_BASE}/${editingTraining.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const payload = {
        ...editingTraining,
        categoryId: editingTraining.categoryId ? parseInt(editingTraining.categoryId) : null
    };

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Erro ao salvar treinamento");
      setEditingTraining(null);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTraining = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este treinamento?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Erro ao excluir treinamento");
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
              ⬅️
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              🛠️ Administração de Treinamentos
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'content' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Conteúdo
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'audit' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Histórico
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {activeTab === 'content' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Coluna Categorias */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Categorias</h2>
                <button 
                  onClick={() => setEditingCategory({ nome: '', ordem: 0, ativo: true })}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  + Nova
                </button>
              </div>

              {editingCategory && (
                <form onSubmit={handleSaveCategory} className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-bold mb-3">{editingCategory.id ? 'Editar' : 'Nova'} Categoria</h3>
                  <div className="space-y-3">
                    <input 
                      className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Nome"
                      value={editingCategory.nome}
                      onChange={e => setEditingCategory({...editingCategory, nome: e.target.value})}
                      required
                    />
                    <div className="flex gap-2">
                        <input 
                        type="number"
                        className="w-20 p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        placeholder="Ordem"
                        value={editingCategory.ordem}
                        onChange={e => setEditingCategory({...editingCategory, ordem: parseInt(e.target.value)})}
                        />
                        <label className="flex items-center gap-2 text-sm">
                            <input 
                                type="checkbox"
                                checked={editingCategory.ativo}
                                onChange={e => setEditingCategory({...editingCategory, ativo: e.target.checked})}
                            />
                            Ativo
                        </label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditingCategory(null)} className="px-3 py-1 text-gray-500 text-sm">Cancelar</button>
                      <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Salvar</button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded group">
                    <div>
                        <div className="font-medium">{cat.nome}</div>
                        <div className="text-xs text-gray-500">Ordem: {cat.ordem} • {cat.ativo ? 'Ativo' : 'Inativo'}</div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => setEditingCategory(cat)} className="text-blue-500 hover:underline text-sm">Editar</button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:underline text-sm">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coluna Treinamentos */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Treinamentos</h2>
                <button 
                  onClick={() => setEditingTraining({ titulo: '', descricaoCurta: '', udemyUrl: '', ordem: 0, ativo: true, categoryId: categories[0]?.id || '' })}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  + Novo
                </button>
              </div>

              {editingTraining && (
                <form onSubmit={handleSaveTraining} className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-bold mb-3">{editingTraining.id ? 'Editar' : 'Novo'} Treinamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <input 
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        placeholder="Título"
                        value={editingTraining.titulo}
                        onChange={e => setEditingTraining({...editingTraining, titulo: e.target.value})}
                        required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <input 
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        placeholder="Descrição Curta"
                        value={editingTraining.descricaoCurta}
                        onChange={e => setEditingTraining({...editingTraining, descricaoCurta: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <input 
                        className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        placeholder="URL Udemy"
                        value={editingTraining.udemyUrl}
                        onChange={e => setEditingTraining({...editingTraining, udemyUrl: e.target.value})}
                        required
                        />
                    </div>
                    
                    <select 
                        className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        value={editingTraining.categoryId || ''}
                        onChange={e => setEditingTraining({...editingTraining, categoryId: e.target.value})}
                        required
                    >
                        <option value="">Selecione a Categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>

                    <input 
                        type="number"
                        className="p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                        placeholder="Ordem"
                        value={editingTraining.ordem}
                        onChange={e => setEditingTraining({...editingTraining, ordem: parseInt(e.target.value)})}
                    />

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm">
                            <input 
                                type="checkbox"
                                checked={editingTraining.ativo}
                                onChange={e => setEditingTraining({...editingTraining, ativo: e.target.checked})}
                            />
                            Ativo
                        </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setEditingTraining(null)} className="px-3 py-1 text-gray-500 text-sm">Cancelar</button>
                    <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Salvar</button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {trainings.map(train => (
                  <div key={train.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded group">
                    <div>
                        <div className="font-medium">{train.titulo}</div>
                        <div className="text-xs text-gray-500">
                            {train.category?.nome} • Ordem: {train.ordem} • {train.ativo ? 'Ativo' : 'Inativo'}
                        </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => setEditingTraining({
                            ...train,
                            categoryId: train.category?.id // Map nested category to ID for editing
                        })} 
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Editar
                      </button>
                      <button onClick={() => handleDeleteTraining(train.id)} className="text-red-500 hover:underline text-sm">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Tab Histórico */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {log.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.action === 'DELETE' ? 'bg-red-100 text-red-800' : 
                        log.action === 'CREATE' ? 'bg-green-100 text-green-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
