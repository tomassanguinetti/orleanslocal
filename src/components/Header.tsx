import React from 'react';
import { useDirectory } from '../context/DirectoryContext';
import { TopBarWeatherTime } from './TopBarWeatherTime';

export const Header: React.FC = () => {
  const { setCurrentView } = useDirectory();

  return (
    <header className="relative bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 min-h-[72px] py-2">
          
          {/* Logo */}
          <div 
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center cursor-pointer select-none shrink-0 group py-1"
            title="Orléans Local"
          >
            <img 
              src="/assets/aistudio/OrleansLocal_Map_Pin_Logo_da600684.png"
              alt="Orléans Local"
              className="h-12 sm:h-14 lg:h-16 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-200"
            />
          </div>

          {/* Top Right: Local Time & Weather */}
          <TopBarWeatherTime />

        </div>
      </div>
    </header>
  );
};
