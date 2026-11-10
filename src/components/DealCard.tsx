import React from 'react';
import { Tag, Calendar, ArrowRight, Store, CheckCircle2 } from 'lucide-react';
import { Deal } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface DealCardProps {
  deal: Deal;
  compact?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, compact = false }) => {
  const { setSelectedDeal } = useDirectory();

  if (compact) {
    return (
      <article
        onClick={() => setSelectedDeal(deal)}
        className="group cursor-pointer bg-white rounded-none border-2 border-black hover:border-yellow-400 transition-all p-3.5 flex items-center gap-4 hover:shadow-xs"
      >
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none overflow-hidden bg-neutral-100 shrink-0 relative">
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute top-1 left-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500 text-neutral-950 uppercase">
            {deal.discount}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-0.5">
            <span className="font-semibold text-neutral-800 flex items-center gap-1">
              <Store className="w-3 h-3 text-neutral-400" />
              {deal.businessName}
            </span>
            <span aria-hidden="true">·</span>
            <span>{deal.category}</span>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-red-700 transition-colors truncate">
            {deal.title}
          </h3>

          <p className="text-xs text-neutral-400 mt-0.5 font-normal flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{deal.expiryDate}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-none border-2 border-black group-hover:border-yellow-400 transition-colors">
            <span>View Deal</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => setSelectedDeal(deal)}
      className="group cursor-pointer bg-white rounded-none border-2 border-black hover:border-yellow-400 transition-all flex flex-col overflow-hidden hover:shadow-sm"
    >
      {/* Photo Container */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-neutral-100">
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap z-10">
          <span className="px-2.5 py-0.5 rounded-none bg-amber-500 text-neutral-950 text-xs font-bold shadow-xs uppercase tracking-wider">
            {deal.discount}
          </span>
          <span className="px-2 py-0.5 rounded-none bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
            {deal.category}
          </span>
        </div>

        {/* Expiry Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded-none text-[11px] font-medium bg-black/65 text-neutral-200 backdrop-blur-xs flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-300" />
            <span>{deal.expiryDate}</span>
          </span>
        </div>
      </div>

      {/* Card Content - NOTE: No description on card, as requested */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
            <Store className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="font-semibold text-neutral-800 truncate">{deal.businessName}</span>
          </div>

          <h3 className="font-bold text-base text-neutral-900 group-hover:text-red-700 transition-colors line-clamp-2">
            {deal.title}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs text-neutral-500">
          {deal.code ? (
            <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 border-2 border-black">
              Code: {deal.code}
            </span>
          ) : (
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Direct In-Store
            </span>
          )}

          <span className="font-medium text-neutral-800 shrink-0 ml-2 group-hover:text-red-700 flex items-center gap-1">
            <span>Claim</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
};
