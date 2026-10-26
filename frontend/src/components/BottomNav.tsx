import React from 'react';
import { Role } from '../types';
import { Home, PlusCircle, LayoutList, Wallet } from 'lucide-react';

interface Props {
  role: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<Props> = ({ role, activeTab, setActiveTab }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
      <button 
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 text-xs py-1 px-3 rounded-xl transition ${activeTab === 'home' ? 'text-rose-600 font-semibold' : 'text-slate-400'}`}
      >
        <Home className="w-5 h-5" />
        <span>หน้าหลัก</span>
      </button>

      <button 
        onClick={() => setActiveTab('pos')}
        className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full w-12 h-12 shadow-lg shadow-rose-300 active:scale-95 transition"
      >
        <PlusCircle className="w-7 h-7" />
      </button>

      <button 
        onClick={() => setActiveTab('board')}
        className={`flex flex-col items-center gap-1 text-xs py-1 px-3 rounded-xl transition ${activeTab === 'board' ? 'text-rose-600 font-semibold' : 'text-slate-400'}`}
      >
        <LayoutList className="w-5 h-5" />
        <span>คิวงาน</span>
      </button>

      {role === 'owner' && (
        <button 
          onClick={() => setActiveTab('finance')}
          className={`flex flex-col items-center gap-1 text-xs py-1 px-3 rounded-xl transition ${activeTab === 'finance' ? 'text-amber-600 font-semibold' : 'text-slate-400'}`}
        >
          <Wallet className="w-5 h-5" />
          <span>บัญชี</span>
        </button>
      )}
    </div>
  );
};
