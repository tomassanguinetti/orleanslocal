import React from 'react';
import { X, Smile, MapPin, Clock, DollarSign, ExternalLink, Phone, CheckCircle2 } from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

export const KidsModal: React.FC = () => {
  const { selectedKidActivity, setSelectedKidActivity, showToast } = useDirectory();

  if (!selectedKidActivity) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Activity link copied to clipboard!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setSelectedKidActivity(null)}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-none border-2 border-black shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-3 sm:p-4 border-b-2 border-black flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold bg-cyan-600 text-white uppercase tracking-wider rounded-none">
              {selectedKidActivity.categoryLabel}
            </span>
            <span className="text-xs font-semibold text-neutral-800">
              {selectedKidActivity.ageRange}
            </span>
            {selectedKidActivity.isFree && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 border border-emerald-500">
                FREE
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSelectedKidActivity(null)}
            className="p-1 rounded-none border-2 border-black hover:border-yellow-400 bg-white text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Hero Photo */}
        <div className="relative h-36 sm:h-44 w-full bg-neutral-100 overflow-hidden shrink-0">
          <img
            src={selectedKidActivity.image}
            alt={selectedKidActivity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 text-white text-[11px] font-mono flex items-center gap-1 backdrop-blur-xs">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>{selectedKidActivity.location}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
              {selectedKidActivity.title}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {selectedKidActivity.address}
            </p>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-neutral-50 border-2 border-black rounded-none">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-0.5">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                <span>Schedule & Hours</span>
              </div>
              <p className="text-neutral-600 font-normal text-[11px] leading-tight">
                {selectedKidActivity.schedule}
              </p>
            </div>

            <div className="p-2.5 bg-neutral-50 border-2 border-black rounded-none">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 mb-0.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admission / Cost</span>
              </div>
              <p className="text-neutral-600 font-normal text-[11px] leading-tight">
                {selectedKidActivity.pricing}
              </p>
            </div>
          </div>

          {/* Key Features */}
          {selectedKidActivity.features && selectedKidActivity.features.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Highlights & Amenities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedKidActivity.features.map((feat, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-cyan-50 text-cyan-950 px-2 py-0.5 border border-cyan-300 rounded-none"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-600" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description - Exclusively inside this expanded popup */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              About This Activity
            </span>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
              {selectedKidActivity.longDescription || selectedKidActivity.description}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-neutral-50 border-t-2 border-black flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {selectedKidActivity.phone && (
              <a
                href={`tel:${selectedKidActivity.phone}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold border-2 border-black hover:border-yellow-400 bg-white text-neutral-800 rounded-none cursor-pointer transition-colors"
                title={`Call ${selectedKidActivity.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-neutral-600" />
                <span className="hidden sm:inline">{selectedKidActivity.phone}</span>
                <span className="sm:hidden">Call</span>
              </a>
            )}
            <button
              type="button"
              onClick={handleShare}
              className="px-2.5 py-1.5 text-xs font-semibold border-2 border-black hover:border-yellow-400 bg-white text-neutral-700 rounded-none cursor-pointer transition-colors"
            >
              Share
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedKidActivity(null)}
              className="px-3 py-1.5 text-xs font-semibold border-2 border-black hover:border-yellow-400 bg-white text-neutral-700 rounded-none cursor-pointer transition-colors"
            >
              Close
            </button>
            {selectedKidActivity.website && (
              <a
                href={selectedKidActivity.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 hover:border-yellow-400 border-2 border-black text-white rounded-none transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Visit Program</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
