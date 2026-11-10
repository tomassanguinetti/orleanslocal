import React, { useState, useMemo } from 'react';
import { 
  Home as HomeIcon,
  Store, 
  Tag, 
  Calendar as CalendarIcon, 
  Newspaper, 
  Users, 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  Map as MapIcon, 
  CalendarDays, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw,
  Star,
  ArrowUpDown,
  Percent,
  Sparkles,
  Smile
} from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';
import { BusinessCard } from './BusinessCard';
import { DealCard } from './DealCard';
import { KidsCard } from './KidsCard';
import { AnnouncementsGallery } from './AnnouncementsGallery';
import { HomeHero } from './HomeHero';
import { FilterSidebar } from './FilterSidebar';
import { MapDiscovery } from './MapDiscovery';
import { Business, CommunityEvent, LocalNewsItem, CommunityGroup, EditorialStory, Deal, KidsActivity } from '../types';

export const HomePage: React.FC = () => {
  const { 
    businesses, 
    events: contextEvents,
    newsItems, 
    editorialStories, 
    groups: contextGroups,
    deals,
    kidsActivities,
    setSelectedDeal,
    setSelectedKidActivity,
    filters, 
    setFilters, 
    resetFilters,
    setActiveBusiness,
    setSelectedStory,
    showToast,
    currentView,
    setCurrentView
  } = useDirectory();

  // 7 Primary Tabs with Home as default
  type TabType = 'home' | 'businesses' | 'deals' | 'events' | 'news' | 'groups' | 'kids';
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (currentView === 'deals') return 'deals';
    if (currentView === 'events') return 'events';
    if (currentView === 'news') return 'news';
    if (currentView === 'groups') return 'groups';
    if (currentView === 'businesses') return 'businesses';
    if (currentView === 'kids') return 'kids';
    return 'home';
  });

  React.useEffect(() => {
    if (currentView === 'home') setActiveTab('home');
    else if (currentView === 'deals') setActiveTab('deals');
    else if (currentView === 'events') setActiveTab('events');
    else if (currentView === 'news') setActiveTab('news');
    else if (currentView === 'groups') setActiveTab('groups');
    else if (currentView === 'businesses') setActiveTab('businesses');
    else if (currentView === 'kids') setActiveTab('kids');
  }, [currentView]);

  // View modes per tab
  const [bizViewMode, setBizViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [dealsViewMode, setDealsViewMode] = useState<'grid' | 'list'>('grid');
  const [eventsViewMode, setEventsViewMode] = useState<'list' | 'calendar'>('list');
  const [groupsViewMode, setGroupsViewMode] = useState<'grid' | 'list'>('grid');
  const [kidsViewMode, setKidsViewMode] = useState<'grid' | 'list'>('grid');

  // Search input on top of list results
  const searchQuery = filters.searchQuery || '';
  const setSearchQuery = (q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
  };

  // ---------------------------------------------------------------------------
  // FILTER STATES (Buttons only, no dropdown menus)
  // ---------------------------------------------------------------------------
  // Businesses tab filters
  const [selectedBizCategory, setSelectedBizCategory] = useState<string>('all');
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<string>('all');
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [selectedDistance, setSelectedDistance] = useState<string>('all');
  const [userPostalCode] = useState<string>('K1C 1T1');

  // Deals tab filters
  const [selectedDealCategory, setSelectedDealCategory] = useState<string>('all');
  const [dealsMinDiscount, setDealsMinDiscount] = useState<boolean>(false);

  // Events tab filters
  const [selectedEventTimeframe, setSelectedEventTimeframe] = useState<'all' | 'today' | 'tomorrow' | 'weekend'>('all');
  const [selectedEventCategory, setSelectedEventCategory] = useState<string>('all');
  const [freeEventsOnly, setFreeEventsOnly] = useState<boolean>(false);
  const [calendarSelectedDay, setCalendarSelectedDay] = useState<number | null>(null);

  // News tab filters
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>('all');

  // Groups tab filters
  const [selectedGroupCategory, setSelectedGroupCategory] = useState<string>('all');
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [rsvpdEventIds, setRsvpdEventIds] = useState<string[]>([]);

  // ---------------------------------------------------------------------------
  // CATEGORIES & DATA
  // ---------------------------------------------------------------------------
  const bizCategories = [
    { id: 'all', label: 'All Categories' },
    { id: 'food-drink', label: 'Food & Drink' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'health-wellness', label: 'Health & Wellness' },
    { id: 'home-garden', label: 'Home Services' },
  ];

  const bizCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: businesses.length };
    businesses.forEach((b) => {
      if (b.categorySlug) {
        counts[b.categorySlug] = (counts[b.categorySlug] || 0) + 1;
      }
    });
    return counts;
  }, [businesses]);

  const hasSideFilter = (['businesses', 'events', 'groups', 'kids'] as TabType[]).includes(activeTab);

  const dealCategories = [
    { id: 'all', label: 'All Deals' },
    { id: 'Food & Drink', label: 'Food & Drink' },
    { id: 'Shopping & Retail', label: 'Shopping & Retail' },
    { id: 'Services & Auto', label: 'Services & Auto' },
    { id: 'Health & Fitness', label: 'Health & Fitness' },
  ];

  const neighbourhoodsList = [
    { id: 'all', label: 'All Areas' },
    { id: 'Orléans', label: 'Orléans' },
    { id: 'Cumberland', label: 'Cumberland' },
    { id: 'Centretown', label: 'Centretown' },
    { id: 'Westboro', label: 'Westboro' },
    { id: 'The Glebe', label: 'The Glebe' },
  ];

  const eventCategories = [
    { id: 'all', label: 'All Events' },
    { id: 'Markets', label: 'Markets' },
    { id: 'Music', label: 'Music & Concerts' },
    { id: 'Outdoors', label: 'Outdoors' },
    { id: 'Festivals', label: 'Festivals' },
  ];

  const newsCategories = [
    { id: 'all', label: 'All Topics' },
    { id: 'Local Spotlight', label: 'Spotlight' },
    { id: 'Sustainability', label: 'Sustainability' },
    { id: 'Business', label: 'Local Business' },
    { id: 'Community', label: 'Community' },
    { id: 'Events', label: 'Events' },
  ];

  const groupCategories = [
    { id: 'all', label: 'All Groups' },
    { id: 'Sports & Outdoors', label: 'Sports & Outdoors' },
    { id: 'Arts & Crafts', label: 'Arts & Crafts' },
    { id: 'Parents & Families', label: 'Parents & Families' },
  ];

  // ---------------------------------------------------------------------------
  // FILTERED DATASETS
  // ---------------------------------------------------------------------------
  // 1. Businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          (b.neighbourhood && b.neighbourhood.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedBizCategory !== 'all' && b.categorySlug !== selectedBizCategory) {
        return false;
      }
      if (selectedNeighbourhood !== 'all') {
        if (!b.neighbourhood || !b.neighbourhood.toLowerCase().includes(selectedNeighbourhood.toLowerCase())) {
          return false;
        }
      }
      if (selectedDistance !== 'all') {
        const maxDist = parseFloat(selectedDistance);
        if (b.distanceKm > maxDist) return false;
      }
      if (openNowOnly && !b.isOpenNow) return false;
      if (minRating > 0 && b.rating < minRating) return false;
      if (selectedPrice !== 'all' && b.priceLevel !== selectedPrice) return false;
      if (verifiedOnly && !b.verified) return false;

      return true;
    });
  }, [businesses, searchQuery, selectedBizCategory, selectedNeighbourhood, selectedDistance, openNowOnly, minRating, selectedPrice, verifiedOnly]);

  // 2. Deals
  const filteredDeals = useMemo(() => {
    return (deals || []).filter((d) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          d.title.toLowerCase().includes(q) ||
          d.businessName.toLowerCase().includes(q) ||
          d.discount.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          (d.code && d.code.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedDealCategory !== 'all' && d.category !== selectedDealCategory) {
        return false;
      }
      if (dealsMinDiscount) {
        const pctMatch = d.discount.match(/(\d+)%/);
        if (pctMatch && parseInt(pctMatch[1], 10) < 20) {
          return false;
        }
      }
      return true;
    });
  }, [deals, searchQuery, selectedDealCategory, dealsMinDiscount]);

  // 3. Events
  const filteredEvents = useMemo(() => {
    return (contextEvents || []).filter((e) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedEventCategory !== 'all') {
        if (!e.category.toLowerCase().includes(selectedEventCategory.toLowerCase())) return false;
      }
      if (selectedDistance !== 'all') {
        const loc = e.location.toLowerCase();
        let dist = 2.0;
        if (loc.includes('cumberland')) dist = 6.5;
        else if (loc.includes('shenkman')) dist = 1.2;
        else if (loc.includes('petrie') || loc.includes('trim')) dist = 3.5;
        else if (loc.includes('ray friel')) dist = 1.8;
        else if (loc.includes('innes')) dist = 3.8;
        if (dist > parseFloat(selectedDistance)) return false;
      }
      if (freeEventsOnly && !e.isFree) return false;
      if (selectedEventTimeframe === 'today' && e.dayNumber !== 12) return false;
      if (selectedEventTimeframe === 'tomorrow' && e.dayNumber !== 18) return false;
      if (selectedEventTimeframe === 'weekend' && ![12, 18, 20, 26].includes(e.dayNumber || 0)) return false;
      if (calendarSelectedDay !== null && e.dayNumber !== calendarSelectedDay) return false;

      return true;
    });
  }, [contextEvents, searchQuery, selectedEventCategory, selectedDistance, freeEventsOnly, selectedEventTimeframe, calendarSelectedDay]);

  // 4. News
  interface UnifiedNews {
    id: string;
    title: string;
    category: string;
    summary: string;
    content?: string;
    image: string;
    date: string;
    author: string;
    readTime: string;
    isStory: boolean;
  }

  const unifiedNewsList = useMemo<UnifiedNews[]>(() => {
    const list: UnifiedNews[] = [];

    editorialStories.forEach((s) => {
      list.push({
        id: s.id,
        title: s.title,
        category: s.tag || 'Spotlight',
        summary: s.summary,
        content: s.content,
        image: s.image,
        date: s.date,
        author: s.author,
        readTime: s.readTime,
        isStory: true,
      });
    });

    newsItems.forEach((n) => {
      if (!list.some((existing) => existing.title.toLowerCase() === n.title.toLowerCase())) {
        list.push({
          id: n.id,
          title: n.title,
          category: n.category || 'Community',
          summary: n.summary,
          image: n.image,
          date: n.date,
          author: n.location || 'Local News Desk',
          readTime: '2 min read',
          isStory: false,
        });
      }
    });

    return list.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          item.title.toLowerCase().includes(q) ||
          item.author.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedNewsCategory !== 'all') {
        const cat = selectedNewsCategory.toLowerCase();
        const itemCat = item.category.toLowerCase();
        if (!itemCat.includes(cat)) return false;
      }
      return true;
    });
  }, [editorialStories, newsItems, searchQuery, selectedNewsCategory]);

  // 5. Groups
  const filteredGroups = useMemo(() => {
    return (contextGroups || []).filter((g) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          g.name.toLowerCase().includes(q) ||
          g.location.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedGroupCategory !== 'all') {
        if (!g.category.toLowerCase().includes(selectedGroupCategory.toLowerCase())) return false;
      }
      if (selectedDistance !== 'all') {
        const loc = g.location.toLowerCase();
        let dist = 2.0;
        if (loc.includes('ray friel')) dist = 1.8;
        else if (loc.includes('shenkman')) dist = 1.2;
        else if (loc.includes('cumberland')) dist = 6.8;
        else if (loc.includes('petrie')) dist = 3.5;
        if (dist > parseFloat(selectedDistance)) return false;
      }
      return true;
    });
  }, [contextGroups, searchQuery, selectedGroupCategory, selectedDistance]);

  // 6. Kids & Family Activities
  const [selectedKidsCategory, setSelectedKidsCategory] = useState<string>('all');
  const [selectedKidsAgeGroup, setSelectedKidsAgeGroup] = useState<string>('all');
  const [kidsFreeOnly, setKidsFreeOnly] = useState<boolean>(false);
  const [kidsDropInOnly, setKidsDropInOnly] = useState<boolean>(false);

  const kidsCategories = [
    { id: 'all', label: 'All Activities' },
    { id: 'indoor_play', label: 'Indoor Play' },
    { id: 'sports_rec', label: 'Sports & Aquatics' },
    { id: 'parks_nature', label: 'Parks & Splash Pads' },
    { id: 'arts_theatre', label: 'Arts & Drama' },
    { id: 'stem_camps', label: 'STEM & Camps' },
    { id: 'library_storytime', label: 'Storytime & Library' },
  ];

  const kidsAgeGroups = [
    { id: 'all', label: 'All Ages' },
    { id: 'toddlers', label: 'Toddlers (0-3)' },
    { id: 'kids', label: 'Kids (4-7)' },
    { id: 'tweens', label: 'Tweens (8-14)' },
  ];

  const filteredKidsActivities = useMemo(() => {
    return kidsActivities.filter((act) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          act.title.toLowerCase().includes(q) ||
          act.categoryLabel.toLowerCase().includes(q) ||
          act.location.toLowerCase().includes(q) ||
          act.description.toLowerCase().includes(q) ||
          act.pricing.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedKidsCategory !== 'all' && act.category !== selectedKidsCategory) {
        return false;
      }
      if (selectedKidsAgeGroup !== 'all' && act.ageGroup !== selectedKidsAgeGroup && act.ageGroup !== 'all') {
        return false;
      }
      if (selectedDistance !== 'all') {
        const loc = (act.location + ' ' + act.address).toLowerCase();
        let dist = 2.0;
        if (loc.includes('centennial') || loc.includes('ray friel')) dist = 1.8;
        else if (loc.includes('shenkman') || loc.includes('cervantes')) dist = 1.2;
        else if (loc.includes('petrie') || loc.includes('trim')) dist = 3.2;
        else if (loc.includes('millennium') || loc.includes('innes')) dist = 4.5;
        else if (loc.includes('cumberland') || loc.includes('heritage')) dist = 7.1;
        else if (loc.includes('st. joseph') || loc.includes('library')) dist = 1.4;
        else if (loc.includes('youville') || loc.includes('convent')) dist = 2.2;
        if (dist > parseFloat(selectedDistance)) return false;
      }
      if (kidsFreeOnly && !act.isFree) {
        return false;
      }
      if (kidsDropInOnly && !act.isDropIn) {
        return false;
      }
      return true;
    });
  }, [kidsActivities, searchQuery, selectedKidsCategory, selectedKidsAgeGroup, selectedDistance, kidsFreeOnly, kidsDropInOnly]);

  // ---------------------------------------------------------------------------
  // SORTING STATE & SORTED DATASETS
  // ---------------------------------------------------------------------------
  const [sortBy, setSortBy] = useState<string>('default');

  const sortedKidsActivities = useMemo(() => {
    const list = [...filteredKidsActivities];
    if (sortBy === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [filteredKidsActivities, sortBy]);

  const sortedBusinesses = useMemo(() => {
    const list = [...filteredBusinesses];
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'reviews') list.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [filteredBusinesses, sortBy]);

  const sortedDeals = useMemo(() => {
    const list = [...filteredDeals];
    if (sortBy === 'discount') {
      list.sort((a, b) => {
        const pctA = parseInt(a.discount.match(/(\d+)%/)?.[1] || '0', 10);
        const pctB = parseInt(b.discount.match(/(\d+)%/)?.[1] || '0', 10);
        return pctB - pctA;
      });
    } else if (sortBy === 'claimed') {
      list.sort((a, b) => (b.claimedCount || 0) - (a.claimedCount || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [filteredDeals, sortBy]);

  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];
    if (sortBy === 'name') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [filteredEvents, sortBy]);

  const sortedNews = useMemo(() => {
    const list = [...unifiedNewsList];
    if (sortBy === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [unifiedNewsList, sortBy]);

  const sortedGroups = useMemo(() => {
    const list = [...filteredGroups];
    if (sortBy === 'members') list.sort((a, b) => b.members - a.members);
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [filteredGroups, sortBy]);

  const handleToggleJoin = (id: string, name: string) => {
    if (joinedGroupIds.includes(id)) {
      setJoinedGroupIds((prev) => prev.filter((g) => g !== id));
      showToast(`Left ${name}`);
    } else {
      setJoinedGroupIds((prev) => [...prev, id]);
      showToast(`Joined ${name}!`);
    }
  };

  const handleToggleRsvp = (id: string, title: string) => {
    if (rsvpdEventIds.includes(id)) {
      setRsvpdEventIds((prev) => prev.filter((e) => e !== id));
      showToast('RSVP cancelled.');
    } else {
      setRsvpdEventIds((prev) => [...prev, id]);
      showToast(`RSVP confirmed for "${title}"!`);
    }
  };

  const resetTabFilters = () => {
    setSearchQuery('');
    setSortBy('default');
    setSelectedDistance('all');
    if (activeTab === 'businesses') {
      setSelectedBizCategory('all');
      setSelectedNeighbourhood('all');
      setOpenNowOnly(false);
      setMinRating(0);
      setSelectedPrice('all');
      setVerifiedOnly(false);
    } else if (activeTab === 'deals') {
      setSelectedDealCategory('all');
      setDealsMinDiscount(false);
    } else if (activeTab === 'events') {
      setSelectedEventTimeframe('all');
      setSelectedEventCategory('all');
      setFreeEventsOnly(false);
      setCalendarSelectedDay(null);
    } else if (activeTab === 'news') {
      setSelectedNewsCategory('all');
    } else if (activeTab === 'groups') {
      setSelectedGroupCategory('all');
    } else if (activeTab === 'kids') {
      setSelectedKidsCategory('all');
      setSelectedKidsAgeGroup('all');
      setKidsFreeOnly(false);
      setKidsDropInOnly(false);
    }
    resetFilters();
  };

  const hasActiveFilters = useMemo(() => {
    if (searchQuery.trim()) return true;
    if (selectedDistance !== 'all') return true;
    if (activeTab === 'businesses') {
      return (
        selectedBizCategory !== 'all' ||
        selectedNeighbourhood !== 'all' ||
        openNowOnly ||
        minRating > 0 ||
        selectedPrice !== 'all' ||
        verifiedOnly
      );
    }
    if (activeTab === 'deals') {
      return selectedDealCategory !== 'all' || dealsMinDiscount;
    }
    if (activeTab === 'events') {
      return (
        selectedEventTimeframe !== 'all' ||
        selectedEventCategory !== 'all' ||
        freeEventsOnly ||
        calendarSelectedDay !== null
      );
    }
    if (activeTab === 'news') {
      return selectedNewsCategory !== 'all';
    }
    if (activeTab === 'groups') {
      return selectedGroupCategory !== 'all';
    }
    if (activeTab === 'kids') {
      return (
        selectedKidsCategory !== 'all' ||
        selectedKidsAgeGroup !== 'all' ||
        kidsFreeOnly ||
        kidsDropInOnly
      );
    }
    return false;
  }, [
    activeTab,
    searchQuery,
    selectedBizCategory,
    selectedNeighbourhood,
    openNowOnly,
    minRating,
    selectedPrice,
    verifiedOnly,
    selectedDealCategory,
    dealsMinDiscount,
    selectedEventTimeframe,
    selectedEventCategory,
    freeEventsOnly,
    calendarSelectedDay,
    selectedNewsCategory,
    selectedGroupCategory,
    selectedKidsCategory,
    selectedKidsAgeGroup,
    kidsFreeOnly,
    kidsDropInOnly,
    selectedDistance,
  ]);

  const currentCount = 
    activeTab === 'home' ? businesses.length + deals.length + kidsActivities.length :
    activeTab === 'businesses' ? filteredBusinesses.length :
    activeTab === 'deals' ? filteredDeals.length :
    activeTab === 'events' ? filteredEvents.length :
    activeTab === 'news' ? unifiedNewsList.length :
    activeTab === 'kids' ? filteredKidsActivities.length :
    filteredGroups.length;

  return (
    <div className="w-full bg-white min-h-screen">
      
      {/* 7 PRIMARY TABS (Home, Business, Deals, Events, News, Groups, Kids) */}
      <div 
        className="border-b-2 border-black sticky top-0 z-40"
        style={{ backgroundColor: '#4632f2' }}
      >
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: '#4632f2' }}
        >
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2.5">
            
            {/* 1. HOME TAB (DEFAULT - Emerald Theme) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('home');
                if (currentView !== 'home') setCurrentView('home');
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 hover:border-yellow-400 ${
                activeTab === 'home'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-emerald-700 ring-2 ring-emerald-300'
                  : 'bg-emerald-200 text-emerald-900 group-hover:bg-emerald-300'
              }`}>
                <HomeIcon className="w-3.5 h-3.5" />
              </span>
              <span>Home</span>
            </button>

            {/* 2. BUSINESS TAB (Blue Theme) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('businesses');
                if (currentView !== 'businesses') setCurrentView('businesses');
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 hover:border-yellow-400 ${
                activeTab === 'businesses'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-950 hover:bg-blue-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'businesses'
                  ? 'bg-white text-blue-600 ring-2 ring-blue-300'
                  : 'bg-blue-200 text-blue-900 group-hover:bg-blue-300'
              }`}>
                <Store className="w-3.5 h-3.5" />
              </span>
              <span>Business</span>
            </button>

            {/* 3. DEALS TAB (Amber Theme) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('deals');
                if (currentView !== 'deals') setCurrentView('deals');
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 hover:border-yellow-400 ${
                activeTab === 'deals'
                  ? 'bg-amber-500 text-neutral-950 shadow-xs'
                  : 'bg-amber-50 text-amber-950 hover:bg-amber-100 font-semibold'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'deals'
                  ? 'bg-neutral-950 text-amber-400 ring-2 ring-amber-300'
                  : 'bg-amber-200 text-amber-900 group-hover:bg-amber-300'
              }`}>
                <Tag className="w-3.5 h-3.5" />
              </span>
              <span>Deals</span>
            </button>

            {/* 4. EVENTS TAB (Orange Theme) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('events');
                if (currentView !== 'events') setCurrentView('events');
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 hover:border-yellow-400 ${
                activeTab === 'events'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 text-orange-950 hover:bg-orange-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'events'
                  ? 'bg-white text-orange-600 ring-2 ring-orange-300'
                  : 'bg-orange-200 text-orange-900 group-hover:bg-orange-300'
              }`}>
                <CalendarIcon className="w-3.5 h-3.5" />
              </span>
              <span>Events</span>
            </button>

            {/* 5. NEWS TAB (Rose Theme) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('news');
                if (currentView !== 'news') setCurrentView('news');
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 hover:border-yellow-400 ${
                activeTab === 'news'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-950 hover:bg-rose-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'news'
                  ? 'bg-white text-rose-600 ring-2 ring-rose-300'
                  : 'bg-rose-200 text-rose-900 group-hover:bg-rose-300'
              }`}>
                <Newspaper className="w-3.5 h-3.5" />
              </span>
              <span>News</span>
            </button>

            {/* 6. GROUPS TAB (Purple Theme) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('groups');
                if (currentView !== 'groups') setCurrentView('groups');
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 hover:border-yellow-400 ${
                activeTab === 'groups'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-950 hover:bg-purple-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'groups'
                  ? 'bg-white text-purple-600 ring-2 ring-purple-300'
                  : 'bg-purple-200 text-purple-900 group-hover:bg-purple-300'
              }`}>
                <Users className="w-3.5 h-3.5" />
              </span>
              <span>Groups</span>
            </button>

            {/* 7. KIDS TAB (Cyan Theme) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('kids');
                if (currentView !== 'kids') setCurrentView('kids');
              }}
              className={`group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 hover:border-yellow-400 ${
                activeTab === 'kids'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-cyan-50 text-cyan-950 hover:bg-cyan-100'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'kids'
                  ? 'bg-white text-cyan-600 ring-2 ring-cyan-300'
                  : 'bg-cyan-200 text-cyan-900 group-hover:bg-cyan-300'
              }`}>
                <Smile className="w-3.5 h-3.5" />
              </span>
              <span>Kids</span>
            </button>

          </div>
        </div>
      </div>

      {/* HEADER SECTION UNDER TAB MENU: ANNOUNCEMENTS & HERO FOR HOME, DEDICATED PAGE TITLE FOR OTHER TABS */}
      {activeTab === 'home' ? (
        <>
          <AnnouncementsGallery />
          <HomeHero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              if (currentView !== tab) setCurrentView(tab);
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            onSearchSubmit={() => {
              const el = document.getElementById('home-search-results') || document.getElementById('featured-businesses');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else window.scrollTo({ top: 560, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        <div className="w-full bg-neutral-900 border-b-2 border-black py-4 sm:py-5 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-2.5 border-2 border-black shrink-0 ${
                  activeTab === 'businesses' ? 'bg-blue-600 text-white' :
                  activeTab === 'deals' ? 'bg-amber-500 text-neutral-950' :
                  activeTab === 'events' ? 'bg-orange-600 text-white' :
                  activeTab === 'news' ? 'bg-rose-600 text-white' :
                  activeTab === 'groups' ? 'bg-purple-600 text-white' :
                  'bg-cyan-500 text-neutral-950'
                }`}>
                  {activeTab === 'businesses' && <Store className="w-5 h-5 sm:w-6 sm:h-6" />}
                  {activeTab === 'deals' && <Tag className="w-5 h-5 sm:w-6 sm:h-6" />}
                  {activeTab === 'events' && <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                  {activeTab === 'news' && <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />}
                  {activeTab === 'groups' && <Users className="w-5 h-5 sm:w-6 sm:h-6" />}
                  {activeTab === 'kids' && <Smile className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>

                <div>
                  <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                    {activeTab === 'businesses' && 'Local Business Directory'}
                    {activeTab === 'deals' && 'Community Deals & Coupons'}
                    {activeTab === 'events' && 'Community Events Calendar'}
                    {activeTab === 'news' && 'Orléans News & Community Stories'}
                    {activeTab === 'groups' && 'Community Clubs & Organizations'}
                    {activeTab === 'kids' && 'Kids & Family Activities'}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-300">
                    {activeTab === 'businesses' && 'Discover trusted shops, dining, health clinics, and home services across Orléans.'}
                    {activeTab === 'deals' && 'Exclusive local discounts, member offers, and limited-time specials in your neighborhood.'}
                    {activeTab === 'events' && 'Festivals, farmers’ markets, sports events, workshops, and family gatherings.'}
                    {activeTab === 'news' && 'Stay informed with neighborhood updates, LRT transit progress, and community news.'}
                    {activeTab === 'groups' && 'Find local cycling clubs, sports leagues, arts societies, and volunteer networks.'}
                    {activeTab === 'kids' && 'Wave pools, splash pads, youth martial arts, gymnastics, dance, and weekend family fun.'}
                  </p>
                </div>
              </div>

              {/* Quick count badge */}
              <div className="hidden md:flex items-center gap-2 self-start sm:self-center shrink-0">
                <span className="px-3 py-1 bg-neutral-800 border-2 border-black text-xs font-mono text-neutral-200">
                  {activeTab === 'businesses' && `${filteredBusinesses.length} Businesses Listed`}
                  {activeTab === 'deals' && `${filteredDeals.length} Active Deals`}
                  {activeTab === 'events' && `${filteredEvents.length} Upcoming Events`}
                  {activeTab === 'news' && `${newsItems.length + editorialStories.length} Articles & Reports`}
                  {activeTab === 'groups' && `${filteredGroups.length} Active Clubs`}
                  {activeTab === 'kids' && `${filteredKidsActivities.length} Family Activities`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={hasSideFilter ? "flex flex-col lg:flex-row items-start gap-6 lg:gap-7" : "w-full"}>
          
          {/* LEFT FILTER MENU (Only on Business, Events, Groups, Kids) */}
          {hasSideFilter && (
            <FilterSidebar
              activeTab={activeTab as 'businesses' | 'events' | 'groups' | 'kids'}
              hasActiveFilters={hasActiveFilters}
              resetTabFilters={resetTabFilters}
              selectedBizCategory={selectedBizCategory}
              setSelectedBizCategory={setSelectedBizCategory}
              bizCategories={bizCategories}
              selectedNeighbourhood={selectedNeighbourhood}
              setSelectedNeighbourhood={setSelectedNeighbourhood}
              neighbourhoodsList={neighbourhoodsList}
              openNowOnly={openNowOnly}
              setOpenNowOnly={setOpenNowOnly}
              minRating={minRating}
              setMinRating={setMinRating}
              selectedPrice={selectedPrice}
              setSelectedPrice={setSelectedPrice}
              verifiedOnly={verifiedOnly}
              setVerifiedOnly={setVerifiedOnly}
              bizCategoryCounts={bizCategoryCounts}
              selectedEventTimeframe={selectedEventTimeframe}
              setSelectedEventTimeframe={setSelectedEventTimeframe}
              selectedEventCategory={selectedEventCategory}
              setSelectedEventCategory={setSelectedEventCategory}
              eventCategories={eventCategories}
              freeEventsOnly={freeEventsOnly}
              setFreeEventsOnly={setFreeEventsOnly}
              calendarSelectedDay={calendarSelectedDay}
              setCalendarSelectedDay={setCalendarSelectedDay}
              eventsList={contextEvents || []}
              selectedGroupCategory={selectedGroupCategory}
              setSelectedGroupCategory={setSelectedGroupCategory}
              groupCategories={groupCategories}
              totalGroupsCount={contextGroups?.length || 0}
              selectedKidsCategory={selectedKidsCategory}
              setSelectedKidsCategory={setSelectedKidsCategory}
              kidsCategories={kidsCategories}
              selectedKidsAgeGroup={selectedKidsAgeGroup}
              setSelectedKidsAgeGroup={setSelectedKidsAgeGroup}
              kidsAgeGroups={kidsAgeGroups}
              kidsFreeOnly={kidsFreeOnly}
              setKidsFreeOnly={setKidsFreeOnly}
              kidsDropInOnly={kidsDropInOnly}
              setKidsDropInOnly={setKidsDropInOnly}
              totalKidsCount={kidsActivities.length}
              selectedDistance={selectedDistance}
              setSelectedDistance={setSelectedDistance}
              userPostalCode={userPostalCode}
            />
          )}

          {/* ================================================================= */}
          {/* MAIN RESULTS AREA (SEARCH ON TOP, VIEW SWITCHER & LIST RESULTS)    */}
          {/* ================================================================= */}
          <main className={hasSideFilter ? "flex-1 min-w-0" : "w-full min-w-0"}>
            
            {/* SEARCH ON TOP OF THE LIST RESULTS (For non-home tabs; Home has the Hero search bar) */}
            {activeTab !== 'home' && (
              <div className="mb-6 space-y-3">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activeTab === 'businesses' ? 'Search businesses by name, service, or address...' :
                      activeTab === 'deals' ? 'Search deals by keyword, business, or code...' :
                      activeTab === 'events' ? 'Search events by name, location, or performer...' :
                      activeTab === 'news' ? 'Search articles, topics, or authors...' :
                      activeTab === 'kids' ? 'Search kids activities, splash pads, sports, camps...' :
                      'Search community groups, hobbies, or clubs...'
                    }
                    className="w-full bg-white text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 pl-10 pr-9 py-2.5 rounded-none border-2 border-black hover:border-yellow-400 focus:border-yellow-400 focus:outline-hidden transition-all shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Row: Result Count (Left) + View Switchers (Right) */}
                <div className="flex items-center justify-between gap-3 pt-1 border-b-2 border-black pb-2.5 flex-wrap">
                  
                  {/* Result Count and Active Indicators */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-900">
                      {`${currentCount} ${activeTab === 'businesses' ? 'businesses' : activeTab === 'deals' ? 'deals' : activeTab === 'events' ? 'events' : activeTab === 'news' ? 'stories' : activeTab === 'kids' ? 'activities & programs' : 'groups'}`}
                    </span>
                    {hasActiveFilters && (
                      <span className="text-xs text-neutral-500 font-normal">
                        (filtered)
                      </span>
                    )}
                  </div>

                {/* View Switchers according to active tab */}
                <div className="flex items-center gap-1.5">
                  
                  {/* BUSINESS TAB: List, Grid, Map */}
                  {activeTab === 'businesses' && (
                    <div className="flex items-center p-0.5 bg-neutral-100 rounded-none border-2 border-black">
                      <button
                        type="button"
                        onClick={() => setBizViewMode('grid')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          bizViewMode === 'grid'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Grid</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBizViewMode('list')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          bizViewMode === 'list'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="List View"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBizViewMode('map')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          bizViewMode === 'map'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="Map View"
                      >
                        <MapIcon className="w-3.5 h-3.5" />
                        <span>Map</span>
                      </button>
                    </div>
                  )}

                  {/* DEALS TAB: Grid, List */}
                  {activeTab === 'deals' && (
                    <div className="flex items-center p-0.5 bg-neutral-100 rounded-none border-2 border-black">
                      <button
                        type="button"
                        onClick={() => setDealsViewMode('grid')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          dealsViewMode === 'grid'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Grid</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDealsViewMode('list')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          dealsViewMode === 'list'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="List View"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>
                    </div>
                  )}

                  {/* EVENTS TAB: List, Calendar */}
                  {activeTab === 'events' && (
                    <div className="flex items-center p-0.5 bg-neutral-100 rounded-none border-2 border-black">
                      <button
                        type="button"
                        onClick={() => setEventsViewMode('list')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          eventsViewMode === 'list'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="List View"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEventsViewMode('calendar')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          eventsViewMode === 'calendar'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="Calendar View"
                      >
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Calendar</span>
                      </button>
                    </div>
                  )}

                  {/* NEWS TAB: Editorial Grid */}
                  {activeTab === 'news' && (
                    <div className="flex items-center gap-1 text-xs text-neutral-700 font-medium px-2.5 py-1 bg-white rounded-none border-2 border-black">
                      <LayoutGrid className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Editorial Grid</span>
                    </div>
                  )}

                  {/* GROUPS TAB: Grid, List */}
                  {activeTab === 'groups' && (
                    <div className="flex items-center p-0.5 bg-neutral-100 rounded-none border-2 border-black">
                      <button
                        type="button"
                        onClick={() => setGroupsViewMode('grid')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          groupsViewMode === 'grid'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Grid</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setGroupsViewMode('list')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          groupsViewMode === 'list'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="List View"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>
                    </div>
                  )}

                  {/* KIDS TAB: Grid, List */}
                  {activeTab === 'kids' && (
                    <div className="flex items-center p-0.5 bg-neutral-100 rounded-none border-2 border-black">
                      <button
                        type="button"
                        onClick={() => setKidsViewMode('grid')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          kidsViewMode === 'grid'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="Grid View"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Grid</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setKidsViewMode('list')}
                        className={`px-2.5 py-1 rounded-none text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          kidsViewMode === 'list'
                            ? 'bg-white text-neutral-900 shadow-xs border-2 border-black'
                            : 'text-neutral-600 hover:text-neutral-900 hover:border-yellow-400 border-2 border-transparent'
                        }`}
                        title="List View"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* SORTING BUTTON RIGHT UNDER VIEW OPTIONS */}
              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider flex items-center gap-1 mr-1">
                    <ArrowUpDown className="w-3 h-3 text-neutral-500" />
                    <span>Sort:</span>
                  </span>

                    {activeTab === 'businesses' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSortBy('default')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'default'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Recommended
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('rating')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'rating'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Highest Rated
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('reviews')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'reviews'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Most Reviews
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('name')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'name'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          A-Z
                        </button>
                      </>
                    )}

                    {activeTab === 'deals' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSortBy('default')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'default'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Recommended
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('discount')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'discount'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Biggest Discount
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('claimed')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'claimed'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Most Popular
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('name')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'name'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          A-Z
                        </button>
                      </>
                    )}

                    {activeTab === 'events' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSortBy('default')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'default'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Upcoming Date
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('name')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'name'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          A-Z
                        </button>
                      </>
                    )}

                    {activeTab === 'news' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSortBy('default')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'default'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Newest
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('title')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'title'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Title A-Z
                        </button>
                      </>
                    )}

                    {activeTab === 'groups' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSortBy('default')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'default'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Most Members
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('name')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'name'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Name A-Z
                        </button>
                      </>
                    )}

                    {activeTab === 'kids' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSortBy('default')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'default'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Featured
                        </button>
                        <button
                          type="button"
                          onClick={() => setSortBy('name')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-none border-2 transition-colors cursor-pointer ${
                            sortBy === 'name'
                              ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                              : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                          }`}
                        >
                          Name A-Z
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

            {/* =============================================================== */}
            {/* TAB CONTENT: HOME TAB (DEFAULT)                                 */}
            {/* =============================================================== */}
            {activeTab === 'home' && (
              <div className="space-y-12">
                
                {/* Search Results Preview when user searches from Hero */}
                {searchQuery.trim() && (
                  <section id="home-search-results" className="p-4 sm:p-6 bg-yellow-50/70 border-2 border-black rounded-none space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b-2 border-black">
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-neutral-900 stroke-[2.5]" />
                        <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">
                          Search Results for &ldquo;{searchQuery}&rdquo;
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-black cursor-pointer underline"
                      >
                        Clear search
                      </button>
                    </div>

                    {/* Matching Businesses */}
                    {filteredBusinesses.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-blue-600" />
                            Businesses ({filteredBusinesses.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('businesses')}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            View all in Directory →
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {filteredBusinesses.slice(0, 4).map((b) => (
                            <BusinessCard key={b.id} business={b} compact={false} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Deals */}
                    {filteredDeals.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-amber-600" />
                            Deals ({filteredDeals.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('deals')}
                            className="text-xs font-semibold text-amber-600 hover:text-amber-800 cursor-pointer"
                          >
                            View all Deals →
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {filteredDeals.slice(0, 4).map((d) => (
                            <DealCard key={d.id} deal={d} compact={false} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Kids Activities */}
                    {filteredKidsActivities.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                            <Smile className="w-3.5 h-3.5 text-cyan-600" />
                            Kids & Family Activities ({filteredKidsActivities.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('kids')}
                            className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 cursor-pointer"
                          >
                            View all Kids Activities →
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredKidsActivities.slice(0, 3).map((act) => (
                            <KidsCard key={act.id} activity={act} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No matches notice */}
                    {filteredBusinesses.length === 0 && filteredDeals.length === 0 && filteredKidsActivities.length === 0 && (
                      <div className="text-center py-6 bg-white border-2 border-black">
                        <p className="text-sm font-semibold text-neutral-800">No results found for &ldquo;{searchQuery}&rdquo;</p>
                        <p className="text-xs text-neutral-500 mt-1 font-normal">Try searching for &quot;bakery&quot;, &quot;dental&quot;, &quot;pizza&quot;, or &quot;wave pool&quot;.</p>
                      </div>
                    )}
                  </section>
                )}

                {/* 1. Featured Businesses Section */}
                <section id="featured-businesses" className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Store className="w-5 h-5 text-blue-600" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                        Featured Local Businesses
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('businesses')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <span>View All ({businesses.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {businesses.slice(0, 4).map((b) => (
                      <BusinessCard key={b.id} business={b} compact={false} />
                    ))}
                  </div>
                </section>

                {/* 2. Featured Deals Section */}
                <section id="featured-deals" className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-amber-600" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                        Exclusive Community Deals
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('deals')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors cursor-pointer"
                    >
                      <span>View All Deals ({deals.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {deals.slice(0, 4).map((d) => (
                      <DealCard key={d.id} deal={d} compact={false} />
                    ))}
                  </div>
                </section>

                {/* 3. Featured Events Section */}
                <section id="upcoming-events" className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-orange-600" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                        Upcoming Community Events
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('events')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-800 transition-colors cursor-pointer"
                    >
                      <span>View Event Calendar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(contextEvents || []).slice(0, 3).map((evt) => {
                      const isRsvp = rsvpdEventIds.includes(evt.id);
                      return (
                        <article
                          key={evt.id}
                          className="bg-white p-3.5 rounded-none border-2 border-neutral-300 hover:border-yellow-400 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between"
                        >
                          <div className="flex gap-4 items-start min-w-0">
                            <div className="w-14 h-14 rounded-none bg-neutral-100 border-2 border-neutral-200 flex flex-col items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold uppercase text-neutral-500">
                                {evt.month || 'SEP'}
                              </span>
                              <span className="text-lg font-bold font-mono text-neutral-900 leading-tight">
                                {evt.dayNumber || 12}
                              </span>
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <span className="font-semibold text-neutral-800">{evt.category}</span>
                                <span aria-hidden="true">·</span>
                                <span>{evt.time}</span>
                                {evt.isFree && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="text-emerald-700 font-semibold">Free</span>
                                  </>
                                )}
                              </div>

                              <h3 className="text-base font-bold text-neutral-900 hover:text-red-700 transition-colors truncate">
                                {evt.title}
                              </h3>

                              <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                <span className="truncate">{evt.location}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleRsvp(evt.id, evt.title)}
                            className={`self-end sm:self-center px-4 py-1.5 rounded-none border-2 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                              isRsvp
                                ? 'bg-emerald-700 text-white border-emerald-700 hover:border-yellow-400'
                                : 'bg-white text-neutral-800 border-neutral-300 hover:border-yellow-400 hover:bg-neutral-50'
                            }`}
                          >
                            {isRsvp ? 'Going ✓' : 'RSVP'}
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </section>

                {/* 4. Latest News Section */}
                <section id="latest-news" className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-rose-600" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                        Latest Local News & Spotlights
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('news')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                    >
                      <span>Read All News</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {unifiedNewsList.slice(0, 3).map((item) => (
                      <article
                        key={item.id}
                        onClick={() => {
                          setSelectedStory({
                            id: item.id,
                            title: item.title,
                            slug: item.id,
                            tag: (item.category.toUpperCase() as any) || 'COMMUNITY',
                            summary: item.summary,
                            content: item.content || item.summary,
                            image: item.image,
                            date: item.date,
                            readTime: item.readTime,
                            author: item.author,
                          });
                        }}
                        className="group cursor-pointer bg-white rounded-none border-2 border-neutral-300 hover:border-yellow-400 transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-40 w-full overflow-hidden bg-neutral-100">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold uppercase tracking-wider">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <div className="p-3.5">
                            <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                              <span>{item.date}</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.author}</span>
                            </div>

                            <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-red-700 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        <div className="p-3.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                          <span>Article</span>
                          <span className="font-semibold text-neutral-800 group-hover:text-red-700 flex items-center gap-1">
                            <span>Read</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* 5. Featured Groups Section */}
                <section id="featured-groups" className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                        Featured Community Groups & Clubs
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('groups')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                    >
                      <span>View All Groups</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(contextGroups || []).slice(0, 3).map((grp) => {
                      const isJoined = joinedGroupIds.includes(grp.id);
                      return (
                        <article
                          key={grp.id}
                          className="bg-white rounded-none border-2 border-neutral-300 hover:border-yellow-400 transition-all overflow-hidden flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative h-36 w-full bg-neutral-100 overflow-hidden">
                              <img
                                src={grp.image}
                                alt={grp.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-0.5 bg-black/70 text-white text-[10px] font-medium">
                                  {grp.category}
                                </span>
                              </div>
                              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-white text-neutral-900 text-[10px] font-bold border border-neutral-200">
                                {grp.members} members
                              </div>
                            </div>

                            <div className="p-3.5 space-y-1.5">
                              <h3 className="font-bold text-sm sm:text-base text-neutral-900 line-clamp-1">
                                {grp.name}
                              </h3>
                              <div className="text-xs text-neutral-500 space-y-0.5">
                                <div className="flex items-center gap-1 truncate">
                                  <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span className="truncate">{grp.meetingSchedule}</span>
                                </div>
                                <div className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                                  <span className="truncate">{grp.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-3.5 pt-2 border-t border-neutral-100">
                            <button
                              type="button"
                              onClick={() => handleToggleJoin(grp.id, grp.name)}
                              className={`w-full py-1.5 rounded-none border-2 text-xs font-semibold transition-colors cursor-pointer ${
                                isJoined
                                  ? 'bg-neutral-900 text-white border-neutral-900 hover:border-yellow-400'
                                  : 'bg-white text-neutral-800 border-neutral-300 hover:border-yellow-400 hover:bg-neutral-50'
                              }`}
                            >
                              {isJoined ? 'Joined ✓' : 'Join Club'}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>

                {/* 6. Kids & Family in Orléans Section */}
                <section id="featured-kids" className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Smile className="w-5 h-5 text-cyan-600" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                        Kids & Family in Orléans
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('kids')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition-colors cursor-pointer"
                    >
                      <span>Explore Kids Hub ({kidsActivities.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kidsActivities.slice(0, 4).map((act) => (
                      <KidsCard key={act.id} activity={act} compact={false} />
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT: BUSINESS TAB                                       */}
            {/* =============================================================== */}
            {activeTab === 'businesses' && (
              <div>
                {sortedBusinesses.length === 0 ? (
                  <div className="p-10 text-center border-2 border-black rounded-none bg-neutral-50">
                    <Search className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-neutral-800">No businesses found</p>
                    <p className="text-xs text-neutral-500 mt-1 font-normal">Try resetting the filter buttons or search keywords.</p>
                    <button
                      type="button"
                      onClick={resetTabFilters}
                      className="mt-3 px-3 py-1.5 rounded-none border-2 border-black bg-neutral-900 hover:border-yellow-400 text-white text-xs font-medium cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 1. Grid View */}
                    {bizViewMode === 'grid' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {sortedBusinesses.map((b) => (
                          <BusinessCard key={b.id} business={b} compact={false} />
                        ))}
                      </div>
                    )}

                    {/* 2. List View */}
                    {bizViewMode === 'list' && (
                      <div className="space-y-3">
                        {sortedBusinesses.map((b) => (
                          <BusinessCard key={b.id} business={b} compact={true} />
                        ))}
                      </div>
                    )}

                    {/* 3. Map View */}
                    {bizViewMode === 'map' && (
                      <div className="border-2 border-black rounded-none hover:border-yellow-400 transition-colors overflow-hidden">
                        <MapDiscovery />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT: DEALS TAB                                          */}
            {/* =============================================================== */}
            {activeTab === 'deals' && (
              <div>
                {sortedDeals.length === 0 ? (
                  <div className="p-10 text-center border-2 border-black rounded-none bg-neutral-50">
                    <Tag className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-neutral-800">No deals match your criteria</p>
                    <p className="text-xs text-neutral-500 mt-1 font-normal">Try selecting another deal category or clearing filters.</p>
                    <button
                      type="button"
                      onClick={resetTabFilters}
                      className="mt-3 px-3 py-1.5 rounded-none border-2 border-black bg-neutral-900 hover:border-yellow-400 text-white text-xs font-medium cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Grid View */}
                    {dealsViewMode === 'grid' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sortedDeals.map((d) => (
                          <DealCard key={d.id} deal={d} compact={false} />
                        ))}
                      </div>
                    )}

                    {/* List View */}
                    {dealsViewMode === 'list' && (
                      <div className="space-y-3">
                        {sortedDeals.map((d) => (
                          <DealCard key={d.id} deal={d} compact={true} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT: EVENTS TAB                                         */}
            {/* =============================================================== */}
            {activeTab === 'events' && (
              <div>
                {/* 1. List View */}
                {eventsViewMode === 'list' && (
                  <div className="space-y-4">
                    {sortedEvents.length === 0 ? (
                      <div className="p-10 text-center border-2 border-black rounded-none bg-neutral-50">
                        <CalendarIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-neutral-800">No events found</p>
                        <p className="text-xs text-neutral-500 mt-1 font-normal">Try selecting another date or category.</p>
                        <button
                          type="button"
                          onClick={resetTabFilters}
                          className="mt-3 px-3 py-1.5 rounded-none border-2 border-black bg-neutral-900 hover:border-yellow-400 text-white text-xs font-medium cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      sortedEvents.map((evt) => {
                        const isRsvp = rsvpdEventIds.includes(evt.id);
                        return (
                          <article
                            key={evt.id}
                            className="bg-white p-4 rounded-none border-2 border-black hover:border-yellow-400 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between"
                          >
                            <div className="flex gap-4 items-start min-w-0">
                              {/* Date Block */}
                              <div className="w-14 h-14 rounded-none bg-neutral-100 border-2 border-black flex flex-col items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold uppercase text-neutral-500">
                                  {evt.month || 'SEP'}
                                </span>
                                <span className="text-lg font-bold font-mono text-neutral-900 leading-tight">
                                  {evt.dayNumber || 12}
                                </span>
                              </div>

                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-semibold text-neutral-800">{evt.category}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{evt.time}</span>
                                  {evt.isFree && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-emerald-700 font-medium">Free</span>
                                    </>
                                  )}
                                </div>

                                <h3 className="text-base font-bold text-neutral-900 hover:text-red-700 transition-colors truncate">
                                  {evt.title}
                                </h3>

                                <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
                                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  <span className="truncate">{evt.location}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleRsvp(evt.id, evt.title)}
                              className={`self-end sm:self-center px-4 py-2 rounded-none border-2 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                                isRsvp
                                  ? 'bg-emerald-700 text-white border-black hover:border-yellow-400'
                                  : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
                              }`}
                            >
                              {isRsvp ? 'Going ✓' : 'RSVP'}
                            </button>
                          </article>
                        );
                      })
                    )}
                  </div>
                )}

                {/* 2. Calendar View */}
                {eventsViewMode === 'calendar' && (
                  <div className="space-y-6">
                    <div className="p-4 sm:p-5 rounded-none border-2 border-black hover:border-yellow-400 transition-colors bg-white shadow-2xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-neutral-800" />
                          <h3 className="font-bold text-base text-neutral-900">
                            September 2026
                          </h3>
                        </div>
                        {calendarSelectedDay !== null && (
                          <button
                            type="button"
                            onClick={() => setCalendarSelectedDay(null)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                          >
                            Show All Days
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-neutral-400 mb-1">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>

                      <div className="grid grid-cols-7 gap-1.5">
                        <div className="h-14 sm:h-16 rounded-none bg-neutral-50/50 border border-black" />
                        <div className="h-14 sm:h-16 rounded-none bg-neutral-50/50 border border-black" />

                        {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                          const dayEvents = (contextEvents || []).filter((e) => e.dayNumber === dayNum);
                          const isSelected = calendarSelectedDay === dayNum;

                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => {
                                setCalendarSelectedDay(isSelected ? null : dayNum);
                              }}
                              className={`h-14 sm:h-16 p-1.5 rounded-none border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'border-black bg-neutral-900 text-white shadow-xs hover:border-yellow-400'
                                  : dayEvents.length > 0
                                  ? 'border-black bg-neutral-50 hover:border-yellow-400 text-neutral-900 font-semibold'
                                  : 'border-black bg-white hover:border-yellow-400 text-neutral-700'
                              }`}
                            >
                              <span className="text-xs font-mono font-bold leading-none">
                                {dayNum}
                              </span>

                              {dayEvents.length > 0 && (
                                <div className="space-y-0.5">
                                  <span className={`block text-[10px] truncate leading-tight ${
                                    isSelected ? 'text-neutral-200' : 'text-neutral-800'
                                  }`}>
                                    {dayEvents[0].title}
                                  </span>
                                  {dayEvents.length > 1 && (
                                    <span className={`block text-[9px] font-medium leading-none ${
                                      isSelected ? 'text-emerald-300' : 'text-emerald-700'
                                    }`}>
                                      +{dayEvents.length - 1} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b-2 border-black">
                        <span className="text-xs font-bold uppercase text-neutral-500">
                          {calendarSelectedDay ? `Events on Sep ${calendarSelectedDay}, 2026` : 'All Calendar Events'}
                        </span>
                        <span className="text-xs text-neutral-400">
                          {sortedEvents.length} scheduled
                        </span>
                      </div>

                      {sortedEvents.length === 0 ? (
                        <div className="p-8 text-center text-neutral-500 text-xs border-2 border-black rounded-none font-normal">
                          No events scheduled for this day. Click another day on the calendar above.
                        </div>
                      ) : (
                        sortedEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className="p-3.5 bg-white border-2 border-black rounded-none hover:border-yellow-400 transition-colors flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-mono font-bold px-2 py-1 bg-neutral-100 rounded-none border-2 border-black text-neutral-800 shrink-0">
                                {evt.month} {evt.dayNumber}
                              </span>
                              <div className="truncate">
                                <h4 className="text-sm font-bold text-neutral-900 truncate">
                                  {evt.title}
                                </h4>
                                <span className="text-xs text-neutral-500 block truncate">
                                  {evt.time} · {evt.location}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleRsvp(evt.id, evt.title)}
                              className="px-3 py-1.5 rounded-none border-2 border-black hover:border-yellow-400 bg-white text-neutral-800 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                            >
                              {rsvpdEventIds.includes(evt.id) ? 'Going ✓' : 'RSVP'}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT: NEWS TAB (EDITORIAL GRID)                          */}
            {/* =============================================================== */}
            {activeTab === 'news' && (
              <div>
                {sortedNews.length === 0 ? (
                  <div className="p-10 text-center border-2 border-black rounded-none bg-neutral-50">
                    <Newspaper className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-neutral-800">No articles found</p>
                    <p className="text-xs text-neutral-500 mt-1 font-normal">Try resetting the topic filter buttons.</p>
                    <button
                      type="button"
                      onClick={resetTabFilters}
                      className="mt-3 px-3 py-1.5 rounded-none border-2 border-black bg-neutral-900 hover:border-yellow-400 text-white text-xs font-medium cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sortedNews.map((item, idx) => {
                      const isFeatured = idx === 0;

                      return (
                        <article
                          key={item.id}
                          onClick={() => {
                            if (item.isStory) {
                              const story = editorialStories.find((s) => s.id === item.id);
                              if (story) {
                                setSelectedStory(story);
                                return;
                              }
                            }
                            setSelectedStory({
                              id: item.id,
                              title: item.title,
                              slug: item.id,
                              tag: (item.category.toUpperCase() as any) || 'COMMUNITY',
                              summary: item.summary,
                              content: `${item.summary}\n\nFull story covering local updates and neighborhood initiatives across Orléans and Ottawa East.`,
                              image: item.image,
                              date: item.date,
                              readTime: item.readTime,
                              author: item.author,
                            });
                          }}
                          className={`group cursor-pointer bg-white rounded-none border-2 border-black hover:border-yellow-400 transition-all overflow-hidden flex flex-col justify-between hover:shadow-xs ${
                            isFeatured ? 'md:col-span-2' : ''
                          }`}
                        >
                          <div>
                            <div className={`relative w-full overflow-hidden bg-neutral-100 ${
                              isFeatured ? 'h-56 sm:h-64' : 'h-44 sm:h-48'
                            }`}>
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-2 py-0.5 rounded-none bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium uppercase tracking-wider">
                                  {item.category}
                                </span>
                              </div>
                            </div>

                            <div className="p-4 sm:p-5">
                              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1.5">
                                <span>{item.date}</span>
                                <span aria-hidden="true">·</span>
                                <span>{item.author}</span>
                                <span aria-hidden="true">·</span>
                                <span>{item.readTime}</span>
                              </div>

                              <h3 className={`font-bold text-neutral-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2 ${
                                isFeatured ? 'text-lg sm:text-xl' : 'text-base'
                              }`}>
                                {item.title}
                              </h3>
                            </div>
                          </div>

                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t-2 border-black flex items-center justify-between text-xs text-neutral-500">
                            <span>Local Editorial</span>
                            <span className="font-semibold text-neutral-800 group-hover:text-red-700 flex items-center gap-1">
                              <span>Read article</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT: GROUPS TAB                                         */}
            {/* =============================================================== */}
            {activeTab === 'groups' && (
              <div>
                {sortedGroups.length === 0 ? (
                  <div className="p-10 text-center border-2 border-black rounded-none bg-neutral-50">
                    <Users className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-neutral-800">No community groups found</p>
                    <p className="text-xs text-neutral-500 mt-1 font-normal">Try resetting the category filter buttons.</p>
                    <button
                      type="button"
                      onClick={resetTabFilters}
                      className="mt-3 px-3 py-1.5 rounded-none border-2 border-black bg-neutral-900 hover:border-yellow-400 text-white text-xs font-medium cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* 1. Grid View */}
                    {groupsViewMode === 'grid' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {sortedGroups.map((grp) => {
                          const isJoined = joinedGroupIds.includes(grp.id);

                          return (
                            <article
                              key={grp.id}
                              className="bg-white rounded-none border-2 border-black hover:border-yellow-400 transition-all overflow-hidden flex flex-col justify-between"
                            >
                              <div>
                                <div className="relative h-40 w-full bg-neutral-100 overflow-hidden">
                                  <img
                                    src={grp.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80'}
                                    alt={grp.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                  <div className="absolute top-2.5 left-2.5">
                                    <span className="px-2 py-0.5 rounded-none bg-black/70 backdrop-blur-xs text-white text-xs font-medium">
                                      {grp.category}
                                    </span>
                                  </div>

                                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-none bg-white text-neutral-900 text-[11px] font-bold shadow-xs border-2 border-black">
                                    {grp.members} members
                                  </div>
                                </div>

                                <div className="p-4 space-y-2">
                                  <h3 className="font-bold text-base text-neutral-900 line-clamp-1">
                                    {grp.name}
                                  </h3>

                                  <div className="space-y-1 text-xs text-neutral-500 pt-1">
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                      <span className="truncate">{grp.meetingSchedule}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                      <span className="truncate">{grp.location}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="p-4 pt-2 border-t-2 border-black flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleToggleJoin(grp.id, grp.name)}
                                  className={`w-full py-2 rounded-none border-2 text-xs font-semibold transition-colors cursor-pointer ${
                                    isJoined
                                      ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                                      : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
                                  }`}
                                >
                                  {isJoined ? 'Joined ✓' : 'Join Club'}
                                </button>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}

                    {/* 2. List View */}
                    {groupsViewMode === 'list' && (
                      <div className="space-y-3">
                        {sortedGroups.map((grp) => {
                          const isJoined = joinedGroupIds.includes(grp.id);

                          return (
                            <article
                              key={grp.id}
                              className="bg-white p-4 rounded-none border-2 border-black hover:border-yellow-400 transition-all flex flex-col sm:flex-row gap-4 items-start justify-between"
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                  <span className="font-semibold text-neutral-800">{grp.category}</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{grp.members} members</span>
                                  <span aria-hidden="true">·</span>
                                  <span>{grp.meetingSchedule}</span>
                                </div>

                                <h3 className="font-bold text-base text-neutral-900 truncate">
                                  {grp.name}
                                </h3>

                                <div className="flex items-center gap-1.5 text-xs text-neutral-500 pt-1">
                                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  <span className="truncate">{grp.location}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleJoin(grp.id, grp.name)}
                                className={`self-end sm:self-center px-4 py-2 rounded-none border-2 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                                  isJoined
                                    ? 'bg-neutral-900 text-white border-black hover:border-yellow-400'
                                    : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
                                }`}
                              >
                                {isJoined ? 'Joined ✓' : 'Join Club'}
                              </button>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* =============================================================== */}
            {/* TAB CONTENT: KIDS & FAMILY TAB                                  */}
            {/* =============================================================== */}
            {activeTab === 'kids' && (
              <div className="space-y-6">
                {/* Narrow Filter Controls Bar (Buttons only, no dropdowns) */}
                <div className="p-3 sm:p-4 bg-neutral-50 border-2 border-black rounded-none space-y-3">
                  {/* Category Filter Buttons */}
                  <div className="space-y-1.5">
                    <span className="block text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                      Activity Category:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {kidsCategories.map((c) => {
                        const isSelected = selectedKidsCategory === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedKidsCategory(c.id)}
                            className={`px-2.5 py-1 text-xs rounded-none border-2 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-900 text-white border-black hover:border-yellow-400 font-bold'
                                : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-100 font-medium'
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Age Group and Features Row */}
                  <div className="pt-2.5 border-t-2 border-black flex items-center justify-between gap-3 flex-wrap">
                    {/* Age Group */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mr-1">
                        Age Group:
                      </span>
                      {kidsAgeGroups.map((a) => {
                        const isSelected = selectedKidsAgeGroup === a.id;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setSelectedKidsAgeGroup(a.id)}
                            className={`px-2.5 py-1 text-xs rounded-none border-2 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-600 text-white border-black hover:border-yellow-400 font-bold'
                                : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-100 font-medium'
                            }`}
                          >
                            {a.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Features Quick Toggles */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setKidsFreeOnly(!kidsFreeOnly)}
                        className={`px-2.5 py-1 text-xs rounded-none border-2 transition-colors cursor-pointer ${
                          kidsFreeOnly
                            ? 'bg-emerald-600 text-white border-black hover:border-yellow-400 font-bold'
                            : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-100 font-medium'
                        }`}
                      >
                        Free Admission {kidsFreeOnly && '✓'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setKidsDropInOnly(!kidsDropInOnly)}
                        className={`px-2.5 py-1 text-xs rounded-none border-2 transition-colors cursor-pointer ${
                          kidsDropInOnly
                            ? 'bg-cyan-700 text-white border-black hover:border-yellow-400 font-bold'
                            : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-100 font-medium'
                        }`}
                      >
                        Drop-in Welcome {kidsDropInOnly && '✓'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Cards: Empty State or Grid/List */}
                {sortedKidsActivities.length === 0 ? (
                  <div className="p-10 text-center border-2 border-black rounded-none bg-neutral-50 space-y-3">
                    <Smile className="w-10 h-10 text-neutral-400 mx-auto" />
                    <p className="text-base font-bold text-neutral-900">No kids activities match your current filters</p>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto font-normal">
                      Try selecting All Activities or clearing search terms to see family fun options in Orléans.
                    </p>
                    <button
                      type="button"
                      onClick={resetTabFilters}
                      className="px-4 py-2 rounded-none border-2 border-black bg-neutral-900 hover:border-yellow-400 text-white text-xs font-semibold cursor-pointer"
                    >
                      Reset Kids Filters
                    </button>
                  </div>
                ) : kidsViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {sortedKidsActivities.map((act) => (
                      <KidsCard 
                        key={act.id} 
                        activity={act} 
                        viewMode="grid" 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sortedKidsActivities.map((act) => (
                      <KidsCard 
                        key={act.id} 
                        activity={act} 
                        viewMode="list" 
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
};
