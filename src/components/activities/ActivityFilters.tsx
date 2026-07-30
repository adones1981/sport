import { Map, List, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import { CATEGORY_GROUPS } from '@/lib/categories';

export function ActivityFilters({ activeCategory, onCategoryChange, viewMode, onViewModeChange, dateFilter, onDateFilterChange }: { activeCategory: string, onCategoryChange: (cat: string) => void, viewMode: 'list' | 'map', onViewModeChange: (mode: 'list' | 'map') => void, dateFilter?: string, onDateFilterChange?: (date: string) => void }) {
  const filterOptions = [
    { id: 'all', label: 'Todos' },
    ...Object.values(CATEGORY_GROUPS).map(g => ({ id: `group:${g.name}`, label: `${g.emoji} ${g.name}` }))
  ];
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scrollByAmount = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3 sm:py-4 relative z-30 w-full bg-transparent">
      {/* Scrollable Container Carousel */}
      <div className="relative flex-1 min-w-0 w-full flex items-center">
        {showLeftScroll && (
          <div className="absolute left-0 z-20 flex items-center h-full pointer-events-none">
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white dark:from-slate-900 to-transparent" />
            <button onClick={() => scrollByAmount(-150)} className="relative pointer-events-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-md p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
              <ChevronLeft size={18} />
            </button>
          </div>
        )}
        
        <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto scrollbar-none whitespace-nowrap gap-2 w-full py-1 hide-scrollbar" style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          paddingLeft: showLeftScroll ? '28px' : '4px',
          paddingRight: showRightScroll ? '28px' : '4px',
        }}>
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}} />
          {filterOptions.map(option => (
            <button 
              key={option.id} 
              onClick={() => onCategoryChange(option.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-colors cursor-pointer border border-transparent ${activeCategory === option.id ? 'bg-green-600 text-white shadow-md' : 'bg-slate-200/50 text-slate-700 hover:bg-slate-300/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:border-slate-700/50'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {showRightScroll && (
          <div className="absolute right-0 z-20 flex items-center h-full pointer-events-none">
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white dark:from-slate-900 to-transparent" />
            <button onClick={() => scrollByAmount(150)} className="relative pointer-events-auto bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-md p-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex w-full sm:w-auto items-center gap-2 justify-between sm:justify-end shrink-0">
        {/* Date Filter */}
        {onDateFilterChange && (
          <div className="relative flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-slate-500" />
            </div>
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="appearance-none w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-sm"
            >
              <option value="all">Cualquier día</option>
              <option value="today">Hoy</option>
              <option value="weekend">Fin de Semana</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800 rounded-xl p-1.5 shrink-0 border border-slate-300/50 dark:border-slate-700 w-1/2 sm:w-auto justify-center">
          <button 
            onClick={() => onViewModeChange('map')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 rounded-lg text-sm font-bold transition-colors w-1/2 sm:w-auto justify-center ${viewMode === 'map' ? 'bg-white text-green-600 shadow-md dark:bg-slate-900 dark:text-green-400 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <Map size={18} /> Mapa
          </button>
          <button 
            onClick={() => onViewModeChange('list')}
            className={`flex items-center gap-2 px-3 sm:px-6 py-2 rounded-lg text-sm font-bold transition-colors w-1/2 sm:w-auto justify-center ${viewMode === 'list' ? 'bg-white text-green-600 shadow-md dark:bg-slate-900 dark:text-green-400 scale-[1.02]' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
            <List size={18} /> Lista
          </button>
        </div>
      </div>
    </div>
  );
}
