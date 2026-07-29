export function ActivityFilters({ activeCategory, onCategoryChange, viewMode, onViewModeChange }: { activeCategory: string, onCategoryChange: (cat: string) => void, viewMode: 'list' | 'map', onViewModeChange: (mode: 'list' | 'map') => void }) {
  const categories = ['all', 'Fútbol', 'Tenis', 'Pádel', 'Básquet', 'Ciclismo', 'Running', 'Gym', 'Café', 'Comer', 'Cine', 'Paseo'];
  
  return (
    <div className="flex justify-between items-center gap-3 py-3 sm:py-4 relative z-30 w-full bg-transparent">
      {/* Scrollable Container with Masking */}
      <div className="relative flex-1 min-w-0">
        {/* Fade masks (left and right) para transición limpia con bg-slate-900/50 */}
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        
        <div className="flex overflow-x-auto scrollbar-none whitespace-nowrap gap-2 w-full py-1 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer border border-transparent ${activeCategory === cat ? 'bg-green-600 text-white shadow-md' : 'bg-slate-200/50 text-slate-700 hover:bg-slate-300/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700/50'}`}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* View Mode Toggle */}
      <div className="flex bg-slate-200/50 dark:bg-slate-800 rounded-xl p-1 shrink-0 border border-slate-300/30 dark:border-slate-700/50">
        <button 
          onClick={() => onViewModeChange('map')}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${viewMode === 'map' ? 'bg-white text-green-600 shadow-sm dark:bg-slate-900 dark:text-green-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Mapa
        </button>
        <button 
          onClick={() => onViewModeChange('list')}
          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${viewMode === 'list' ? 'bg-white text-green-600 shadow-sm dark:bg-slate-900 dark:text-green-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Lista
        </button>
      </div>
    </div>
  );
}
