import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  MapPin, 
  Star, 
  Check, 
  Clock, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Tag, 
  DollarSign, 
  Users, 
  Smile, 
  Store,
  Layers,
  Heart,
  Navigation
} from 'lucide-react';
import { CommunityEvent } from '../types';

interface FilterSidebarProps {
  activeTab: 'businesses' | 'events' | 'groups' | 'kids';
  hasActiveFilters: boolean;
  resetTabFilters: () => void;

  // Distance filter
  selectedDistance: string;
  setSelectedDistance: (d: string) => void;
  userPostalCode: string;

  // Business filters
  selectedBizCategory: string;
  setSelectedBizCategory: (c: string) => void;
  bizCategories: { id: string; label: string }[];
  selectedNeighbourhood: string;
  setSelectedNeighbourhood: (n: string) => void;
  neighbourhoodsList: { id: string; label: string }[];
  openNowOnly: boolean;
  setOpenNowOnly: (v: boolean | ((p: boolean) => boolean)) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  selectedPrice: string;
  setSelectedPrice: (p: string) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (v: boolean | ((p: boolean) => boolean)) => void;
  bizCategoryCounts: Record<string, number>;

  // Events filters
  selectedEventTimeframe: 'all' | 'today' | 'tomorrow' | 'weekend';
  setSelectedEventTimeframe: (t: 'all' | 'today' | 'tomorrow' | 'weekend') => void;
  selectedEventCategory: string;
  setSelectedEventCategory: (c: string) => void;
  eventCategories: { id: string; label: string }[];
  freeEventsOnly: boolean;
  setFreeEventsOnly: (v: boolean | ((p: boolean) => boolean)) => void;
  calendarSelectedDay: number | null;
  setCalendarSelectedDay: (d: number | null) => void;
  eventsList: CommunityEvent[];

  // Groups filters
  selectedGroupCategory: string;
  setSelectedGroupCategory: (c: string) => void;
  groupCategories: { id: string; label: string }[];
  totalGroupsCount: number;

  // Kids filters
  selectedKidsCategory: string;
  setSelectedKidsCategory: (c: string) => void;
  kidsCategories: { id: string; label: string }[];
  selectedKidsAgeGroup: string;
  setSelectedKidsAgeGroup: (a: string) => void;
  kidsAgeGroups: { id: string; label: string }[];
  kidsFreeOnly: boolean;
  setKidsFreeOnly: (v: boolean | ((p: boolean) => boolean)) => void;
  kidsDropInOnly: boolean;
  setKidsDropInOnly: (v: boolean | ((p: boolean) => boolean)) => void;
  totalKidsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  activeTab,
  hasActiveFilters,
  resetTabFilters,

  selectedBizCategory,
  setSelectedBizCategory,
  bizCategories,
  selectedNeighbourhood,
  setSelectedNeighbourhood,
  neighbourhoodsList,
  openNowOnly,
  setOpenNowOnly,
  minRating,
  setMinRating,
  selectedPrice,
  setSelectedPrice,
  verifiedOnly,
  setVerifiedOnly,
  bizCategoryCounts,

  selectedEventTimeframe,
  setSelectedEventTimeframe,
  selectedEventCategory,
  setSelectedEventCategory,
  eventCategories,
  freeEventsOnly,
  setFreeEventsOnly,
  calendarSelectedDay,
  setCalendarSelectedDay,
  eventsList,

  selectedGroupCategory,
  setSelectedGroupCategory,
  groupCategories,
  totalGroupsCount,

  selectedKidsCategory,
  setSelectedKidsCategory,
  kidsCategories,
  selectedKidsAgeGroup,
  setSelectedKidsAgeGroup,
  kidsAgeGroups,
  kidsFreeOnly,
  setKidsFreeOnly,
  kidsDropInOnly,
  setKidsDropInOnly,
  totalKidsCount,

