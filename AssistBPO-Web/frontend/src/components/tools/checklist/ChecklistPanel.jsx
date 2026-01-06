import React, { useState, useMemo } from 'react';
import checklistData from '../../../data/checklistData';
import pareceresData from '../../../data/pareceresData';

export function ChecklistPanel() {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [checklistState, setChecklistState] = useState({});
  const [imageModal, setImageModal] = useState({ open: false, url: '', zoom: 1, pos: { x: 0, y: 0 } });

  const types = useMemo(() => Object.keys(checklistData), []);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSelectedDoc(null);
    setChecklistState({});
  };

  const handleDocSelect = (docKey) => {
    setSelectedDoc(checklistData[selectedType].documents[docKey]);
    setChecklistState({});
  };

  const toggleCheck = (question, status) => {
    // status: 'ok' | 'nok' | 'na'
    setChecklistState(prev => ({
      ...prev,
      [question]: prev[question] === status ? null : status
    }));
  };

  const getParecer = () => {
    if (!selectedDoc) return null;
    
    const failures = Object.entries(selectedDoc.checklist)
      .filter(([question, errorKey]) => checklistState[question] === 'nok');

    if (failures.length === 0) return null;

    return failures.map(([question, errorKey]) => {
      const parecer = pareceresData["Pareceres Gerais"]?.[errorKey] || pareceresData[selectedType]?.[errorKey] || "Parecer não encontrado para este erro.";
      return (
        <div key={question} className="mb-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm">
          <strong className="block text-red-700 dark:text-red-300 mb-1">{question}</strong>
          <p className="text-gray-700 dark:text-gray-300">{parecer}</p>
        </div>
      );
    });
  };

  const openImage = () => {
    if (selectedDoc && selectedDoc.imageUrl) {
      setImageModal({ open: true, url: selectedDoc.imageUrl, zoom: 1, pos: { x: 0, y: 0 } });
    }
  };

  const handleWheel = (e) => {
    if (!imageModal.open) return;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setImageModal(prev => ({ ...prev, zoom: Math.max(0.5, Math.min(5, prev.zoom * delta)) }));
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      {/* Header / Breadcrumbs */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm overflow-x-auto whitespace-nowrap">
        <button 
            onClick={() => { setSelectedType(null); setSelectedDoc(null); }}
            className={`hover:text-blue-600 ${!selectedType ? 'font-bold text-blue-600' : 'text-gray-500'}`}
        >
            Início
        </button>
        {selectedType && (
            <>
                <span className="text-gray-400">/</span>
                <button 
                    onClick={() => setSelectedDoc(null)}
                    className={`hover:text-blue-600 ${!selectedDoc ? 'font-bold text-blue-600' : 'text-gray-500'}`}
                >
                    {checklistData[selectedType].name}
                </button>
            </>
        )}
        {selectedDoc && (
            <>
                <span className="text-gray-400">/</span>
                <span className="font-bold text-blue-600">{selectedDoc.name}</span>
            </>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Navigation / Selection Area */}
        <div className={`flex-1 overflow-y-auto p-4 ${selectedDoc ? 'hidden md:block md:w-1/3 md:flex-none border-r border-gray-200 dark:border-gray-700' : ''}`}>
            {!selectedType ? (
                <div className="grid grid-cols-2 gap-4">
                    {types.map(key => (
                        <button
                            key={key}
                            onClick={() => handleTypeSelect(key)}
                            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition gap-2"
                        >
                            <span className="text-3xl">{checklistData[key].icon}</span>
                            <span className="font-medium text-center">{checklistData[key].name}</span>
                        </button>
                    ))}
                </div>
            ) : !selectedDoc ? (
                <div className="space-y-2">
                    <h3 className="font-bold mb-4 text-lg flex items-center gap-2">
                        <span>{checklistData[selectedType].icon}</span>
                        {checklistData[selectedType].name}
                    </h3>
                    {Object.entries(checklistData[selectedType].documents).map(([key, doc]) => (
                        <button
                            key={key}
                            onClick={() => handleDocSelect(key)}
                            className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 transition"
                        >
                            <span className="text-xl">{doc.icon}</span>
                            <span>{doc.name}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">{selectedDoc.name}</h3>
                        {selectedDoc.imageUrl && (
                            <button 
                                onClick={openImage}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 flex items-center gap-1"
                            >
                                👁️ Ver Modelo
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {Object.keys(selectedDoc.checklist).map((question) => (
                            <div key={question} className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                <p className="mb-2 text-sm font-medium">{question}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleCheck(question, 'ok')}
                                        className={`flex-1 py-1 rounded text-xs font-bold transition ${checklistState[question] === 'ok' ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-green-50'}`}
                                    >
                                        SIM
                                    </button>
                                    <button
                                        onClick={() => toggleCheck(question, 'nok')}
                                        className={`flex-1 py-1 rounded text-xs font-bold transition ${checklistState[question] === 'nok' ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-red-50'}`}
                                    >
                                        NÃO
                                    </button>
                                    <button
                                        onClick={() => toggleCheck(question, 'na')}
                                        className={`px-3 py-1 rounded text-xs font-bold transition ${checklistState[question] === 'na' ? 'bg-gray-500 text-white' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100'}`}
                                    >
                                        N/A
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="font-bold mb-2 text-gray-700 dark:text-gray-300">Pareceres:</h4>
                        {getParecer() || <p className="text-sm text-gray-500 italic">Nenhuma pendência identificada.</p>}
                    </div>
                </div>
            )}
        </div>

        {/* Desktop Image Preview (if space allows) */}
        {selectedDoc && selectedDoc.imageUrl && (
            <div className="hidden md:flex flex-1 bg-gray-100 dark:bg-gray-900 items-center justify-center p-4 relative overflow-hidden">
                 <img 
                    src={selectedDoc.imageUrl} 
                    alt="Modelo" 
                    className="max-w-full max-h-full object-contain shadow-lg rounded"
                 />
                 <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Modelo de Referência
                 </div>
            </div>
        )}
      </div>

      {/* Image Modal */}
      {imageModal.open && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center overflow-hidden" onClick={() => setImageModal({ ...imageModal, open: false })}>
            <div 
                className="relative w-full h-full flex items-center justify-center"
                onWheel={handleWheel}
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={imageModal.url} 
                    alt="Zoom" 
                    style={{ 
                        transform: `scale(${imageModal.zoom}) translate(${imageModal.pos.x}px, ${imageModal.pos.y}px)`,
                        cursor: imageModal.zoom > 1 ? 'grab' : 'default',
                        transition: 'transform 0.1s ease-out'
                    }}
                    className="max-w-[90%] max-h-[90%] object-contain"
                />
                
                <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                        onClick={() => setImageModal(prev => ({ ...prev, zoom: prev.zoom + 0.5 }))}
                        className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm"
                    >
                        ➕
                    </button>
                    <button 
                        onClick={() => setImageModal(prev => ({ ...prev, zoom: Math.max(0.5, prev.zoom - 0.5) }))}
                        className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm"
                    >
                        ➖
                    </button>
                    <button 
                        onClick={() => setImageModal({ ...imageModal, open: false })}
                        className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm"
                    >
                        ✕
                    </button>
                </div>

                <div className="absolute bottom-8 text-white/70 text-sm pointer-events-none">
                    Use o scroll do mouse para zoom
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
