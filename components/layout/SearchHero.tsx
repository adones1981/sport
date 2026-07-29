import { Activity, LogIn, Bike, Dumbbell, Coffee, Utensils, Music, Footprints, Ticket, User, Settings, LogOut, ChevronDown, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { LoginModal } from '../auth/LoginModal';

export function SearchHero({ onLocationSelect }: { onLocationSelect?: (loc: any) => void }) {
  const { user, logout, isLoginModalOpen, setIsLoginModalOpen } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async () => {
    if(!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=cl`);
      const data = await res.json();
      setPlaces(data);
    } catch(e) {
      console.error(e);
    }
    setIsSearching(false);
  };
  
  const handleSelect = (place: any) => {
    if (onLocationSelect) onLocationSelect(place);
    setPlaces([]);
    setQuery(place.display_name.split(',')[0]);
  };
  
  const avatarUrl = user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` : '';

  return (
    <div className="bg-gradient-to-b from-green-700 to-green-600 text-white pt-4 pb-16 px-4 shadow-md relative shrink-0 z-40">
      {/* Fondo de marcas de agua aislando el overflow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10 flex flex-wrap justify-around items-center gap-10 p-2" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => {
            const icons = [Bike, Dumbbell, Coffee, Utensils, Music, Footprints, Ticket, Activity];
            const Icon = icons[i % icons.length];
            return <Icon key={i} size={48} style={{ transform: `rotate(${(i * 43) % 360}deg)` }} />
          })}
        </div>
      </div>

      {/* Navbar / Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-6 relative z-50">
        <div className="flex items-center gap-3 cursor-pointer select-none">
          {/* Isotipo con Badge Circular */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/80 border border-emerald-500/30 shadow-sm backdrop-blur-sm">
            <Activity className="w-6 h-6 text-emerald-400 stroke-[2.5]"/>
          </div>

          {/* Tipografía diferenciada */}
          <span className="text-2xl tracking-tight text-white drop-shadow-md">
            <span className="font-medium">Sport</span>
            <span className="font-black text-emerald-400">Squad</span>
          </span>
        </div>
        
        <div>
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 bg-green-800/40 hover:bg-green-800/60 p-1 pr-3 rounded-full border border-green-500/50 transition-colors">
                <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border-2 border-green-400 bg-white" />
                <span className="font-medium text-sm hidden sm:inline text-white">{user.name}</span>
                <ChevronDown size={16} className="text-green-200" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl py-2 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 z-[100] animate-in fade-in slide-in-from-top-2">
                   <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mi Cuenta</p>
                     <p className="text-sm font-medium truncate">{user.name}</p>
                   </div>
                   <Link href="/profile" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 text-sm font-medium transition-colors"><Activity size={16} className="text-blue-500"/> Mis Actividades</Link>
                   <Link href="/profile" onClick={() => setDropdownOpen(false)} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 text-sm font-medium transition-colors"><User size={16} className="text-green-500"/> Perfil</Link>
                   <button className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 text-sm font-medium transition-colors"><Settings size={16} className="text-slate-500"/> Configuración</button>
                   <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                     <button onClick={() => { logout(); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm font-bold transition-colors"><LogOut size={16}/> Cerrar Sesión</button>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-white text-green-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2 text-sm"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Entrar con Google / Invitado</span>
              <span className="sm:hidden">Entrar</span>
            </button>
          )}
        </div>
      </div>

      <div className="text-center relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left flex-1 hidden md:block">
           <h1 className="text-3xl font-bold mb-1 drop-shadow-sm">Encuentra tu próximo partido</h1>
           <p className="text-green-50 text-sm">Únete a actividades o crea la tuya al instante.</p>
        </div>
        
        {/* Barra de búsqueda oscura y compacta */}
        <div className="w-full flex-1 flex flex-col sm:flex-row gap-2 justify-end items-center relative z-20">
          <div className="relative w-full sm:w-2/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar parque, zona..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900 text-white placeholder-gray-400 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-xl text-base transition-all"
            />
            {places.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-2xl overflow-y-auto max-h-60 text-slate-800 dark:text-white">
                 {places.map(place => (
                   <button 
                     key={place.place_id} 
                     onClick={() => handleSelect(place)}
                     className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b last:border-0 dark:border-slate-700 text-sm flex items-start gap-2"
                   >
                     <MapPin size={16} className="text-red-500 mt-1 shrink-0"/>
                     <span>{place.display_name}</span>
                   </button>
                 ))}
               </div>
             )}
          </div>
          <button onClick={handleSearch} className="w-full sm:w-auto bg-white text-green-700 px-6 py-2.5 rounded-xl font-bold text-base hover:bg-gray-100 transition-colors shadow-xl flex items-center justify-center gap-2">
            {isSearching && <span className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></span>}
            Buscar
          </button>
        </div>
      </div>

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </div>
  );
}
