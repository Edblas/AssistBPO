import React from 'react'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  );
}

export function FlowList({ themeName, docs, onEdit, onToggleActive, onDelete, onReorder, onBack, onCreateNew, search, setSearch }) {
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredDocs = docs.filter(doc => {
    if (!search) return true;
    return doc.fluxo.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <button 
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                title="Voltar para Temas"
            >
                ⬅️
            </button>
            <div>
                <h2 className="text-2xl font-bold">{themeName}</h2>
                <p className="text-sm text-gray-500">{docs.length} fluxos cadastrados</p>
            </div>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="🔍 Buscar Fluxo..."
                    className="pl-4 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none w-64"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <button 
                onClick={onCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium transition flex items-center gap-2"
            >
                ➕ Novo Fluxo
            </button>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => onReorder(e, themeName)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            <SortableContext 
                items={docs.map(doc => doc.id)}
                strategy={rectSortingStrategy}
            >
            {filteredDocs.map(doc => (
                <SortableItem key={doc.id} id={doc.id}>
                    <div className={`relative group h-full flex flex-col justify-between bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${!doc.active ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50 grayscale-[0.5]' : ''}`}>
                      
                      {/* Drag Handle */}
                      <div className="absolute top-3 right-3 cursor-move text-gray-300 hover:text-gray-500 p-1 z-10">
                        ⋮⋮
                      </div>

                      <div>
                        {/* Header do Card */}
                        <div className="mb-3 pr-6">
                          <div className="flex flex-wrap gap-2 mb-2">
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${doc.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                               {doc.active ? 'Ativo' : 'Inativo'}
                             </span>
                          </div>
                          <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight break-words">
                            {doc.fluxo}
                          </h4>
                        </div>

                        {/* Corpo do Card */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 flex-wrap">
                             <span className={`text-xs font-semibold px-2 py-1 rounded ${doc.podeAceitar ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                               {doc.podeAceitar ? '✅ Aceita' : '❌ Recusa'}
                             </span>
                             {(doc.modelosAceitos?.length > 0 || doc.modelosNaoAceitos?.length > 0) && (
                               <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 flex items-center gap-1">
                                 📎 Anexos
                               </span>
                             )}
                          </div>
                          
                          {doc.updatedAt && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <span>🕒</span>
                              <span>{new Date(doc.updatedAt).toLocaleDateString()} {new Date(doc.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rodapé com Ações */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between mt-auto">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => onEdit(doc)}
                            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
                            title="Editar Fluxo"
                          >
                            ✏️ Editar
                          </button>
                        </div>
                        
                        <div className="flex gap-1">
                          <button 
                            onClick={() => onToggleActive(doc)}
                            className={`p-2 rounded-lg transition-colors ${doc.active ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30' : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'}`}
                            title={doc.active ? "Inativar" : "Ativar"}
                          >
                            {doc.active ? '⏸️' : '▶️'}
                          </button>
                          
                          {!doc.active && (
                            <button 
                              onClick={() => onDelete(doc.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                </SortableItem>
            ))}
            </SortableContext>
        </div>
      </DndContext>

      {filteredDocs.length === 0 && (
        <div className="text-center py-10 text-gray-500">
            Nenhum fluxo encontrado com este filtro.
        </div>
      )}
    </div>
  )
}
