import React, { useState } from 'react';
import { LostFoundItem } from '../types';
import { CATEGORY_COLORS, STATUS_STYLES } from '../utils/helpers';
import { MapPin, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';

interface MapViewProps {
  items: LostFoundItem[];
  onSelectItem: (item: LostFoundItem) => void;
}

export const MapView: React.FC<MapViewProps> = ({ items, onSelectItem }) => {
  const [activePin, setActivePin] = useState<LostFoundItem | null>(null);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col h-full min-h-[500px]">
      
      {/* Map Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-600" /> Interactive Campus Facility Map
          </h3>
          <p className="text-xs text-slate-500">
            Click on any location pin to see reported lost or found items in that zone.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-slate-600">Found ({items.filter(i => i.status === 'Found').length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
            <span className="text-slate-600">Lost ({items.filter(i => i.status === 'Lost').length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400 shadow-sm" />
            <span className="text-slate-600">Returned</span>
          </div>
        </div>
      </div>

      {/* Stylized Visual Map Canvas */}
      <div className="flex-1 w-full bg-slate-100 rounded-2xl relative border border-slate-200 overflow-hidden min-h-[420px] select-none shadow-inner bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
        
        {/* Campus Map Zones */}
        <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] bg-blue-100/60 rounded-3xl border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-800/70 pointer-events-none">
          North Academic Sector
        </div>

        <div className="absolute top-[10%] right-[10%] w-[35%] h-[40%] bg-emerald-100/60 rounded-3xl border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800/70 pointer-events-none">
          Library & Commons
        </div>

        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[35%] bg-amber-100/60 rounded-3xl border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-800/70 pointer-events-none">
          Sports & Rec Complex
        </div>

        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-100/60 rounded-3xl border border-purple-200 flex items-center justify-center text-xs font-bold text-purple-800/70 pointer-events-none">
          Student Union & Cafe
        </div>

        {/* Central Campus Walkway */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-12 bg-slate-200/80 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 tracking-widest uppercase pointer-events-none">
          Central Plaza Walkway
        </div>

        {/* Render Map Item Pins */}
        {items.map((item) => {
          const categoryStyle = CATEGORY_COLORS[item.category];
          const isFound = item.status === 'Found';
          const isReturned = item.status === 'Returned';
          const isActive = activePin?.id === item.id;

          const pinBg = isReturned
            ? 'bg-slate-500 border-slate-300'
            : isFound
            ? 'bg-emerald-600 border-emerald-200'
            : 'bg-red-600 border-red-200';

          return (
            <div
              key={item.id}
              style={{
                left: `${item.coordinates.x}%`,
                top: `${item.coordinates.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              {/* Pin Icon Button */}
              <button
                onClick={() => setActivePin(item)}
                className={`group relative p-2 rounded-full border-2 text-white shadow-lg transition-transform duration-200 hover:scale-125 ${pinBg} ${
                  isActive ? 'scale-125 ring-4 ring-blue-400 z-20' : ''
                }`}
              >
                <MapPin className="w-4 h-4 fill-white" />

                {/* Hover Quick Label */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30 shadow-md">
                  {item.title}
                </span>
              </button>

              {/* Popup Card when Pin is active */}
              {isActive && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white p-4 rounded-2xl shadow-xl border border-slate-200 w-64 z-30 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${categoryStyle.bg} ${categoryStyle.text}`}>
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePin(null);
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>

                  <h5 className="font-bold text-slate-900 text-sm mb-1 truncate">
                    {item.title}
                  </h5>
                  <p className="text-xs text-slate-500 mb-2 truncate">
                    {item.location}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setActivePin(null);
                        onSelectItem(item);
                      }}
                      className="w-full py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
};
