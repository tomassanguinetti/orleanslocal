import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Heart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Business } from '../types';
import { useDirectory } from '../context/DirectoryContext';

interface BusinessProfileModalProps {
  business: Business;
  onClose: () => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({ business, onClose }) => {
  const { isSaved, toggleSaveBusiness, showToast } = useDirectory();
  const saved = isSaved(business.id);
  const [activeTab, setActiveTab] = useState<'about' | 'hours' | 'services'>('about');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: business.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-none border-2 border-black shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="p-3 sm:p-3.5 border-b-2 border-black flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-neutral-800 truncate">{business.category}</span>
            <span aria-hidden="true" className="text-neutral-400">·</span>
            <span className="text-xs font-mono font-semibold text-neutral-600">{business.priceLevel}</span>
            {business.verified && (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border-2 border-black">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => toggleSaveBusiness(business.id)}
              className="p-1 rounded-none border-2 border-black hover:border-yellow-400 bg-white text-neutral-600 hover:text-red-600 cursor-pointer transition-colors"
              title={saved ? 'Remove from saved' : 'Save place'}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="p-1 rounded-none border-2 border-black hover:border-yellow-400 bg-white text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-none border-2 border-black hover:border-yellow-400 bg-white text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reduced Compact Photo (fits in one screen without scrolling) */}
        <div className="relative h-28 sm:h-36 w-full bg-neutral-100 overflow-hidden shrink-0">
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs ${
              business.isOpenNow ? 'bg-emerald-600 text-white' : 'bg-black/70 text-neutral-300'
            }`}>
              {business.isOpenNow ? `Open Now · Closes ${business.closingTime || 'Evening'}` : 'Closed Now'}
            </span>
            <div className="flex items-center gap-1 bg-black/70 px-2 py-0.5 text-xs text-white backdrop-blur-xs">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold">{business.rating.toFixed(1)}</span>
              <span className="text-[11px] text-neutral-300">({business.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Title and Address Row */}
        <div className="p-3 sm:p-4 pb-2 border-b-2 border-black shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
            {business.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{business.address}</span>
            <span aria-hidden="true" className="text-neutral-400">·</span>
            <span className="text-neutral-500 shrink-0">{business.distanceKm} km</span>
          </div>
        </div>

        {/* Tab Buttons (About, Hours, Services) */}
        <div className="flex border-b-2 border-black px-3 sm:px-4 bg-neutral-50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'border-black text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            About & Story
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'hours'
                ? 'border-black text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Hours & Contact
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'services'
                ? 'border-black text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Services & Features
          </button>
        </div>

        {/* Tab Content Area (no extra scrolling needed) */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 text-xs">
          {activeTab === 'about' && (
            <div className="space-y-2.5">
              <p className="text-neutral-800 leading-relaxed font-normal text-xs sm:text-sm">
                {business.longDescription || business.description}
              </p>
              {business.tags && business.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {business.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] border-2 border-black">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1 text-[11px] bg-neutral-50 p-2.5 border-2 border-black">
                <div><span className="font-semibold">Mon:</span> {business.hours?.monday || '9:00 AM - 5:00 PM'}</div>
                <div><span className="font-semibold">Tue:</span> {business.hours?.tuesday || '9:00 AM - 5:00 PM'}</div>
                <div><span className="font-semibold">Wed:</span> {business.hours?.wednesday || '9:00 AM - 5:00 PM'}</div>
                <div><span className="font-semibold">Thu:</span> {business.hours?.thursday || '9:00 AM - 6:00 PM'}</div>
                <div><span className="font-semibold">Fri:</span> {business.hours?.friday || '9:00 AM - 6:00 PM'}</div>
                <div><span className="font-semibold">Sat:</span> {business.hours?.saturday || '10:00 AM - 4:00 PM'}</div>
                <div className="col-span-2"><span className="font-semibold">Sun:</span> {business.hours?.sunday || 'Closed'}</div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <a
                  href={`tel:${business.phone}`}
                  className="flex-1 py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-center font-medium border-2 border-black flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{business.phone}</span>
                </a>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-2 bg-neutral-900 hover:border-yellow-400 text-white text-center font-medium border-2 border-black flex items-center justify-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-2.5">
              <div>
                <span className="block font-bold text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                  Offered Services
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(business.services || ['Consultation', 'Standard Service']).map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-neutral-50 border-2 border-black text-neutral-800 text-xs">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="block font-bold text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                  Amenities & Features
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(business.features || ['Free Wi-Fi', 'Parking']).map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-emerald-50 border-2 border-black text-emerald-800 text-xs">
                      • {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 bg-neutral-50 border-t-2 border-black flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-neutral-500">
            Est. {business.yearEstablished}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold border-2 border-black hover:border-yellow-400 bg-white text-neutral-700 rounded-none cursor-pointer"
            >
              Close
            </button>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold bg-neutral-900 hover:border-yellow-400 border-2 border-black text-white rounded-none cursor-pointer flex items-center gap-1"
            >
              <span>Get Directions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
