import { X, Check, UserMinus } from 'lucide-react';

export function AdminModal({ activity, onClose }: { activity: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-900 text-white">
          <h2 className="font-bold text-lg truncate">Administrar Participantes</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Confirmados ({activity.participants?.length || 0}/{activity.maxParticipants})</h3>
          
          <ul className="space-y-3">
            {activity.participants?.map((name: string, i: number) => (
              <li key={i} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} className="w-8 h-8 rounded-full" />
                  <span className="font-medium text-sm">{name}</span>
                </div>
                <button onClick={() => alert('Eliminar participante aún no conectado al backend')} className="text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <UserMinus size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
