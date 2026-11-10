import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Business, 
  Category, 
  Neighbourhood, 
  EditorialStory, 
  LocalNewsItem, 
  Review, 
  BusinessSubmission, 
  FilterState, 
  CommunityEvent,
  CommunityGroup,
  Deal,
  KidsActivity
} from '../types';
import { 
  BUSINESSES, 
  CATEGORIES, 
  NEIGHBOURHOODS, 
  EDITORIAL_STORIES, 
  LOCAL_NEWS, 
  INITIAL_REVIEWS,
  INITIAL_COMMUNITY_EVENTS,
  INITIAL_COMMUNITY_GROUPS,
  COMMUNITY_DEALS,
  KIDS_ACTIVITIES
} from '../data/mockData';

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface DirectoryContextType {
  businesses: Business[];
  events: CommunityEvent[];
  newsItems: LocalNewsItem[];
  groups: CommunityGroup[];
  categories: Category[];
  neighbourhoods: Neighbourhood[];
  editorialStories: EditorialStory[];
  deals: Deal[];
  selectedDeal: Deal | null;
  setSelectedDeal: (d: Deal | null) => void;
  savedBusinessIds: string[];
  toggleSaveBusiness: (id: string) => void;
  isSaved: (id: string) => boolean;
  reviews: Record<string, Review[]>;
  addReview: (businessId: string, authorName: string, rating: number, text: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  currentView: 'home' | 'businesses' | 'deals' | 'events' | 'news' | 'groups' | 'kids' | 'admin';
  setCurrentView: (view: 'home' | 'businesses' | 'deals' | 'events' | 'news' | 'groups' | 'kids' | 'admin') => void;
  kidsActivities: KidsActivity[];
  selectedKidActivity: KidsActivity | null;
  setSelectedKidActivity: (k: KidsActivity | null) => void;
  activeBusiness: Business | null;
  setActiveBusiness: (b: Business | null) => void;
  selectedStory: EditorialStory | null;
  setSelectedStory: (s: EditorialStory | null) => void;
  currentUser: UserProfile | null;
  toast: string | null;
  showToast: (msg: string) => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  category: 'all',
  neighbourhood: 'all',
  distance: 'all',
  openNow: false,
  ratingMin: 0,
  priceLevels: [],
  features: [],
  sortBy: 'recommended',
  viewMode: 'grid',
};

const DirectoryContext = createContext<DirectoryContextType | undefined>(undefined);

export const DirectoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>(BUSINESSES);
  const [events, setEvents] = useState<CommunityEvent[]>(INITIAL_COMMUNITY_EVENTS);
  const [newsItems, setNewsItems] = useState<LocalNewsItem[]>(LOCAL_NEWS);
  const [editorialStories, setEditorialStories] = useState<EditorialStory[]>(EDITORIAL_STORIES);
  const [groups, setGroups] = useState<CommunityGroup[]>(INITIAL_COMMUNITY_GROUPS);
  const [deals, setDeals] = useState<Deal[]>(COMMUNITY_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const [categories] = useState<Category[]>(CATEGORIES);
  const [neighbourhoods] = useState<Neighbourhood[]>(NEIGHBOURHOODS);
  const [reviews, setReviews] = useState<Record<string, Review[]>>(INITIAL_REVIEWS);
  const [savedBusinessIds, setSavedBusinessIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  
  const [kidsActivities] = useState<KidsActivity[]>(KIDS_ACTIVITIES);
  const [selectedKidActivity, setSelectedKidActivity] = useState<KidsActivity | null>(null);

  // Default to home tab
  const [currentView, setCurrentView] = useState<'home' | 'businesses' | 'deals' | 'events' | 'news' | 'groups' | 'kids' | 'admin'>('home');
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [selectedStory, setSelectedStory] = useState<EditorialStory | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const toggleSaveBusiness = (id: string) => {
    setSavedBusinessIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from saved places.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to your collection.');
        return [...prev, id];
      }
    });
  };

  const isSaved = (id: string) => savedBusinessIds.includes(id);

  const addReview = (businessId: string, authorName: string, rating: number, text: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      businessId,
      authorName: authorName || 'Local Neighbor',
      rating,
      date: 'Just now',
      text,
      helpfulCount: 0,
    };
    setReviews((prev) => ({
      ...prev,
      [businessId]: [newRev, ...(prev[businessId] || [])],
    }));
    showToast('Thank you! Review published.');
  };

  const value = {
    businesses,
    events,
    newsItems,
    groups,
    categories,
    neighbourhoods,
    editorialStories,
    deals,
    selectedDeal,
    setSelectedDeal,
    savedBusinessIds,
    toggleSaveBusiness,
    isSaved,
    reviews,
    addReview,
    filters,
    setFilters,
    resetFilters,
    currentView,
    setCurrentView,
    kidsActivities,
    selectedKidActivity,
    setSelectedKidActivity,
    activeBusiness,
    setActiveBusiness,
    selectedStory,
    setSelectedStory,
    currentUser,
    toast,
    showToast,
  };

  return <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>;
};

export const useDirectory = () => {
  const ctx = useContext(DirectoryContext);
  if (!ctx) throw new Error('useDirectory must be used within a DirectoryProvider');
  return ctx;
};
