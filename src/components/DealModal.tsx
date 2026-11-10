import React, { useState } from 'react';
import { X, Tag, Calendar, Copy, Check, Store, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

export const DealModal: React.FC = () => {
  const { selectedDeal, setSelectedDeal, showToast } = useDirectory();
  const [copied, setCopied] = useState(false);

  if (!selectedDeal) return null;

  const handleCopyCode = () => {
    if (!selectedDeal.code) return;
    navigator.clipboard.writeText(selectedDeal.code);
    setCopied(true);
    showToast(`Coupon code ${selectedDeal.code} copied!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRedeem = () => {
    showToast(`Deal claimed for ${selectedDeal.businessName}! Show to cashier.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white rounded-none border-2 border-black shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-3 sm:p-4 border-b-2 border-black flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-neutral-950 uppercase tracking-wider rounded-none">
              {selectedDeal.discount}
            </span>
            <span className="text-xs font-medium text-neutral-600">
              {selectedDeal.category}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedDeal(null)}
            className="p-1 rounded-none border-2 border-black hover:border-yellow-400 bg-white text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Hero Photo */}
        <div className="relative h-36 sm:h-44 w-full bg-neutral-100 overflow-hidden shrink-0">
          <img
            src={selectedDeal.image}
            alt={selectedDeal.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[11px] font-mono flex items-center gap-1 backdrop-blur-xs">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Expires: {selectedDeal.expiryDate}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3 overflow-y-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
              <Store className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-900">{selectedDeal.businessName}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
              {selectedDeal.title}
            </h2>
          </div>

          {/* Full description - only here in expanded popup */}
          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal">
            {selectedDeal.description}
          </p>

          {/* Promo Code Box or In-Store Notice */}
          {selectedDeal.code ? (
            <div className="p-3 bg-neutral-50 border-2 border-black rounded-none flex items-center justify-between gap-3">
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                  Discount Promo Code
                </span>
                <span className="font-mono text-base font-bold text-neutral-900 tracking-wider">
                  {selectedDeal.code}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:border-yellow-400 text-white rounded-none border-2 border-black transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border-2 border-black rounded-none text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct In-Store Offer: Mention this deal at checkout.</span>
            </div>
          )}

          {/* Terms & Conditions */}
          {selectedDeal.terms && (
            <div className="pt-2 border-t-2 border-black">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-0.5">
                Terms & Conditions
              </span>
              <p className="text-[11px] text-neutral-500 font-normal leading-normal">
                {selectedDeal.terms}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-neutral-50 border-t-2 border-black flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedDeal(null)}
            className="px-3.5 py-1.5 text-xs font-semibold border-2 border-black hover:border-yellow-400 bg-white text-neutral-700 rounded-none cursor-pointer transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleRedeem}
            className="px-4 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 hover:border-yellow-400 border-2 border-black text-neutral-950 rounded-none transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Redeem In-Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
