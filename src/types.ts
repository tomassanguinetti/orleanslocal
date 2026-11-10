export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';

export interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  address: string;
  neighbourhood?: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  email: string;
  hours: BusinessHours;
  isOpenNow: boolean;
  closingTime?: string;
  photos: string[];
  logo?: string;
  rating: number;
  reviewCount: number;
  priceLevel: PriceLevel;
  distanceKm: number;
  services: string[];
  features: string[];
  verified: boolean;
  claimed: boolean;
  yearEstablished: number;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
  tags: string[];
  sponsored?: boolean;
  sponsoredPromo?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  businessCount: number;
  description: string;
  subcategories: string[];
}

export interface Neighbourhood {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  heroImage: string;
  latitude: number;
  longitude: number;
  businessCount: number;
  popularCategories: string[];
  highlights: string[];
}

export interface EditorialStory {
  id: string;
  title: string;
  slug: string;
  tag: 'LOCAL SPOTLIGHT' | 'COMMUNITY' | 'SUSTAINABILITY' | 'NEW OPENING' | 'FEATURE';
  tagColor?: string;
  summary: string;
  content: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  relatedBusinessIds?: string[];
}

export interface LocalNewsItem {
  id: string;
  title: string;
  category: 'News' | 'Events' | 'Business' | 'Community';
  date: string;
  summary: string;
  image: string;
  location?: string;
  time?: string;
  url?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  dayNumber?: number;
  month?: string;
  time: string;
  location: string;
  category: string;
  summary: string;
  badgeColor?: string;
  image?: string;
  isFree?: boolean;
}

export interface CommunityGroup {
  id: string;
  name: string;
  category: string;
  members: number;
  meetingSchedule: string;
  location: string;
  description: string;
  image?: string;
}

export interface Review {
  id: string;
  businessId: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  text: string;
  helpfulCount: number;
}

export interface BusinessSubmission {
  id: string;
  userId?: string;
  businessName: string;
  category: string;
  neighbourhood?: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  services: string;
  features: string[];
  photos: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  neighbourhood?: string;
  distance: string;
  openNow: boolean;
  ratingMin: number;
  priceLevels: PriceLevel[];
  features: string[];
  sortBy: 'recommended' | 'closest' | 'highest_rated' | 'most_popular' | 'newest';
  viewMode: 'grid' | 'list' | 'map';
}

export interface Deal {
  id: string;
  businessId: string;
  businessName: string;
  title: string;
  discount: string;
  category: string;
  expiryDate: string;
  code?: string;
  description: string;
  terms?: string;
  image: string;
  claimedCount?: number;
}

export interface KidsActivity {
  id: string;
  title: string;
  category: 'indoor_play' | 'sports_rec' | 'arts_theatre' | 'parks_nature' | 'stem_camps' | 'library_storytime';
  categoryLabel: string;
  ageRange: string;
  ageGroup: 'toddlers' | 'kids' | 'tweens' | 'all';
  location: string;
  address: string;
  schedule: string;
  pricing: string;
  isFree?: boolean;
  isDropIn?: boolean;
  website?: string;
  phone?: string;
  image: string;
  features: string[];
  description: string;
  longDescription?: string;
}

