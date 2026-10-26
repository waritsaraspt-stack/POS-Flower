import React from 'react';
import { User } from '../types';
import { Flower2, LogOut, ShieldCheck, UserCheck } from 'lucide-react';

interface Props {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({ user, activeTab, setActiveTab, onLogout }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-md shadow-rose-200">
            <Flower2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-tight">BloomPOS Studio</h1>
            <p className="text-xs text-rose-500 font-medium">ระบบจัดการร้านดอกไม้หน้าร้าน</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'home' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            🏠 หน้าหลัก & ประวัติ
          </button>
          <button 
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'pos' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            🌸 รับออเดอร์ใหม่
          </button>
          <button 
            onClick={() => setActiveTab('board')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'board' ? 'bg-rose-50 text-rose-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            📋 กระดานคิวงาน
          </button>
          {user.role === 'owner' && (
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === 'finance' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-amber-600 hover:bg-amber-50/50'}`}
            >
              💰 บัญชีร้าน & ยอดเงิน
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-full text-xs">
            {user.role === 'owner' ? (
              <span className="flex items-center gap-1 text-amber-600 font-medium"><ShieldCheck className="w-3.5 h-3.5" /> เจ้าของร้าน</span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 font-medium"><UserCheck className="w-3.5 h-3.5" /> พนักงาน</span>
            )}
            <span className="text-slate-600 font-semibold truncate max-w-[100px]">{user.name}</span>
          </div>

          <button onClick={onLogout} title="ออกจากระบบ" className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
