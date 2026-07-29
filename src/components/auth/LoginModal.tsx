import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { X, Mail, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FAMOUS_NAMES = ['Elon Musk', 'Bill Gates', 'Steve Jobs', 'Lionel Messi', 'Michael Jordan', 'Cristiano Ronaldo', 'Rafael Nadal'];

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { loginAsGuest } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Set random famous name on mount
  useEffect(() => {
    const randomName = FAMOUS_NAMES[Math.floor(Math.random() * FAMOUS_NAMES.length)];
    setGuestName(`${randomName} #${Math.floor(Math.random() * 1000)}`);
  }, []);

  const handleGuest = () => {
    if (guestName.trim()) {
      loginAsGuest(guestName);
      onClose();
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email.trim()) return;
    
    setIsEmailLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    
    setIsEmailLoading(false);
    
    if (error) {
      alert(error.message);
    } else {
      setEmailSent(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm text-left">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <X size={24} />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-2">Bienvenido a SportSquad</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Elige cómo deseas continuar para unirte o crear actividades.</p>
          
          {emailSent ? (
            <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/50 text-center flex flex-col items-center">
              <CheckCircle className="text-green-500 mb-3" size={48} />
              <h3 className="font-bold text-lg text-green-800 dark:text-green-400 mb-2">¡Revisa tu correo!</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Hemos enviado un enlace mágico a <strong>{email}</strong>. Haz clic en él para iniciar sesión.</p>
            </div>
          ) : (
            <>
              <button 
                onClick={async () => {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: window.location.origin }
                  });
                  if (error) alert(error.message);
                }} 
                className="w-full bg-white border border-slate-300 text-slate-700 font-bold py-3 rounded-lg flex justify-center items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm mb-4 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
                <span className="text-sm text-slate-400 font-medium">o con correo</span>
                <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
              </div>

              <form onSubmit={handleEmailLogin} className="mb-6">
                <div className="mb-4">
                  <input 
                    type="email" 
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>
                <button disabled={isEmailLoading} type="submit" className="w-full bg-slate-900 dark:bg-green-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-slate-800 dark:hover:bg-green-500 transition-colors disabled:opacity-70 shadow-md">
                  {isEmailLoading ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                  {isEmailLoading ? 'Enviando enlace...' : 'Enviar enlace mágico'}
                </button>
              </form>
            </>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            <span className="text-sm text-slate-400 font-medium">Invitados</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <label className="block text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">Tu nombre de jugador (Editable)</label>
            <input 
              type="text" 
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-yellow-500 outline-none mb-3 font-medium transition-all"
            />
            <button onClick={handleGuest} className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold py-2.5 rounded-lg flex justify-center items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm">
              <Zap size={18} className="text-yellow-500 fill-yellow-500" />
              Jugar como Invitado
            </button>
            <p className="text-xs text-center text-slate-500 mt-3 italic">
              Los invitados solo pueden unirse a 1 evento y no pueden crear actividades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
