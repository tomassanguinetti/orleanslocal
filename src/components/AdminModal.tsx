import React from 'react';
import { useDirectory } from '../context/DirectoryContext';

export const AdminModal: React.FC = () => {
  const { setCurrentView } = useDirectory();

  return (
    <div className="max-w-2xl mx-auto p-6 my-10 bg-white border-2 border-black rounded-none">
      <h2 className="text-xl font-bold text-neutral-900 mb-2">Admin Directory Management</h2>
      <p className="text-xs text-neutral-600 mb-4 font-normal">
        Local management for Orléans businesses and listings.
      </p>
      <button
        type="button"
        onClick={() => setCurrentView('home')}
        className="px-4 py-2 bg-neutral-900 hover:border-yellow-400 text-white text-xs font-semibold rounded-none border-2 border-black cursor-pointer"
      >
        Return to Home
      </button>
    </div>
  );
};
