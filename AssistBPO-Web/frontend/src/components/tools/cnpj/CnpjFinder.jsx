import React, { useState } from 'react';

export function CnpjFinder({ onBack }) {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const formatCnpj = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18);
  };

  const handleChange = (e) => {
    setCnpj(formatCnpj(e.target.value));
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      setError('O CNPJ deve conter exatamente 14 dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      // Usar Proxy Backend para evitar problemas de CORS e SSL
      const response = await fetch(`${API_BASE_URL}/api/cnpj/${cleanCnpj}`);
      
      if (response.status === 404) {
        throw new Error('CNPJ não encontrado na base de dados.');
      }
      if (!response.ok) {
        throw new Error('Erro ao consultar a API. Tente novamente mais tarde.');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          🏢 Consulta de CNPJ
          <span className="text-xs font-normal px-2 py-1 bg-blue-100 text-blue-700 rounded-full">BrasilAPI</span>
        </h2>
        <button 
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
        >
          Voltar
        </button>
      </div>

      {/* Busca */}
      <form onSubmit={handleSearch} className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Digite o CNPJ
          </label>
          <input
            type="text"
            value={cnpj}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg"
            maxLength={18}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Consultando...' : '🔍 Consultar'}
        </button>
      </form>

      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
          ⚠️ {error}
        </div>
      )}

      {/* Resultados */}
      {data && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Cartão Principal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className={`p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center ${
              data.descricao_situacao_cadastral === 'ATIVA' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
            }`}>
              <div>
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                  data.descricao_situacao_cadastral === 'ATIVA' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {data.descricao_situacao_cadastral}
                </span>
                <span className="ml-2 text-xs text-gray-500">Desde {data.data_situacao_cadastral}</span>
              </div>
              <span className="font-mono text-gray-600 dark:text-gray-300 font-bold">{data.cnpj}</span>
            </div>
            
            <div className="p-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">{data.razao_social}</h1>
              {data.nome_fantasia && (
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">{data.nome_fantasia}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <InfoItem label="Data de Abertura" value={data.data_inicio_atividade} />
                <InfoItem label="Porte" value={data.porte} />
                <InfoItem label="Natureza Jurídica" value={`${data.codigo_natureza_juridica} - ${data.natureza_juridica}`} />
                <InfoItem label="Capital Social" value={data.capital_social ? `R$ ${data.capital_social.toLocaleString('pt-BR')}` : 'Não informado'} />
              </div>
            </div>
          </div>

          {/* Endereço e Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">📍 Endereço</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {data.logradouro}, {data.numero} {data.complemento && ` - ${data.complemento}`}<br />
                {data.bairro}<br />
                {data.municipio} - {data.uf}<br />
                CEP: {data.cep}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">📞 Contato</h3>
              <div className="space-y-2">
                <InfoItem label="Telefone" value={`(${data.ddd_telefone_1?.substring(0,2)}) ${data.ddd_telefone_1?.substring(2)}`} />
                 {data.email && <InfoItem label="E-mail" value={data.email} />}
              </div>
            </div>
          </div>

          {/* Atividades */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">🏭 Atividades Econômicas (CNAE)</h3>
             
             <div className="mb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Principal</span>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {data.cnae_fiscal} - {data.cnae_fiscal_descricao}
                </p>
             </div>

             {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
               <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Secundárias</span>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {data.cnaes_secundarios.map((cnae, idx) => (
                      <li key={idx}>• {cnae.codigo} - {cnae.descricao}</li>
                    ))}
                  </ul>
               </div>
             )}
          </div>

          {/* Quadro Societário */}
          {data.qsa && data.qsa.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">👥 Quadro Societário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.qsa.map((socio, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <p className="font-bold text-gray-800 dark:text-gray-200">{socio.nome_socio}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {socio.qualificacao_socio}
                    </p>
                    {socio.cnpj_cpf_socio && (
                        <p className="text-xs text-gray-400 mt-1 font-mono">Doc: ***{socio.cnpj_cpf_socio.slice(3, -3)}***</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center pt-4 pb-8">
            <p className="text-xs text-gray-400">Dados fornecidos por BrasilAPI • Receita Federal</p>
          </div>

        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <span className="block text-xs font-medium text-gray-500 uppercase">{label}</span>
      <span className="block text-gray-800 dark:text-gray-200 font-medium">{value}</span>
    </div>
  );
}
