import React from 'react';
import { X, Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

export const StoryModal: React.FC = () => {
  const { selectedStory, setSelectedStory } = useDirectory();

  if (!selectedStory) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={() => setSelectedStory(null)}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-none border-2 border-black shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b-2 border-black flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold bg-neutral-900 text-white uppercase tracking-wider">
              {selectedStory.tag || 'EDITORIAL'}
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              {selectedStory.readTime || '3 min read'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedStory(null)}
            className="p-1 rounded-none border-2 border-black hover:border-yellow-400 bg-white text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-44 sm:h-56 w-full bg-neutral-100 overflow-hidden shrink-0">
          <img
            src={selectedStory.image}
            alt={selectedStory.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>{selectedStory.author}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>{selectedStory.date}</span>
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-bold text-neutral-900 leading-tight">
              {selectedStory.title}
            </h1>
          </div>

          {/* Full Content */}
          <div className="text-neutral-700 text-xs sm:text-sm leading-relaxed space-y-3 font-normal whitespace-pre-line border-t-2 border-black pt-3">
            {selectedStory.content || selectedStory.summary}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-neutral-50 border-t-2 border-black flex items-center justify-between shrink-0">
          <span className="text-xs text-neutral-500">
            Orléans Local Community Desk
          </span>
          <button
            type="button"
            onClick={() => setSelectedStory(null)}
            className="px-4 py-1.5 text-xs font-semibold bg-neutral-900 hover:border-yellow-400 border-2 border-black text-white rounded-none cursor-pointer transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
