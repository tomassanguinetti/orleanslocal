import React from 'react';
import { MapPin, Clock, DollarSign, ArrowRight, Smile } from 'lucide-react';
import { KidsActivity } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface KidsCardProps {
  activity: KidsActivity;
  compact?: boolean;
  viewMode?: 'grid' | 'list';
}

export const KidsCard: React.FC<KidsCardProps> = ({ 
  activity, 
  compact = false,
  viewMode = 'grid' 
}) => {
  const { setSelectedKidActivity } = useDirectory();

  if (viewMode === 'list') {
    return (
      <article 
        onClick={() => setSelectedKidActivity(activity)}
        className="group relative bg-white border-2 border-black hover:border-yellow-400 rounded-none p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-neutral-100 border-2 border-black overflow-hidden rounded-none">
            <img 
              src={activity.image} 
              alt={activity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
            />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-1.5 py-0.5 border border-cyan-300">
                {activity.categoryLabel}
              </span>
              <span className="text-xs font-semibold text-neutral-800">
                {activity.ageRange}
              </span>
              {activity.isFree && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1 py-0.5 border border-emerald-400">
                  FREE
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-cyan-700 truncate leading-snug">
              {activity.title}
            </h3>

            <div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span className="truncate">{activity.location}</span>
              </span>
              <span className="text-neutral-300">·</span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                <span>{activity.pricing}</span>
              </span>
            </div>
          </div>
        </div>

        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedKidActivity(activity);
          }}
          className="self-end sm:self-center shrink-0 px-3 py-1.5 bg-neutral-900 text-white group-hover:bg-cyan-600 text-xs font-semibold rounded-none border-2 border-black hover:border-yellow-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </article>
    );
  }

  return (
    <article 
      onClick={() => setSelectedKidActivity(activity)}
      className="group relative bg-white border-2 border-black hover:border-yellow-400 rounded-none overflow-hidden flex flex-col transition-all cursor-pointer shadow-xs"
    >
      {/* Photo */}
      <div className={`relative w-full ${compact ? 'h-32' : 'h-40 sm:h-44'} bg-neutral-100 overflow-hidden shrink-0`}>
        <img 
          src={activity.image} 
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
        />
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-neutral-900 border border-black uppercase tracking-wider shadow-xs">
            {activity.categoryLabel}
          </span>
          {activity.isFree && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white border border-black shadow-xs">
              FREE
            </span>
          )}
        </div>

        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 text-white text-[11px] font-mono backdrop-blur-xs">
          {activity.ageRange}
        </div>
      </div>

      {/* Content without descriptions on card face */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin className="w-3 h-3 text-cyan-600 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-cyan-700 leading-snug line-clamp-2">
            {activity.title}
          </h3>
        </div>

        {/* Bottom Details Row */}
        <div className="pt-2 border-t-2 border-black flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-neutral-700 font-medium truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{activity.pricing}</span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedKidActivity(activity);
            }}
            style={{ backgroundColor: '#ffff00' }}
            className="shrink-0 px-2.5 py-1 text-neutral-900 border-2 border-black hover:border-yellow-400 text-xs font-semibold rounded-none transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
