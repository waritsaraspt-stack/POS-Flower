import React, { useState } from 'react';
import { User, Role, StoreInfo } from '../types';
import { Flower2, Store, UserCheck, ShieldAlert, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  onLoginSuccess: (user: User) => void;
  onCreateStore: (data: { storeName: string; storeCode: string; ownerName: string; username: string }) => void;
  onRegisterStaff: (data: { name: string; username: string; storeCode: string }) => void;
  storeInfo: StoreInfo;
}

export const AuthPage: React.FC<Props> = ({ 
  onLoginSuccess, 
  onCreateStore, 
  onRegisterStaff,
  storeInfo 
}) => {
  const [activeMode, setActiveMode] = useState<'login' | 'create_store' | 'join_staff'>('login');
  
  // Login form
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Create store form (Owner)
  const [storeName, setStoreName] = useState('Bloom Florist Studio');
  const [storeCode, setStoreCode] = useState('BLOOM-888');
  const [ownerName, setOwnerName] = useState('คุณวริศรา เกียรติสกุล');
  const [ownerUsername, setOwnerUsername] = useState('owner');
  const [ownerPassword, setOwnerPassword] = useState('1234');

  // Register staff form
  const [staffName, setStaffName] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffStoreCode, setStaffStoreCode] = useState(storeInfo?.storeCode || 'BLOOM-888');

  const [notification, setNotification] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const handleQuickDemo = (demoType: 'owner' | 'approved_staff' | 'pending_staff') => {
    if (demoType === 'owner') {
      onLoginSuccess({ 
        id: 'owner-1', 
        username: 'owner', 
        name: 'คุณวริศรา (เจ้าของร้าน)', 
        role: 'owner',
        storeCode: storeInfo.storeCode,
        status: 'approved'
      });
    } else if (demoType === 'approved_staff') {
      onLoginSuccess({ 
        id: 'staff-1', 
        username: 'staff', 
        name: 'คุณสมใจ (พนักงานหน้าร้าน)', 
        role: 'staff',
        storeCode: storeInfo.storeCode,
        status: 'approved'
      });
    } else {
      onLoginSuccess({ 
        id: 'staff-2', 
        username: 'somying', 
        name: 'คุณสมหญิง ช่างจัดช่อ', 
        role: 'staff',
        storeCode: storeInfo.storeCode,
        status: 'pending'
      });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    // ตรวจสอบ username
    if (loginUsername === 'owner' || loginUsername.toLowerCase().includes('owner')) {
      onLoginSuccess({
        id: 'owner-1',
        username: loginUsername,
        name: storeInfo.ownerName || 'คุณวริศรา (เจ้าของร้าน)',
        role: 'owner',
        storeCode: storeInfo.storeCode,
        status: 'approved'
      });
    } else if (loginUsername === 'somying') {
      onLoginSuccess({
        id: 'staff-2',
        username: 'somying',
        name: 'คุณสมหญิง ช่างจัดช่อ',
        role: 'staff',
        storeCode: storeInfo.storeCode,
        status: 'pending'
      });
    } else {
      onLoginSuccess({
        id: `staff-${Date.now()}`,
        username: loginUsername,
        name: loginUsername,
        role: 'staff',
        storeCode: storeInfo.storeCode,
        status: 'approved'
      });
    }
  };

  const handleCreateStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !storeCode.trim() || !ownerName.trim()) {
      setNotification({ type: 'error', message: 'กรุณากรอกข้อมูลร้านและเจ้าของร้านให้ครบถ้วน' });
      return;
    }

    onCreateStore({
      storeName: storeName.trim(),
      storeCode: storeCode.trim().toUpperCase(),
      ownerName: ownerName.trim(),
      username: ownerUsername.trim() || 'owner'
    });
  };

  const handleRegisterStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffUsername.trim() || !staffStoreCode.trim()) {
      setNotification({ type: 'error', message: 'กรุณากรอกข้อมูลพนักงานและรหัสร้านให้ครบถ้วน' });
      return;
    }

    if (staffStoreCode.trim().toUpperCase() !== storeInfo.storeCode.toUpperCase()) {
      setNotification({ 
        type: 'error', 
        message: `ไม่พบร้านค้ารหัส "${staffStoreCode}". รหัสร้านปัจจุบันคือ "${storeInfo.storeCode}"` 
      });
      return;
    }

    onRegisterStaff({
      name: staffName.trim(),
      username: staffUsername.trim(),
      storeCode: staffStoreCode.trim().toUpperCase()
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-200">
            <Flower2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">BloomPOS Studio</h2>
          <p className="text-xs text-rose-500 font-medium">ระบบบริหารจัดการร้านดอกไม้ & การยืนยันสิทธิ์พนักงาน</p>
        </div>

        {/* Mode Selector Tabs (Tactile 3D Buttons) */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => { setActiveMode('login'); setNotification(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
              activeMode === 'login'
                ? 'bg-white text-rose-600 shadow-sm border border-slate-200/80 ring-1 ring-rose-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('create_store'); setNotification(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
              activeMode === 'create_store'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm ring-1 ring-amber-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👑 สร้างบัญชีร้าน
          </button>
          <button
            type="button"
            onClick={() => { setActiveMode('join_staff'); setNotification(null); }}
            className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
              activeMode === 'join_staff'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm ring-1 ring-emerald-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👥 พนักงานสมัคร
          </button>
        </div>

        {/* Error / Success Notifications */}
        {notification && (
          <div className={`p-3.5 rounded-2xl text-xs text-center font-medium border flex items-center justify-center gap-2 ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            {notification.type === 'error' ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* 1. แท็บเข้าสู่ระบบ (Login) */}
        {activeMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อผู้ใช้ (Username)</label>
              <input 
                type="text" 
                required 
                placeholder="เช่น owner หรือ staff"
                value={loginUsername} 
                onChange={(e) => setLoginUsername(e.target.value)} 
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">รหัสผ่าน</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 transition active:scale-95"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        )}

        {/* 2. แท็บสร้างบัญชีร้านค้า (สำหรับเจ้าของร้าน) */}
        {activeMode === 'create_store' && (
          <form onSubmit={handleCreateStoreSubmit} className="space-y-3.5">
            <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-[11px] text-amber-800 flex items-start gap-2">
              <Store className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                เจ้าของร้านสามารถสร้างบัญชีร้านค้า กำหนดรหัสร้าน และอนุมัติ/ดึงพนักงานเข้าสู่ระบบได้
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อร้านดอกไม้ *</label>
              <input 
                type="text" 
                required 
                placeholder="เช่น ร้านดอกไม้ Bloom Studio"
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                กำหนดรหัสร้านค้า (Store Code) *
              </label>
              <input 
                type="text" 
                required 
                placeholder="เช่น BLOOM-888"
                value={storeCode} 
                onChange={(e) => setStoreCode(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs font-bold text-amber-800 focus:ring-2 focus:ring-amber-400"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                รหัสนี้ใช้ให้พนักงานกรอกเพื่อขอเข้าร่วมร้าน
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อ-นามสกุล เจ้าของร้าน *</label>
              <input 
                type="text" 
                required 
                placeholder="เช่น คุณวริศรา เกียรติสกุล"
                value={ownerName} 
                onChange={(e) => setOwnerName(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Username เจ้าของ</label>
                <input 
                  type="text" 
                  required 
                  value={ownerUsername} 
                  onChange={(e) => setOwnerUsername(e.target.value)} 
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
                <input 
                  type="password" 
                  required 
                  value={ownerPassword} 
                  onChange={(e) => setOwnerPassword(e.target.value)} 
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-amber-300/40 transition active:scale-95 text-xs"
            >
              👑 สร้างบัญชีร้านค้า & เข้าสู่ระบบเจ้าของร้าน
            </button>
          </form>
        )}

        {/* 3. แท็บสมัครเป็นพนักงานร้าน (Staff Join) */}
        {activeMode === 'join_staff' && (
          <form onSubmit={handleRegisterStaffSubmit} className="space-y-3.5">
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl text-[11px] text-emerald-800 flex items-start gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                เมื่อส่งคำขอแล้ว จะต้องรอให้เจ้าของร้านกดยืนยัน/อนุมัติสิทธิ์ จึงจะสามารถเปิดบิล POS ได้
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                รหัสร้านค้าที่ต้องการเข้าร่วม (Store Code) *
              </label>
              <input 
                type="text" 
                required 
                placeholder="เช่น BLOOM-888"
                value={staffStoreCode} 
                onChange={(e) => setStaffStoreCode(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-2xl bg-emerald-50/40 border border-emerald-200 text-xs font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-400"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                สอบถามรหัสร้านค้าจากเจ้าของร้าน (ร้านปัจจุบัน: {storeInfo.storeCode})
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อ-นามสกุล พนักงาน *</label>
              <input 
                type="text" 
                required 
                placeholder="เช่น คุณกมลเนตร ช่างดอกไม้"
                value={staffName} 
                onChange={(e) => setStaffName(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อผู้ใช้ (Username) *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="เช่น kamol_pos"
                  value={staffUsername} 
                  onChange={(e) => setStaffUsername(e.target.value)} 
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">รหัสผ่าน *</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={staffPassword} 
                  onChange={(e) => setStaffPassword(e.target.value)} 
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-300/40 transition active:scale-95 text-xs"
            >
              📨 ส่งคำขอเข้าร่วมร้าน (รอเจ้าของร้านอนุมัติ)
            </button>
          </form>
        )}

        {/* แผงทดสอบทันที (Quick Demo Presets) */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <p className="text-[11px] text-slate-400 font-semibold">ทดสอบเข้าใช้งานด่วน (One-Click Demo):</p>
          <div className="grid grid-cols-3 gap-1.5">
            <button 
              type="button" 
              onClick={() => handleQuickDemo('owner')}
              className="py-2 px-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold shadow-xs active:scale-95"
            >
              👑 เจ้าของร้าน
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickDemo('approved_staff')}
              className="py-2 px-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-xs active:scale-95"
            >
              ✓ พนักงานอนุมัติ
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickDemo('pending_staff')}
              className="py-2 px-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold shadow-xs active:scale-95"
            >
              ⏳ พนักงานรออนุมัติ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
