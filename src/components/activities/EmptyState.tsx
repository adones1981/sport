import { SearchX } from 'lucide-react';

export function EmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-4">
      <div className="bg-slate-100 p-4 rounded-full mb-4 dark:bg-slate-800">
        <SearchX size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 dark:text-white">No encontramos actividades</h3>
      <p className="text-slate-500 max-w-sm dark:text-slate-400">
        No hay actividades publicadas para esta categoría en este momento. ¡Anímate a ser el primero en crear una!
      </p>
      <button onClick={onCreate} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg">
        Publicar Actividad
      </button>
    </div>
  );
}