  selectedDistance,
  setSelectedDistance,
  userPostalCode,
}) => {
  return (
    <aside 
      aria-label="Filter sidebar"
      className="w-full lg:w-64 xl:w-72 shrink-0 bg-white border-2 border-black rounded-none p-3.5 sm:p-4 shadow-xs sticky top-[72px] space-y-5"
    >
      {/* ------------------------------------------------------------- */}
      {/* SIDEBAR HEADER: ONLY TITLE FILTERS                            */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 border-2 border-black ${
            activeTab === 'businesses' ? 'bg-blue-600 text-white' :
            activeTab === 'events' ? 'bg-orange-600 text-white' :
            activeTab === 'groups' ? 'bg-purple-600 text-white' :
            'bg-cyan-500 text-neutral-950'
          }`}>
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-neutral-900 font-mono">
              Filters
            </h2>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetTabFilters}
            className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 border border-rose-300 hover:border-black px-2 py-1 transition-colors cursor-pointer"
            title="Reset active filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DISTANCE FROM LOCATION (AUTOMATIC POSTAL CODE IDENTIFIED)     */}
      {/* ------------------------------------------------------------- */}
      <div className="pb-5 border-b-2 border-neutral-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            <span>Distance from Location</span>
          </h3>
          {selectedDistance !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedDistance('all')}
              className="text-[10px] font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>


        {/* Quick Distance Selector Buttons */}
        <div className="grid grid-cols-5 gap-1">
          {[
            { id: 'all', label: 'All' },
            { id: '2', label: '< 2 km' },
            { id: '5', label: '< 5 km' },
            { id: '10', label: '< 10 km' },
            { id: '15', label: '< 15 km' },
          ].map((dist) => {
            const isSelected = selectedDistance === dist.id;
            return (
              <button
                key={dist.id}
                type="button"
                onClick={() => setSelectedDistance(dist.id)}
                className={`py-1.5 px-1 text-[11px] font-mono font-bold border-2 transition-all cursor-pointer text-center rounded-none truncate ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-black shadow-xs'
                    : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                }`}
                title={`Filter listings within ${dist.label} of ${userPostalCode}`}
              >
                {dist.label}
              </button>
            );
          })}
        </div>

        {selectedDistance !== 'all' && (
          <p className="text-[10px] text-neutral-600 font-medium">
            Filtering listings within <strong className="text-neutral-900">{selectedDistance} km</strong> of postal code <strong className="font-mono text-neutral-900">{userPostalCode}</strong>
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BUSINESS TAB FILTERS                                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'businesses' && (
        <div className="space-y-5">
          {/* 1. Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center justify-between">
              <span>Category</span>
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
            </h3>
            <div className="space-y-1">
              {bizCategories.map((cat) => {
                const count = bizCategoryCounts[cat.id] ?? 0;
                const isSelected = selectedBizCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedBizCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border-2 transition-all cursor-pointer text-left rounded-none ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-black font-semibold shadow-2xs'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-none font-mono ${
                      isSelected ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Neighbourhood / Area */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center justify-between">
              <span>Neighbourhood</span>
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {neighbourhoodsList.map((nh) => {
                const isSelected = selectedNeighbourhood === nh.id;
                return (
                  <button
                    key={nh.id}
                    type="button"
                    onClick={() => setSelectedNeighbourhood(nh.id)}
                    className={`px-2 py-1.5 text-[11px] font-medium border-2 text-center transition-all cursor-pointer rounded-none truncate ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    {nh.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Status & Badges: Open Now & Verified */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Status & Verification
            </h3>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setOpenNowOnly((prev) => !prev)}
                className={`w-full flex items-center justify-between px-2.5 py-2 border-2 text-xs font-medium transition-all cursor-pointer rounded-none ${
                  openNowOnly
                    ? 'bg-emerald-600 text-white border-black font-semibold'
                    : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${openNowOnly ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
                  <span>Open Now</span>
                </div>
                {openNowOnly && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              <button
                type="button"
                onClick={() => setVerifiedOnly((prev) => !prev)}
                className={`w-full flex items-center justify-between px-2.5 py-2 border-2 text-xs font-medium transition-all cursor-pointer rounded-none ${
                  verifiedOnly
                    ? 'bg-blue-600 text-white border-black font-semibold'
                    : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-white' : 'text-blue-600'}`} />
                  <span>Verified Local Business</span>
                </div>
                {verifiedOnly && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
          </div>

          {/* 4. Price Level */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center justify-between">
              <span>Price Level</span>
              <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
            </h3>
            <div className="grid grid-cols-4 gap-1">
              {['all', '$', '$$', '$$$'].map((p) => {
                const isSelected = selectedPrice === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPrice(p)}
                    className={`py-1.5 text-xs font-mono font-bold border-2 transition-all cursor-pointer text-center rounded-none ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-black'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    {p === 'all' ? 'All' : p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Rating */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center justify-between">
              <span>Minimum Rating</span>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Any', value: 0 },
                { label: '4.0+ ★', value: 4.0 },
                { label: '4.5+ ★', value: 4.5 },
              ].map((r) => {
                const isSelected = minRating === r.value;
                return (
                  <button
                    key={r.label}
                    type="button"
                    onClick={() => setMinRating(r.value)}
                    className={`py-1.5 text-xs font-medium border-2 transition-all cursor-pointer text-center rounded-none ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EVENTS TAB FILTERS                                            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'events' && (
        <div className="space-y-5">
          {/* 1. Timeframe */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center justify-between">
              <span>When</span>
              <CalendarIcon className="w-3.5 h-3.5 text-orange-600" />
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'all', label: 'All Upcoming' },
                { id: 'today', label: 'Today (Nov 12)' },
                { id: 'tomorrow', label: 'Tomorrow (Nov 18)' },
                { id: 'weekend', label: 'This Weekend' },
              ].map((tf) => {
                const isSelected = selectedEventTimeframe === tf.id && calendarSelectedDay === null;
                return (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => {
                      setSelectedEventTimeframe(tf.id as any);
                      setCalendarSelectedDay(null);
                    }}
                    className={`px-2 py-1.5 text-[11px] font-medium border-2 text-center transition-all cursor-pointer rounded-none ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    {tf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Event Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Event Type
            </h3>
            <div className="space-y-1">
              {eventCategories.map((cat) => {
                const isSelected = selectedEventCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedEventCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border-2 transition-all cursor-pointer text-left rounded-none ${
                      isSelected
                        ? 'bg-orange-600 text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Admission */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Cost & Admission
            </h3>
            <button
              type="button"
              onClick={() => setFreeEventsOnly((prev) => !prev)}
              className={`w-full flex items-center justify-between px-2.5 py-2 border-2 text-xs font-medium transition-all cursor-pointer rounded-none ${
                freeEventsOnly
                  ? 'bg-emerald-600 text-white border-black font-semibold'
                  : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" />
                <span>Free Admission Only</span>
              </div>
              {freeEventsOnly && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>

          {/* 4. Interactive November Date Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                November Dates
              </h3>
              {calendarSelectedDay !== null && (
                <button
                  type="button"
                  onClick={() => setCalendarSelectedDay(null)}
                  className="text-[10px] text-rose-600 hover:underline font-semibold"
                >
                  Clear Day
                </button>
              )}
            </div>
            <div className="p-2.5 bg-neutral-50 border-2 border-black rounded-none">
              <div className="grid grid-cols-5 gap-1.5">
                {[12, 18, 20, 26, 28].map((day) => {
                  const isPicked = calendarSelectedDay === day;
                  const matchingCount = eventsList.filter((e) => e.dayNumber === day).length;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setCalendarSelectedDay(isPicked ? null : day);
                        setSelectedEventTimeframe('all');
                      }}
                      className={`p-1.5 flex flex-col items-center justify-center border-2 rounded-none transition-all cursor-pointer ${
                        isPicked
                          ? 'bg-orange-600 text-white border-black shadow-xs'
                          : 'bg-white text-neutral-800 border-black hover:border-yellow-400'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-mono text-neutral-400">Nov</span>
                      <span className="text-xs font-bold font-mono">{day}</span>
                      <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        isPicked ? 'bg-white' : 'bg-orange-500'
                      }`} />
                    </button>
                  );
                })}
              </div>
              {calendarSelectedDay !== null && (
                <p className="text-[10px] text-center text-neutral-500 mt-2 font-mono">
                  Filtering for November {calendarSelectedDay}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* GROUPS TAB FILTERS                                            */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'groups' && (
        <div className="space-y-5">
          {/* 1. Group Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center justify-between">
              <span>Club Interest</span>
              <Users className="w-3.5 h-3.5 text-purple-600" />
            </h3>
            <div className="space-y-1">
              {groupCategories.map((cat) => {
                const isSelected = selectedGroupCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedGroupCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium border-2 transition-all cursor-pointer text-left rounded-none ${
                      isSelected
                        ? 'bg-purple-600 text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Community Tips Box */}
          <div className="p-3 bg-purple-50 border-2 border-black rounded-none space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Free Community Listing</span>
            </div>
            <p className="text-[11px] text-purple-800 leading-relaxed font-normal">
              Running a recreational club, walking group, or hobby circle in Orléans? Listings are 100% free for community members.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* KIDS TAB FILTERS                                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'kids' && (
        <div className="space-y-5">
          {/* 1. Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center justify-between">
              <span>Activity Type</span>
              <Smile className="w-3.5 h-3.5 text-cyan-600" />
            </h3>
            <div className="space-y-1">
              {kidsCategories.map((cat) => {
                const isSelected = selectedKidsCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedKidsCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium border-2 transition-all cursor-pointer text-left rounded-none ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Age Group */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Age Group
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {kidsAgeGroups.map((ag) => {
                const isSelected = selectedKidsAgeGroup === ag.id;
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => setSelectedKidsAgeGroup(ag.id)}
                    className={`px-2 py-1.5 text-[11px] font-medium border-2 text-center transition-all cursor-pointer rounded-none truncate ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-black font-semibold'
                        : 'bg-white text-neutral-700 border-black hover:border-yellow-400 hover:bg-neutral-50'
                    }`}
                  >
                    {ag.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Cost & Drop-in */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Access & Pricing
            </h3>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setKidsFreeOnly((prev) => !prev)}
                className={`w-full flex items-center justify-between px-2.5 py-2 border-2 text-xs font-medium transition-all cursor-pointer rounded-none ${
                  kidsFreeOnly
                    ? 'bg-emerald-600 text-white border-black font-semibold'
                    : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Free Activities Only</span>
                </div>
                {kidsFreeOnly && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              <button
                type="button"
                onClick={() => setKidsDropInOnly((prev) => !prev)}
                className={`w-full flex items-center justify-between px-2.5 py-2 border-2 text-xs font-medium transition-all cursor-pointer rounded-none ${
                  kidsDropInOnly
                    ? 'bg-cyan-600 text-white border-black font-semibold'
                    : 'bg-white text-neutral-800 border-black hover:border-yellow-400 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Drop-In Friendly</span>
                </div>
                {kidsDropInOnly && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            </div>
          </div>

          {/* 4. Family Tip Box */}
          <div className="p-3 bg-cyan-50 border-2 border-black rounded-none space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-950">
              <Heart className="w-3.5 h-3.5 text-cyan-700" />
              <span>Orléans Family Tip</span>
            </div>
            <p className="text-[11px] text-cyan-900 leading-relaxed font-normal">
              Many local programs like library storytimes and recreation splash pads are free or low-cost drop-in. Tap any card for full hours and parking details.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
