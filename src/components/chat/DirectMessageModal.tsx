import { X, Send, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export function DirectMessageModal({ 
  otherUserId, 
  otherUserName,
  onClose 
}: { 
  otherUserId: string;
  otherUserName: string;
  onClose: () => void;
}) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generamos un ID único para la sala de chat entre estos dos usuarios.
  // Ordenamos los IDs alfabéticamente para que siempre sea el mismo sin importar quién abra el chat.
  const dmRoomId = user 
    ? `dm_${[user.id, otherUserId].sort().join('_')}`
    : '';

  useEffect(() => {
    if (!dmRoomId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('activity_chats')
        .select('*')
        .eq('activity_id', dmRoomId)
        .order('created_at', { ascending: true });
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase.channel(`dm_${dmRoomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_chats', filter: `activity_id=eq.${dmRoomId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [dmRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim() || !user || !dmRoomId) return;

    const text = msg;
    setMsg(''); // clear input early for UX

    await supabase.from('activity_chats').insert([{
      activity_id: dmRoomId,
      user_id: user.id,
      user_name: user.name,
      text: text
    }]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-[600px] border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(otherUserName)}&background=random&size=150`} alt={otherUserName} />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white leading-tight">Chat con {otherUserName}</h2>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">Mensaje Directo Privado</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 shadow-sm p-2 rounded-full transition-colors border border-slate-200 dark:border-slate-700"><X size={20} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <MessageSquare size={48} className="opacity-20 mb-2" />
              <p className="text-sm">Inicia la conversación con {otherUserName}</p>
              <p className="text-xs opacity-60 max-w-xs text-center">Este chat es completamente privado.</p>
            </div>
          ) : (
            messages.map((m: any, i: number) => {
              const isMe = m.user_id === user?.id;
              return (
                <div key={m.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-green-600 text-white rounded-br-none shadow-green-600/20 shadow-lg' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none shadow-md'}`}>
                    <p className="text-sm">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <form onSubmit={send} className="flex gap-2">
            <input 
              type="text" 
              value={msg} 
              onChange={e => setMsg(e.target.value)} 
              placeholder="Escribe un mensaje privado..." 
              className="flex-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <button 
              type="submit" 
              disabled={!msg.trim()}
              className="bg-green-600 hover:bg-green-500 text-white p-2.5 sm:p-3 rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex-shrink-0 shadow-lg shadow-green-600/20"
            >
              <Send size={20} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
