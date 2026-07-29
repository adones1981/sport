import { X, MessageSquare, MapPin, User, Activity } from 'lucide-react';
import { useState } from 'react';
import { DirectMessageModal } from '../chat/DirectMessageModal';
import { useAuthStore } from '@/store/useAuthStore';

export function PublicProfileModal({ 
  creatorId, 
  creatorName, 
  onClose 
}: { 
  creatorId: string;
  creatorName: string;
  onClose: () => void;
}) {
  const { user } = useAuthStore();
  const [isDMOpen, setIsDMOpen] = useState(false);

  // Auto-generate avatar based on name
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=random&size=150`;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors z-10 backdrop-blur-md"
          >
            <X size={20} />
          </button>

          {/* Header Background */}
          <div className="h-32 bg-gradient-to-br from-green-500 to-blue-600 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-full p-1 bg-white dark:bg-slate-900">
              <img 
                src={avatarUrl} 
                alt={creatorName} 
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 object-cover shadow-lg"
              />
            </div>
          </div>

          <div className="pt-16 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{creatorName}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full border border-green-200 dark:border-green-800/50">
                Organizador
              </span>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800/50">
                Deportista
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <button 
                onClick={() => {
                  if (user) {
                    setIsDMOpen(true);
                  } else {
                    alert('Debes iniciar sesión para enviar mensajes internos.');
                  }
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white py-3.5 rounded-xl font-bold transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <MessageSquare size={20} />
                Enviar mensaje interno
              </button>
            </div>
          </div>
        </div>
      </div>

      {isDMOpen && user && (
        <DirectMessageModal 
          otherUserId={creatorId} 
          otherUserName={creatorName} 
          onClose={() => setIsDMOpen(false)} 
        />
      )}
    </>
  );
}
