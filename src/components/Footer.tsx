import React from 'react';
import { MapPin, Heart } from 'lucide-react';
import { useDirectory } from '../context/DirectoryContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useDirectory();

  return (
    <footer className="bg-neutral-900 text-white border-t-2 border-black mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-dela text-base text-white tracking-tight">
              Orléans<span className="text-neutral-400">Local</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-400 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-yellow-400 cursor-pointer transition-colors"
            >
              Home
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setCurrentView('businesses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-yellow-400 cursor-pointer transition-colors"
            >
              Businesses
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setCurrentView('deals');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-yellow-400 cursor-pointer transition-colors"
            >
              Deals
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setCurrentView('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-yellow-400 cursor-pointer transition-colors"
            >
              Events
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setCurrentView('news');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-yellow-400 cursor-pointer transition-colors"
            >
              News
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                setCurrentView('groups');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-yellow-400 cursor-pointer transition-colors"
            >
              Groups
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 font-normal">
            © {new Date().getFullYear()} Orléans Local · Ottawa East Discovery Platform
          </p>
        </div>
      </div>
    </footer>
  );
};
