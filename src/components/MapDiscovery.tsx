import React, { useState } from 'react';
import { MapPin, Navigation, Star, Store, Layers } from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

export const MapDiscovery: React.FC = () => {
  const { businesses, setActiveBusiness } = useDirectory();
  const [selectedMapBiz, setSelectedMapBiz] = useState(businesses[0] || null);

  return (
    <div className="relative w-full h-[520px] bg-neutral-100 flex flex-col md:flex-row overflow-hidden border-2 border-black">
      {/* Map Graphic Canvas */}
      <div className="relative flex-1 h-full bg-[#f4f3ef] overflow-hidden">
        {/* Subtle Map Grid lines simulating Ottawa/Orléans roads */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d5d3cc" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Main St. Joseph / HWY 174 curved road line */}
          <path d="M -50 120 Q 200 160 500 130 T 1100 180" fill="none" stroke="#e08e6d" strokeWidth="8" opacity="0.6" />
          {/* Ottawa River ribbon */}
          <path d="M -50 40 Q 250 80 600 50 T 1200 70" fill="none" stroke="#a7d5ed" strokeWidth="26" opacity="0.7" />
        </svg>

        {/* River Label */}
        <div className="absolute top-6 left-12 text-[11px] font-bold text-sky-800 tracking-widest uppercase pointer-events-none opacity-60">
          Ottawa River / Rivière des Outaouais · Petrie Island
        </div>

        {/* Road Label */}
        <div className="absolute top-36 left-28 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider pointer-events-none">
          St. Joseph Blvd & Regional Rd 174 Corridor
        </div>

        {/* Business Markers on Canvas */}
        {businesses.map((b, idx) => {
          const isSelected = selectedMapBiz?.id === b.id;
          // Deterministic simulated coordinates across the map
          const leftPercent = 18 + (idx * 15) % 68;
          const topPercent = 25 + ((idx * 27) % 55);

          return (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setSelectedMapBiz(b);
              }}
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all p-1 group z-20 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-110'
              }`}
              title={b.name}
            >
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-none border-2 text-xs font-bold shadow-md transition-all ${
                isSelected 
                  ? 'bg-neutral-900 text-white border-yellow-400 ring-2 ring-yellow-400'
                  : 'bg-white text-neutral-900 border-black hover:border-yellow-400'
              }`}>
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-yellow-400' : 'text-red-600'}`} />
                <span className="max-w-[100px] truncate">{b.name}</span>
              </div>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs p-2 border-2 border-black rounded-none text-[11px] text-neutral-600 z-10 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-red-600 inline-block" />
            <span>Local Business</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-1.5 bg-[#e08e6d] inline-block" />
            <span>St. Joseph Blvd</span>
          </div>
        </div>
      </div>

      {/* Selected Business Preview Panel */}
      {selectedMapBiz && (
        <div className="w-full md:w-80 bg-white border-t-2 md:border-t-0 md:border-l-2 border-black p-4 flex flex-col justify-between shrink-0 z-20">
          <div>
            <div className="relative h-28 w-full overflow-hidden mb-3 bg-neutral-100 border-2 border-black">
              <img
                src={selectedMapBiz.photos[0]}
                alt={selectedMapBiz.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-medium">
                {selectedMapBiz.category}
              </span>
            </div>

            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{selectedMapBiz.rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal">({selectedMapBiz.reviewCount} reviews)</span>
            </div>

            <h3 className="font-bold text-base text-neutral-900 leading-snug">
              {selectedMapBiz.name}
            </h3>

            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="truncate">{selectedMapBiz.address}</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t-2 border-black flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveBusiness(selectedMapBiz)}
              className="flex-1 py-1.5 text-xs font-semibold bg-neutral-900 hover:border-yellow-400 text-white rounded-none border-2 border-black transition-colors cursor-pointer text-center"
            >
              View Profile
            </button>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(selectedMapBiz.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 border-2 border-black hover:border-yellow-400 bg-neutral-50 text-neutral-700 cursor-pointer"
              title="Google Maps"
            >
              <Navigation className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
