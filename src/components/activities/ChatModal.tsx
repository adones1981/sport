import { X, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useActivityStore } from '@/store/useActivityStore';
import { useAuthStore } from '@/store/useAuthStore';

export function ChatModal({ activityTitle, activityId, onClose }: { activityTitle: string, activityId: number, onClose: () => void }) {
  const [msg, setMsg] = useState('');
  const { chats, addMessage } = useActivityStore();
  const { user } = useAuthStore();
  const messages = chats[activityId] || [];
  
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if(!msg.trim()) return;
    addMessage(activityId, {
      id: Date.now().toString(),
      sender: user?.name || 'Invitado',
      text: msg,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      isMe: true
    });
    setMsg('');
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[70vh]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-green-600 text-white">
          <h2 className="font-bold text-lg truncate">Chat: {activityTitle}</h2>
          <button onClick={onClose} className="text-green-100 hover:text-white"><X size={24} /></button>
        </div>
        
        <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900/50 overflow-y-auto flex flex-col gap-4">
          <div className="text-center text-xs text-slate-400 my-2">Hoy</div>
          
          {messages.map(m => (
            <div key={m.id} className={`${m.isMe ? 'bg-green-100 dark:bg-green-900/40 rounded-tr-sm self-end border-green-200 dark:border-green-800/50' : 'bg-white dark:bg-slate-800 rounded-tl-sm self-start border-slate-100 dark:border-slate-700'} p-3 rounded-2xl shadow-sm max-w-[80%] border`}>
              {!m.isMe && <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-1">{m.sender}</p>}
              <p className={`text-sm ${m.isMe ? 'text-green-900 dark:text-green-100' : ''}`}>{m.text}</p>
              <span className="text-[10px] text-slate-400 block mt-1 text-right">{m.time}</span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
           <input 
             type="text" 
             value={msg}
             onChange={e => setMsg(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSend()}
             placeholder="Escribe un mensaje..." 
             className="flex-1 border p-3 rounded-full dark:bg-slate-800 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-green-500"
           />
           <button onClick={handleSend} className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full flex items-center justify-center transition-colors">
             <Send size={20} className="ml-1" />
           </button>
        </div>
      </div>
    </div>
  );
}
