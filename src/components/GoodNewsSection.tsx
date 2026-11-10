import React from 'react';
import { Newspaper, Clock, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';
import { EditorialStory } from '../types';

export const GoodNewsSection: React.FC = () => {
  const { editorialStories, setSelectedStory } = useDirectory();

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'LOCAL SPOTLIGHT':
        return 'bg-amber-500/10 text-amber-800 border-amber-500/20';
      case 'COMMUNITY':
        return 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20';
      case 'SUSTAINABILITY':
        return 'bg-teal-500/10 text-teal-800 border-teal-500/20';
      case 'NEW OPENING':
        return 'bg-blue-500/10 text-blue-800 border-blue-500/20';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const featuredStory = editorialStories[0];
  const sideStories = editorialStories.slice(1, 4);

  return (
    <section className="py-14 sm:py-18 bg-neutral-100/50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight font-momo">
              Good Things Happening Locally
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mt-2 font-medium font-momo">
              Celebrating the founders, artists, and neighbours bringing energy to Orléans
            </p>
          </div>

          <div className="text-xs font-semibold text-neutral-400">
            Updated weekly by local editors
          </div>
        </div>

        {/* Editorial Layout: Large Featured Story on Left + Stack of Stories on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Featured Article (7 cols) - Large Polaroid Style */}
          {featuredStory && (
            <article
              onClick={() => setSelectedStory(featuredStory)}
              className="lg:col-span-7 bg-white rounded-[3px] p-3 sm:p-4 pb-6 sm:pb-7 border border-stone-200/80 shadow-[0_6px_24px_-4px_rgba(28,25,23,0.14)] hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer group relative -rotate-[0.5deg] hover:rotate-0"
            >
              {/* Washi Tape Strip on Top Left */}
              <div 
                className="absolute -top-3 left-8 w-20 h-5 bg-[repeating-linear-gradient(45deg,#FDE047,#FDE047_6px,#FEF08A_6px,#FEF08A_12px)] border-l border-r border-dashed border-amber-300 opacity-90 shadow-2xs z-20 pointer-events-none rounded-[1px] -rotate-3" 
                aria-hidden="true"
              />

              <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-[2px] bg-stone-100 ring-1 ring-black/10">
                <img
                  src={featuredStory.image}
                  alt={featuredStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[13px] font-bold tracking-wider uppercase border backdrop-blur-md ${getTagColor(featuredStory.tag)} bg-white/95 font-sans`}>
                  {featuredStory.tag}
                </span>
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/90 drop-shadow-md">
                  {featuredStory.date} • {featuredStory.readTime}
                </span>
              </div>

              {/* Polaroid Bottom Chin */}
              <div className="pt-4 px-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-marker text-2xl sm:text-[33px] font-bold text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors">
                    {featuredStory.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed font-momo">
                    {featuredStory.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-dashed border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-500">
                    By {featuredStory.author}
                  </span>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors">
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Right Column: 3 Secondary Stories (5 cols) + Yellow Sticky Note */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {sideStories.map((story, i) => (
              <article
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="bg-white rounded-[3px] p-3 border border-stone-200/80 shadow-[0_3px_12px_rgba(28,25,23,0.08)] hover:shadow-md transition-all duration-200 cursor-pointer group flex gap-3.5 items-center relative"
              >
                {/* Polaroid Miniature Photo */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2px] overflow-hidden shrink-0 bg-stone-100 ring-1 ring-black/10 relative">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${getTagColor(story.tag)} font-sans`}>
                      {story.tag}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {story.readTime}
                    </span>
                  </div>

                  <h4 className="font-marker text-base sm:text-lg font-bold text-stone-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {story.title}
                  </h4>

                  <div className="mt-1 text-[11px] text-stone-500 font-medium flex items-center justify-between">
                    <span>By {story.author}</span>
                    <span className="text-amber-700 font-bold group-hover:underline">Read →</span>
                  </div>
                </div>
              </article>
            ))}

            {/* Collage Post-It Sticky Note (Directly inspired by reference collage) */}
            <div className="mt-2 bg-[#FEF08A] rounded-sm p-4 border border-amber-300 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] rotate-1 relative">
              {/* Top Washi Tape */}
              <div className="w-14 h-4 -top-2 left-8 absolute bg-amber-200/90 -rotate-3 border-l border-r border-dashed border-amber-400 shadow-2xs" />
              <p className="font-marker text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                Good Food Builds Strong Communities ♡
              </p>
              <p className="text-xs text-amber-900 mt-1 font-momo font-medium flex items-center gap-1.5">
                <span>Shop Local</span>
                <span>•</span>
                <span>Support Local</span>
                <span>•</span>
                <span>Keep Orléans Awesome</span>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
