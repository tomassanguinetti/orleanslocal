import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  ChevronDown, 
  Store, 
  Tag, 
  Calendar as CalendarIcon, 
  Newspaper, 
  Users, 
  Smile, 
  ArrowRight,
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react';

interface HomeHeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectTab: (tab: 'businesses' | 'deals' | 'events' | 'news' | 'groups' | 'kids') => void;
  onSearchSubmit: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectTab,
  onSearchSubmit,
}) => {
  const [browseOpen, setBrowseOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBrowseOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBrowseOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  const browseOptions = [
    {
      id: 'businesses' as const,
      label: 'Businesses',
      desc: 'Local shops, dining, health & services',
      icon: Store,
      color: 'bg-blue-600 text-white',
    },
    {
      id: 'deals' as const,
      label: 'Deals & Coupons',
      desc: 'Discounts & limited-time specials',
      icon: Tag,
      color: 'bg-amber-500 text-neutral-950',
    },
    {
      id: 'events' as const,
      label: 'Events Calendar',
      desc: 'Festivals, markets & live happenings',
      icon: CalendarIcon,
      color: 'bg-orange-600 text-white',
    },
    {
      id: 'news' as const,
      label: 'Local News',
      desc: 'Community stories & municipal watch',
      icon: Newspaper,
      color: 'bg-rose-600 text-white',
    },
    {
      id: 'groups' as const,
      label: 'Clubs & Groups',
      desc: 'Sports, hobby circles & volunteers',
      icon: Users,
      color: 'bg-purple-600 text-white',
    },
    {
      id: 'kids' as const,
      label: 'Kids Activities',
      desc: 'Splash pads, wave pools & youth sports',
      icon: Smile,
      color: 'bg-cyan-500 text-neutral-950',
    },
  ];

  return (
    <section 
      aria-label="Welcome to Orléans"
      className="relative w-full border-b-2 border-black overflow-hidden bg-neutral-900"
    >
      {/* Background Image with Cinematic Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 scale-105"
        style={{ backgroundImage: `url('/assets/images/orleans_hero.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/65 to-black/40" />

      {/* Decorative Grid Lines Overlay for retro-modern look */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        
        {/* Welcome Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-neutral-950 border-2 border-black text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-neutral-950 stroke-[2.5]" />
          <span>Welcome to Orléans, Ontario</span>
        </div>

        {/* Main Welcome Message */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight max-w-3xl mx-auto font-sans">
          Discover the Heart of Your Local Community
        </h1>
        
        <p className="text-sm sm:text-base text-neutral-200 mt-3 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xs">
          Your neighborhood directory for verified local businesses, community deals, upcoming events, breaking news, clubs, and family activities.
        </p>

        {/* Prominent Search Bar with Search and Browse Dropdown Button */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 p-1.5 bg-white/95 backdrop-blur-xs border-2 border-black shadow-lg">
            
            {/* Search Input */}
            <div className="relative flex-1 flex items-center min-w-0">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                placeholder="Search businesses, deals, events, news, groups, or kids fun..."
                className="w-full bg-transparent text-sm sm:text-base font-medium text-neutral-900 placeholder:text-neutral-400 pl-11 pr-8 py-3 rounded-none focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Action Buttons: Search & Browse Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 sm:border-l-2 border-black sm:pl-2">
              
              {/* Search Button */}
              <button
                type="button"
                onClick={onSearchSubmit}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs sm:text-sm border-2 border-black rounded-none transition-all cursor-pointer shadow-xs active:translate-y-0.5"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search</span>
              </button>

              {/* Browse Button with Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setBrowseOpen(!browseOpen)}
                  aria-expanded={browseOpen}
                  aria-haspopup="true"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm border-2 border-black rounded-none transition-all cursor-pointer shadow-xs"
                >
                  <Compass className="w-4 h-4 text-yellow-400" />
                  <span>Browse</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${browseOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {browseOpen && (
                  <div 
                    role="menu"
                    className="absolute right-0 sm:left-auto mt-2 w-72 sm:w-80 bg-white border-2 border-black shadow-2xl rounded-none z-50 text-left py-1 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3.5 py-2 border-b-2 border-black bg-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-600">
                        Explore Orléans Directory
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">6 Sections</span>
                    </div>

                    <div className="divide-y divide-neutral-100">
                      {browseOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setBrowseOpen(false);
                              onSelectTab(opt.id);
                            }}
                            className="w-full p-2.5 sm:p-3 flex items-start gap-3 hover:bg-yellow-50 transition-colors text-left cursor-pointer group"
                          >
                            <div className={`p-2 border-2 border-black shrink-0 ${opt.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-blue-700 transition-colors">
                                  {opt.label}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                              </div>
                              <p className="text-[11px] text-neutral-500 truncate mt-0.5 font-normal">
                                {opt.desc}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-5 flex items-center justify-center gap-1.5 flex-wrap text-xs text-neutral-300">
          <span className="text-neutral-400 text-[11px] font-semibold uppercase tracking-wider mr-1">
            Quick Links:
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('Bakery');
              onSearchSubmit();
            }}
            className="px-2.5 py-1 bg-black/60 hover:bg-neutral-900 text-white text-[11px] font-medium border border-neutral-700 hover:border-yellow-400 rounded-none transition-colors cursor-pointer"
          >
            🥖 Bakeries
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('Petrie Island');
              onSearchSubmit();
            }}
            className="px-2.5 py-1 bg-black/60 hover:bg-neutral-900 text-white text-[11px] font-medium border border-neutral-700 hover:border-yellow-400 rounded-none transition-colors cursor-pointer"
          >
            🏖️ Petrie Island
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('kids');
            }}
            className="px-2.5 py-1 bg-black/60 hover:bg-neutral-900 text-white text-[11px] font-medium border border-neutral-700 hover:border-yellow-400 rounded-none transition-colors cursor-pointer"
          >
            🏊 Ray Friel Wave Pool
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('events');
            }}
            className="px-2.5 py-1 bg-black/60 hover:bg-neutral-900 text-white text-[11px] font-medium border border-neutral-700 hover:border-yellow-400 rounded-none transition-colors cursor-pointer"
          >
            🍎 Farmers Market
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectTab('deals');
            }}
            className="px-2.5 py-1 bg-black/60 hover:bg-neutral-900 text-white text-[11px] font-medium border border-neutral-700 hover:border-yellow-400 rounded-none transition-colors cursor-pointer"
          >
            🏷️ 25% Off Deals
          </button>
        </div>

      </div>
    </section>
  );
};
