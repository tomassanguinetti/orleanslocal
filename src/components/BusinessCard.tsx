import React from 'react';
import { Star, CheckCircle2, ArrowRight, MapPin } from 'lucide-react';
import { Business } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface BusinessCardProps {
  business: Business;
  compact?: boolean;
  wireframe?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, compact = false }) => {
  const { setActiveBusiness } = useDirectory();

  if (compact) {
    return (
      <article
        onClick={() => setActiveBusiness(business)}
        className="group cursor-pointer bg-white rounded-none border-2 border-black hover:border-yellow-400 transition-all p-3.5 flex items-center gap-4 hover:shadow-xs"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none overflow-hidden bg-neutral-100 shrink-0">
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-0.5">
            <span className="font-medium text-neutral-700">{business.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{business.priceLevel}</span>
            {business.verified && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-0.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </>
            )}
          </div>

          <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-red-700 transition-colors truncate">
            {business.name}
          </h3>

          <p className="text-xs text-neutral-500 truncate mt-0.5 font-normal">
            {business.address}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-none border-2 border-black">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{business.rating.toFixed(1)}</span>
          </div>
          <span className="block text-[11px] text-neutral-400 mt-1">
            {business.distanceKm} km
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => setActiveBusiness(business)}
      className="group cursor-pointer bg-white rounded-none border-2 border-black hover:border-yellow-400 transition-all flex flex-col overflow-hidden hover:shadow-sm"
    >
      {/* Photo Container */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-neutral-100">
        <img
          src={business.photos[0]}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
          <span className="px-2 py-0.5 rounded-none bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
            {business.category}
          </span>
          {business.verified && (
            <span className="px-2 py-0.5 rounded-none bg-emerald-600 text-white text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Bottom Open Status */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className={`px-2 py-0.5 rounded-none text-[11px] font-medium backdrop-blur-xs ${
            business.isOpenNow ? 'bg-emerald-900/80 text-emerald-200' : 'bg-black/60 text-neutral-300'
          }`}>
            {business.isOpenNow ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Card Content - NO description on card */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-neutral-900 group-hover:text-red-700 transition-colors line-clamp-1">
              {business.name}
            </h3>
            <span className="text-xs font-mono font-semibold text-neutral-600 shrink-0">
              {business.priceLevel}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
            <div className="flex items-center gap-1 text-amber-700 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{business.rating.toFixed(1)}</span>
              <span className="text-neutral-400 font-normal">({business.reviewCount})</span>
            </div>
            <span aria-hidden="true">·</span>
            <span className="truncate">{business.subcategory || business.category}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{business.address}</span>
          </span>

          <span className="font-medium text-neutral-800 shrink-0 ml-2 group-hover:text-red-700 flex items-center gap-1">
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
};
