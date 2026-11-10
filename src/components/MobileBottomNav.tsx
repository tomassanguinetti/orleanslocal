import React from 'react';
import { Home as HomeIcon, Store, Tag, Calendar, Newspaper, Users, Smile } from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useDirectory();

  interface NavItem {
    id: 'home' | 'businesses' | 'deals' | 'events' | 'news' | 'groups' | 'kids';
    label: string;
    icon: React.ElementType;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'businesses', label: 'Business', icon: Store },
    { id: 'deals', label: 'Deals', icon: Tag },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'kids', label: 'Kids', icon: Smile },
  ];

  const handleNav = (id: 'home' | 'businesses' | 'deals' | 'events' | 'news' | 'groups' | 'kids') => {
    setCurrentView(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-black px-1 py-1 flex items-center justify-around shadow-lg pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`flex-1 py-1 flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
              isActive ? 'text-neutral-900 font-bold' : 'text-neutral-500 font-medium hover:text-neutral-900'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
