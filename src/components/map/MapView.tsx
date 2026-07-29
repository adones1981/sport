'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

const getCategoryEmoji = (category: string) => {
  switch(category) {
    case 'Fútbol': return '⚽';
    case 'Tenis': return '🎾';
    case 'Pádel': return '🏸';
    case 'Básquet': return '🏀';
    case 'Ciclismo': return '🚲';
    case 'Running': return '🏃';
    case 'Gym': return '🏋️';
    case 'Café': return '☕';
    case 'Comer': return '🍽️';
    case 'Cine': return '🎬';
    case 'Paseo': return '🌳';
    default: return '📍';
  }
};

export function MapView({ activities, onActivityClick, selectedActivityId, searchedLocation, onCreateAtLocation }: { activities: any[], onActivityClick?: (act: any) => void, selectedActivityId?: number, searchedLocation?: any, onCreateAtLocation?: (loc: any) => void }) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const searchMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Basic CSS for dark popup injection
    const css = `
      .leaflet-popup-content-wrapper { background: transparent; box-shadow: none; padding: 0; }
      .leaflet-popup-tip-container { display: none; }
      .leaflet-popup-content { margin: 0; width: auto !important; }
    `;
    const styleId = 'leaflet-dark-popup-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = css;
      document.head.appendChild(style);
    }

    if (typeof window !== 'undefined' && containerRef.current && !mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: false // Move zoom control to bottom left so it doesn't overlap FAB
      }).setView([-33.4489, -70.6693], 13);
      
      L.control.zoom({ position: 'bottomleft' }).addTo(mapRef.current);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(mapRef.current);
    }
    
    if (mapRef.current) {
      // Clear old markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      activities.forEach(act => {
        if(act.lat && act.lng) {
          const isActive = act.id === selectedActivityId;
          const emoji = getCategoryEmoji(act.category);
          const icon = L.divIcon({
            html: `
              <div class="relative w-8 h-8 flex items-center justify-center">
                ${isActive ? '<div class="absolute inset-[-4px] bg-green-500 rounded-full animate-ping opacity-60"></div>' : ''}
                <div style="font-size: 20px; text-align: center; line-height: 28px; background: white; border-radius: 50%; width: 28px; height: 28px; box-shadow: 0 3px 6px rgba(0,0,0,0.3); border: 2px solid ${isActive ? '#22c55e' : '#16a34a'}; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" class="relative z-10 ${isActive ? 'scale-110' : ''}">
                  ${emoji}
                </div>
              </div>
            `,
            className: 'custom-emoji-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          const popupHtml = `
            <div class="bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 w-64 overflow-hidden mb-2 pointer-events-auto">
              <div class="p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border border-green-500/20">${act.category}</span>
                </div>
                <h3 class="font-bold text-base mb-2 leading-tight">${act.title}</h3>
                <div class="flex items-center gap-2 text-slate-300 text-xs mb-3 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700">
                  <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(act.participants[0] || 'Creador')}&background=random&size=24" class="w-5 h-5 rounded-full" />
                  <span class="font-medium">${act.participants[0] || 'Usuario anónimo'}</span>
                </div>
                <div class="space-y-1.5 mb-4">
                  <div class="text-xs text-slate-400 flex items-center gap-1.5">
                    <span class="text-blue-400">📅</span> ${new Date(act.date).toLocaleDateString()} a las ${act.time}
                  </div>
                  <div class="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                    <span class="text-red-400">📍</span> ${act.locationName}
                  </div>
                  <div class="text-xs font-bold text-yellow-500 flex items-center gap-1.5">
                    <span>👥</span> ${act.participants?.length || 0}/${act.maxParticipants} unidos
                  </div>
                </div>
                <button id="btn-join-${act.id}" class="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg">
                  Ver detalles / Unirme
                </button>
              </div>
            </div>
          `;

          const marker = L.marker([act.lat, act.lng], { icon })
            .bindPopup(popupHtml, {
              minWidth: 256,
              offset: [0, -10],
              autoPanPadding: [50, 50]
            })
            .addTo(mapRef.current!);
            
          marker.on('popupopen', () => {
             const btn = document.getElementById(`btn-join-${act.id}`);
             if (btn) {
               btn.onclick = () => {
                  marker.closePopup();
                  if (onActivityClick) onActivityClick(act);
               }
             }
          });
            
          markersRef.current.push(marker);
        }
      });
    }
  }, [activities, onActivityClick, selectedActivityId]);

  useEffect(() => {
    if (mapRef.current && searchedLocation) {
      const { lat, lon, display_name, isUserLocation } = searchedLocation;
      mapRef.current.flyTo([lat, lon], 15, { animate: true, duration: 1.5 });
      
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
      }

      const icon = L.divIcon({
        html: `
          <div class="relative w-10 h-10 flex items-center justify-center">
            <div class="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-50"></div>
            <div style="font-size: 24px; text-align: center; line-height: 36px; background: white; border-radius: 50%; width: 36px; height: 36px; box-shadow: 0 4px 10px rgba(0,0,0,0.4); border: 3px solid #3b82f6;" class="relative z-10">
              ${isUserLocation ? '👤' : '📍'}
            </div>
          </div>
        `,
        className: 'custom-search-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Find nearby activities (within ~100 meters, roughly 0.001 degrees)
      const nearbyActivities = activities.filter(act => {
        const dLat = Math.abs(act.lat - lat);
        const dLng = Math.abs(act.lng - lon);
        return dLat < 0.001 && dLng < 0.001;
      });

      const popupHtml = `
        <div class="bg-slate-900 text-white rounded-xl shadow-2xl border border-blue-500/30 w-64 overflow-hidden pointer-events-auto">
          <div class="p-4 text-center">
            <div class="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span class="text-2xl">${isUserLocation ? '👤' : '📍'}</span>
            </div>
            <h3 class="font-bold text-sm mb-1">${isUserLocation ? 'Tu Ubicación' : 'Ubicación Buscada'}</h3>
            <p class="text-xs text-slate-400 mb-4 line-clamp-2">${display_name}</p>
            
            ${nearbyActivities.length > 0 ? `
              <div class="bg-slate-800/50 rounded-lg p-2 mb-3 text-left">
                <p class="text-xs font-bold text-green-400 mb-2">¡Hay ${nearbyActivities.length} actividad(es) aquí!</p>
                ${nearbyActivities.slice(0, 2).map((act, i) => `
                  <button id="btn-search-join-${i}" class="w-full text-left bg-slate-800 hover:bg-slate-700 p-2 rounded border border-slate-700 mb-1 transition-colors">
                    <p class="text-xs font-bold truncate">${act.title}</p>
                    <p class="text-[10px] text-slate-400 truncate">${act.category} • ${act.time}</p>
                  </button>
                `).join('')}
                ${nearbyActivities.length > 2 ? `<p class="text-[10px] text-slate-400 text-center mt-1">Y ${nearbyActivities.length - 2} más...</p>` : ''}
              </div>
            ` : ''}

            <button id="btn-create-here" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-2">
              <span class="text-lg">+</span> Crear otra actividad
            </button>
          </div>
        </div>
      `;

      searchMarkerRef.current = L.marker([lat, lon], { icon, zIndexOffset: 1000 })
        .bindPopup(popupHtml, { minWidth: 256, offset: [0, -15], autoPanPadding: [50, 50] })
        .addTo(mapRef.current);
        
      searchMarkerRef.current.on('popupopen', () => {
         const btnCreate = document.getElementById('btn-create-here');
         if (btnCreate) {
           btnCreate.onclick = () => {
             searchMarkerRef.current?.closePopup();
             if (onCreateAtLocation) onCreateAtLocation(searchedLocation);
           }
         }
         
         nearbyActivities.slice(0, 2).forEach((act, i) => {
           const btnJoin = document.getElementById(`btn-search-join-${i}`);
           if (btnJoin) {
             btnJoin.onclick = () => {
               searchMarkerRef.current?.closePopup();
               if (onActivityClick) onActivityClick(act);
             }
           }
         });
      });
      
      // Open popup automatically
      setTimeout(() => {
        searchMarkerRef.current?.openPopup();
      }, 1500);
    }
  }, [searchedLocation, onCreateAtLocation]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full z-0" 
    />
  );
}
