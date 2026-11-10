import React, { useRef, useState, useEffect } from 'react';
import { 
  Megaphone, 
  Calendar, 
  Tag, 
  Newspaper, 
  Users, 
  Smile, 
  ArrowRight
} from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';
import { Deal, CommunityEvent, EditorialStory, CommunityGroup, KidsActivity } from '../types';

interface AnnouncementItem {
  id: string;
  type: 'event' | 'deal' | 'news' | 'group' | 'kids';
  tag: string;
  tagColor: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  meta: string;
  image?: string;
  action: () => void;
}

export const AnnouncementsGallery: React.FC = () => {
  const { 
    events, 
    deals, 
    editorialStories, 
    groups, 
    kidsActivities,
    setSelectedDeal, 
    setSelectedStory, 
    setSelectedKidActivity,
    setCurrentView 
  } = useDirectory();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Compile rich announcement items from directory data
  const announcements: AnnouncementItem[] = [
    // 1. Featured Deal
    {
      id: 'ann-deal-1',
      type: 'deal',
      tag: 'HOT DEAL',
      tagColor: 'bg-amber-500 text-neutral-950',
      icon: Tag,
      title: '25% Off Sourdough & Specialty Coffee',
      subtitle: 'Orléans Craft Bakery & Café',
      meta: 'Use Code: SOURDOUGH25',
      image: deals[0]?.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&auto=format&fit=crop&q=80',
      action: () => {
        if (deals[0]) setSelectedDeal(deals[0]);
        else setCurrentView('deals');
      },
    },
    // 2. Featured Event
    {
      id: 'ann-event-1',
      type: 'event',
      tag: 'COMMUNITY EVENT',
      tagColor: 'bg-orange-600 text-white',
      icon: Calendar,
      title: events[0]?.title || 'Cumberland Farmers’ Market Harvest Festival',
      subtitle: events[0]?.location || 'Cumberland Arena & Fairgrounds',
      meta: events[0]?.date ? `${events[0].date} · ${events[0].time}` : 'Saturday · 9:00 AM',
      image: events[0]?.image || 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=300&auto=format&fit=crop&q=80',
      action: () => {
        setCurrentView('events');
        window.scrollTo({ top: 380, behavior: 'smooth' });
      },
    },
    // 3. Breaking News
    {
      id: 'ann-news-1',
      type: 'news',
      tag: 'LATEST NEWS',
      tagColor: 'bg-rose-600 text-white',
      icon: Newspaper,
      title: editorialStories[0]?.title || 'LRT Stage 2 East Extension: Live Testing Underway to Trim Station',
      subtitle: 'Orléans Transit & Infrastructure Watch',
      meta: editorialStories[0]?.date || 'This Week · 4 min read',
      image: editorialStories[0]?.image || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=80',
      action: () => {
        if (editorialStories[0]) setSelectedStory(editorialStories[0]);
        else setCurrentView('news');
      },
    },
    // 4. Family / Kids
    {
      id: 'ann-kids-1',
      type: 'kids',
      tag: 'KIDS & FAMILY',
      tagColor: 'bg-cyan-600 text-white',
      icon: Smile,
      title: 'Ray Friel Wave Pool Weekend Waves & Swim Academy',
      subtitle: 'Ray Friel Recreation Complex',
      meta: 'Ages 0-14 · Public Swims 1:00 PM - 4:00 PM',
      image: kidsActivities[0]?.image || 'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=300&auto=format&fit=crop&q=80',
      action: () => {
        if (kidsActivities[0]) setSelectedKidActivity(kidsActivities[0]);
        else setCurrentView('kids');
      },
    },
    // 5. Featured Group
    {
      id: 'ann-group-1',
      type: 'group',
      tag: 'LOCAL CLUB',
      tagColor: 'bg-purple-600 text-white',
      icon: Users,
      title: groups[0]?.name || 'Orléans Cycling Club (OCC)',
      subtitle: groups[0]?.location || 'Leaves from Ray Friel',
      meta: groups[0]?.meetingSchedule || 'Saturday & Sunday Mornings · 185 Members',
      image: groups[0]?.image || 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=300&auto=format&fit=crop&q=80',
      action: () => {
        setCurrentView('groups');
        window.scrollTo({ top: 380, behavior: 'smooth' });
      },
    },
    // 6. Another Deal
    {
      id: 'ann-deal-2',
      type: 'deal',
      tag: 'WATERFRONT PROMO',
      tagColor: 'bg-amber-500 text-neutral-950',
      icon: Tag,
      title: '$15 Off 2-Hour Kayak or SUP Rental',
      subtitle: 'Petrie Island Paddle & Kayak Rentals',
      meta: 'Promo Code: PADDLE15',
      image: deals[1]?.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&auto=format&fit=crop&q=80',
      action: () => {
        if (deals[1]) setSelectedDeal(deals[1]);
        else setCurrentView('deals');
      },
    },
    // 7. Another Kids highlight
    {
      id: 'ann-kids-2',
      type: 'kids',
      tag: 'KIDS PLAY',
      tagColor: 'bg-cyan-600 text-white',
      icon: Smile,
      title: 'Free Bilingual Baby & Toddler Rhyme Time',
      subtitle: 'Ottawa Public Library - Orléans Branch',
      meta: 'Free Drop-In · Tuesdays & Thursdays 10:30 AM',
      image: kidsActivities[7]?.image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
      action: () => {
        if (kidsActivities[7]) setSelectedKidActivity(kidsActivities[7]);
        else setCurrentView('kids');
      },
    },
  ];

  // Auto-scroll loop with smooth step
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (!container) return;

      // Scroll step
      const scrollStep = 320;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll - 10) {
        // Smoothly loop back to start
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div 
      className="w-full border-b-2 border-black py-2.5"
      style={{ backgroundColor: '#ff8f00' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar of Announcement Ticker */}
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>

          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
            <Megaphone className="w-3.5 h-3.5 text-red-600" />
            <span>Latest Announcements</span>
          </div>
        </div>

        {/* Horizontal Auto-scrolling Cards Gallery */}
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-1 scroll-smooth"
        >
          {announcements.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="group w-[280px] sm:w-[320px] shrink-0 bg-white border-2 border-black hover:border-yellow-400 rounded-none p-2.5 flex items-center gap-3 transition-all cursor-pointer shadow-xs select-none"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 bg-neutral-100 border border-black overflow-hidden rounded-none">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider rounded-none ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-blue-700 truncate leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-neutral-600 truncate font-normal">
                    {item.subtitle}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-0.5">
                    <span className="truncate">{item.meta}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-700 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
