'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const getCategoryEmoji = (category: string) => {
  switch(category) {
    case 'Fútbol': return '⚽';
    case 'Tenis': return '🎾';
    case 'Pádel': return '🎾';
    case 'Básquet': return '🏀';
    case 'Ciclismo': return '🚲';
    case 'Running': return '🏃';
    case 'Gym': return '🏋️';
    case 'Completada': return '🌭';
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
      if ((mapRef.current as any)._markerCluster) {
        mapRef.current.removeLayer((mapRef.current as any)._markerCluster);
      } else {
        markersRef.current.forEach(marker => marker.remove());
      }
      markersRef.current = [];

      const locationCounts = new Map<string, number>();
      
      if (!(L as any).markerClusterGroup) {
        if (typeof window !== 'undefined') {
          (window as any).L = L;
        }
        // Dynamically inject markercluster CSS if not already added
        if (!document.getElementById('markercluster-css')) {
          const baseUrl = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/';
          ['MarkerCluster.css', 'MarkerCluster.Default.css'].forEach(file => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = baseUrl + file;
            link.id = file === 'MarkerCluster.css' ? 'markercluster-css' : 'markercluster-default-css';
            document.head.appendChild(link);
          });
        }
        require('leaflet.markercluster');
      }

      const clusterGroup = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        iconCreateFunction: function(cluster: any) {
          return L.divIcon({ 
            html: `<div class="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-xl border-2 border-white transform transition-transform hover:scale-110">+${cluster.getChildCount()}</div>`, 
            className: 'custom-cluster-icon', 
            iconSize: L.point(40, 40) 
          });
        }
      });
      (mapRef.current as any)._markerCluster = clusterGroup;

      activities.forEach(act => {
        if(act.lat && act.lng) {
          const locKey = `${act.lat.toFixed(4)},${act.lng.toFixed(4)}`;
          const count = locationCounts.get(locKey) || 0;
          locationCounts.set(locKey, count + 1);
          
          let renderLat = act.lat;
          let renderLng = act.lng;
          
          if (count > 0) {
            const angle = count * (Math.PI / 3);
            const distance = 0.00015;
            renderLat += Math.cos(angle) * distance;
            renderLng += Math.sin(angle) * distance;
          }

          const isActive = act.id === selectedActivityId;
          const emoji = getCategoryEmoji(act.category);
          const icon = L.divIcon({
            html: `
              <div class="relative w-8 h-8 flex items-center justify-center drop-shadow-xl">
                ${isActive ? '<div class="absolute inset-[-4px] bg-green-500 rounded-full animate-ping opacity-60"></div>' : ''}
                <div style="font-size: 20px; text-align: center; line-height: 28px; background: white; border-radius: 50%; width: 28px; height: 28px; box-shadow: 0 4px 8px rgba(0,0,0,0.4); border: 2px solid ${isActive ? '#22c55e' : '#16a34a'}; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" class="relative z-10 ${isActive ? 'scale-110' : ''}">
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

          const marker = L.marker([renderLat, renderLng], { icon })
            .bindPopup(popupHtml, {
              minWidth: 256,
              offset: [0, -10],
              autoPanPadding: [50, 50]
            });
            
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
          clusterGroup.addLayer(marker);
        }
      });
      
      mapRef.current.addLayer(clusterGroup);
      
      // Mantenemos el centro predeterminado en lugar de ajustar los límites a todas las actividades.
      // Así respetamos la decisión del usuario de iniciar en Santiago o en su ubicación.
    }
  }, [activities, onActivityClick, selectedActivityId]);

  useEffect(() => {
    if (mapRef.current && searchedLocation) {
      const { lat, lon } = searchedLocation;
      mapRef.current.flyTo([lat, lon], 15, { animate: true, duration: 1.5 });
      
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
    }
  }, [searchedLocation]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full z-0" 
    />
  );
}
