import React, { useState, useEffect } from 'react';
import { User, Order, OrderStatus, ProductItem, ExpenseItem, StoreInfo, StaffMember, VillageItem } from './types';
import { Clock, ShieldAlert } from 'lucide-react';

const DEFAULT_VILLAGES: VillageItem[] = [
  { id: 'v-1', name: 'ม.1', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-2', name: 'ม.2', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-3', name: 'ม.3', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-4', name: 'ม.4', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-5', name: 'ม.5', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-6', name: 'ม.6', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-7', name: 'ม.7', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-8', name: 'ม.8', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-9', name: 'ม.9', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-10', name: 'ม.10', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-11', name: 'ม.11', defaultFeeCharged: 100, defaultCostActual: 70 },
  { id: 'v-12', name: 'ม.12', defaultFeeCharged: 100, defaultCostActual: 70 },
];
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { PaymentConfirmModal } from './components/PaymentConfirmModal';
import { FloristSlipModal } from './components/FloristSlipModal';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { POSPage } from './pages/POSPage';
import { KanbanPage } from './pages/KanbanPage';
import { FinancePage } from './pages/FinancePage';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('florist_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'pos' | 'board' | 'finance'>('home');

  // ข้อมูลบัญชีของร้านค้า (Store Account)
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(() => {
    const saved = localStorage.getItem('florist_store_info');
    return saved ? JSON.parse(saved) : {
      id: 'store-1',
      storeCode: 'BLOOM-888',
      storeName: 'ร้านดอกไม้ Bloom Studio',
      ownerId: 'owner-1',
      ownerName: 'คุณวริศรา (เจ้าของร้าน)',
      phone: '081-234-5678',
      tagline: 'ร้านดอกไม้สดและบริการจัดช่อพรีเมียม',
      address: '123/45 ถนนสุขุมวิท กรุงเทพฯ',
      socialContact: 'LINE: @bloomstudio',
      createdAt: '2026-10-24'
    };
  });

  // รายชื่อพนักงานของร้าน (Staff Members with Approval Status)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('florist_staff_members');
    return saved ? JSON.parse(saved) : [
      {
        id: 'staff-1',
        username: 'staff',
        name: 'คุณสมใจ (พนักงานหน้าร้าน)',
        storeCode: 'BLOOM-888',
        status: 'approved',
        joinedAt: '2026-10-24 09:00'
      },
      {
        id: 'staff-2',
        username: 'somying',
        name: 'คุณสมหญิง ช่างจัดช่อ',
        storeCode: 'BLOOM-888',
        status: 'pending',
        joinedAt: '2026-10-24 14:30'
      }
    ];
  });

  // สินค้าและบริการ (แค็ตตาล็อกและสต็อก มีแค่ 2 หมวดหมู่: ดอกไม้สด และ จัดช่อ)
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('florist_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // ปรับปรุงหมวดหมู่เก่าให้มีแค่ 'flower' หรือ 'bouquet'
          return parsed.map((p: any) => ({
            ...p,
            category: (p.category === 'bouquet' ? 'bouquet' : (p.category === 'material' || p.category === 'service' ? 'bouquet' : 'flower')) as 'flower' | 'bouquet'
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'p-1', name: 'ดอกกุหลาบสดเอกวาดอร์', category: 'flower', costPrice: 400, sellingPrice: 850, stockQuantity: 25, unit: 'ช่อ/ก้าน', minStockAlert: 5 },
      { id: 'p-2', name: 'ดอกทานตะวันสด', category: 'flower', costPrice: 280, sellingPrice: 650, stockQuantity: 15, unit: 'ช่อ/ดอก', minStockAlert: 3 },
      { id: 'p-3', name: 'ดอกทิวลิปฮอลแลนด์', category: 'flower', costPrice: 600, sellingPrice: 1200, stockQuantity: 8, unit: 'ช่อ/ก้าน', minStockAlert: 4 },
      { id: 'p-4', name: 'ดอกไฮเดรนเยียพรีเมียม', category: 'flower', costPrice: 750, sellingPrice: 1500, stockQuantity: 6, unit: 'หัว/ช่อ', minStockAlert: 2 },
      { id: 'p-5', name: 'ดอกลิลลี่ขาว', category: 'flower', costPrice: 450, sellingPrice: 950, stockQuantity: 12, unit: 'ช่อ/ก้าน', minStockAlert: 3 },
      { id: 'p-6', name: 'ช่อดอกไม้รับปริญญา Classic', category: 'bouquet', costPrice: 380, sellingPrice: 850, stockQuantity: 20, unit: 'ช่อ', minStockAlert: 5 },
      { id: 'p-7', name: 'ช่อกุหลาบแดงบอกรักวาเลนไทน์', category: 'bouquet', costPrice: 650, sellingPrice: 1500, stockQuantity: 12, unit: 'ช่อ', minStockAlert: 3 },
      { id: 'p-8', name: 'ช่อดอกทานตะวันแสดงความยินดี', category: 'bouquet', costPrice: 280, sellingPrice: 650, stockQuantity: 15, unit: 'ช่อ', minStockAlert: 4 },
      { id: 'p-9', name: 'ช่อดอกไม้สดเกาหลี Minimal', category: 'bouquet', costPrice: 450, sellingPrice: 1100, stockQuantity: 10, unit: 'ช่อ', minStockAlert: 3 },
      { id: 'p-10', name: 'ช่อดอกไม้วันเกิด Luxury Grand', category: 'bouquet', costPrice: 1100, sellingPrice: 2500, stockQuantity: 5, unit: 'ช่อ', minStockAlert: 2 },
    ];
  });

  // รายชื่อหมู่บ้าน/เขตจัดส่ง (เจ้าของร้านสามารถจัดการ/เพิ่ม/ลบได้)
  const [villages, setVillages] = useState<VillageItem[]>(() => {
    const saved = localStorage.getItem('florist_villages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_VILLAGES;
  });

  useEffect(() => {
    localStorage.setItem('florist_villages', JSON.stringify(villages));
  }, [villages]);

  // บัญชีค่าใช้จ่ายร้าน
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('florist_expenses');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'exp-1', title: 'ซื้อดอกกุหลาบและทิวลิป ปากคลองตลาด', amount: 4500, category: 'stock_purchase', date: '2026-10-24' },
      { id: 'exp-2', title: 'กล่องโฟมโอเอซิส 2 ลัง', amount: 800, category: 'stock_purchase', date: '2026-10-24' },
      { id: 'exp-3', title: 'ค่าไฟและแอร์ห้องแช่ดอกไม้', amount: 1800, category: 'utility', date: '2026-10-23' }
    ];
  });

  // รายการออเดอร์
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('florist_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord-1',
        orderNumber: 'ORD-202610-001',
        customerName: 'คุณฟ้าใส จันทร์เพ็ญ',
        customerPhone: '081-234-5678',
        bouquetCount: 1,
        flowerType: 'ดอกกุหลาบสด',
        pricePerBouquet: 850,
        isFreshFlower: true,
        useOasis: true,
        deliveryMethod: 'delivery_service',
        pickupTime: '2026-10-24T17:00:00',
        cardMessage: 'สุขสันต์วันเกิดนะจ๊ะ ❤️',
        totalPrice: 1000,
        orderStatus: 'waiting_delivery',
        paymentStatus: 'paid',
        paymentMethod: 'qr',
        productCost: 418,
        deliveryFeeCharged: 100,
        deliveryCostActual: 70,
        grossProfit: 512,
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [selectedSlipOrder, setSelectedSlipOrder] = useState<Order | null>(null);
  const [paymentGuardOrder, setPaymentGuardOrder] = useState<Order | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('florist_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('florist_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('florist_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('florist_store_info', JSON.stringify(storeInfo));
  }, [storeInfo]);

  useEffect(() => {
    localStorage.setItem('florist_staff_members', JSON.stringify(staffMembers));
  }, [staffMembers]);

  // การสร้างบัญชีร้านค้าโดยเจ้าของร้าน
  const handleCreateStore = (data: { storeName: string; storeCode: string; ownerName: string; username: string }) => {
    const newStore: StoreInfo = {
      id: `store-${Date.now()}`,
      storeCode: data.storeCode,
      storeName: data.storeName,
      ownerId: `owner-${Date.now()}`,
      ownerName: data.ownerName,
      phone: '081-234-5678',
      tagline: 'ร้านดอกไม้สดและบริการจัดช่อพรีเมียม',
      address: '123/45 ถนนสุขุมวิท กรุงเทพฯ',
      socialContact: 'LINE: @bloomstudio',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStoreInfo(newStore);
    const ownerUser: User = {
      id: newStore.ownerId,
      username: data.username,
      name: data.ownerName,
      role: 'owner',
      storeCode: data.storeCode,
      status: 'approved'
    };
    setCurrentUser(ownerUser);
    localStorage.setItem('florist_current_user', JSON.stringify(ownerUser));
    setActiveTab('finance');
  };

  // เจ้าของร้านอัปเดตข้อมูลร้านและช่องทางติดต่อ
  const handleUpdateStoreInfo = (updatedInfo: Partial<StoreInfo>) => {
    setStoreInfo(prev => ({
      ...prev,
      ...updatedInfo
    }));
  };

  // พนักงานส่งคำขอเข้าร่วมร้าน (สถานะเริ่มต้น: pending)
  const handleRegisterStaff = (data: { name: string; username: string; storeCode: string }) => {
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: data.name,
      username: data.username,
      storeCode: data.storeCode,
      status: 'pending',
      joinedAt: new Date().toLocaleString('th-TH')
    };
    setStaffMembers(prev => [newStaff, ...prev]);
    const staffUser: User = {
      id: newStaff.id,
      username: data.username,
      name: data.name,
      role: 'staff',
      storeCode: data.storeCode,
      status: 'pending'
    };
    setCurrentUser(staffUser);
    localStorage.setItem('florist_current_user', JSON.stringify(staffUser));
  };

  // เจ้าของร้านดึงไอดีพนักงานเข้าร้าน (ดึงเข้าร้าน & อนุมัติทันที)
  const handlePullStaff = (identifier: string) => {
    const existing = staffMembers.find(s => s.username === identifier || s.id === identifier);
    if (existing) {
      setStaffMembers(staffMembers.map(s => s.id === existing.id ? { ...s, status: 'approved' } : s));
      alert(`ดึงและอนุมัติพนักงาน "${existing.name}" (@${existing.username}) เข้าสู่ร้านเรียบร้อยแล้ว!`);
    } else {
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: identifier,
        username: identifier,
        storeCode: storeInfo.storeCode,
        status: 'approved',
        joinedAt: new Date().toLocaleString('th-TH')
      };
      setStaffMembers([newStaff, ...staffMembers]);
      alert(`ดึงและอนุมัติพนักงานไอดี "${identifier}" เข้าสังกัดร้านเรียบร้อยแล้ว!`);
    }
  };

  // เจ้าของร้านอนุมัติพนักงาน
  const handleApproveStaff = (staffId: string) => {
    setStaffMembers(staffMembers.map(s => s.id === staffId ? { ...s, status: 'approved' } : s));
  };

  // เจ้าของร้านปฏิเสธคำขอ
  const handleRejectStaff = (staffId: string) => {
    setStaffMembers(staffMembers.filter(s => s.id !== staffId));
  };

  // เจ้าของร้านลบ/เพิกถอนพนักงาน
  const handleRemoveStaff = (staffId: string) => {
    setStaffMembers(staffMembers.filter(s => s.id !== staffId));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('florist_current_user', JSON.stringify(user));
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('florist_current_user');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (newStatus === 'delivered' && targetOrder.paymentStatus === 'unpaid') {
      setPaymentGuardOrder(targetOrder);
      return;
    }

    setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  const handleConfirmPaymentAndDeliver = (method: 'cash' | 'qr') => {
    if (!paymentGuardOrder) return;
    setOrders(orders.map(o => o.id === paymentGuardOrder.id ? {
      ...o,
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: method
    } : o));
    setPaymentGuardOrder(null);
  };

  const handleProceedUnpaidAndDeliver = () => {
    if (!paymentGuardOrder) return;
    setOrders(orders.map(o => o.id === paymentGuardOrder.id ? { ...o, orderStatus: 'delivered' } : o));
    setPaymentGuardOrder(null);
  };

  const handleTogglePayment = (orderId: string) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const nextStatus = o.paymentStatus === 'paid' ? 'unpaid' : 'paid';
        return {
          ...o,
          paymentStatus: nextStatus,
          paymentMethod: nextStatus === 'paid' ? (o.paymentMethod || 'qr') : undefined
        };
      }
      return o;
    }));
  };

  // จัดการออเดอร์ใหม่ พร้อมตัดสต็อกอัตโนมัติ
  const handleAddOrder = (newOrderData: any) => {
    const newId = `ord-${Date.now()}`;
    const orderNumber = `ORD-202610-${(orders.length + 1).toString().padStart(3, '0')}`;
    const newOrder: Order = {
      ...newOrderData,
      id: newId,
      orderNumber,
      orderStatus: 'pending_arrangement',
      createdAt: new Date().toISOString()
    };

    // ตัดสต็อกสินค้าดอกไม้และโอเอซิส
    setProducts(prevProducts => prevProducts.map(p => {
      if (p.name === newOrderData.flowerType) {
        return { ...p, stockQuantity: Math.max(0, p.stockQuantity - (newOrderData.bouquetCount || 1)) };
      }
      if (newOrderData.useOasis && (p.name.includes('โอเอซิส') || p.id === 'p-6')) {
        const oasisDeduct = newOrderData.oasisCount || 1;
        return { ...p, stockQuantity: Math.max(0, p.stockQuantity - oasisDeduct) };
      }
      return p;
    }));

    setOrders([newOrder, ...orders]);
    setSelectedSlipOrder(newOrder);
    setActiveTab('home');
  };

  // จัดการสินค้า
  const handleAddProduct = (newProd: Omit<ProductItem, 'id'>) => {
    const id = `p-${Date.now()}`;
    setProducts([...products, { ...newProd, id }]);
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // จัดการหมู่บ้าน
  const handleAddVillage = (newVillage: Omit<VillageItem, 'id'>) => {
    const id = `v-${Date.now()}`;
    setVillages(prev => [...prev, { ...newVillage, id }]);
  };

  const handleUpdateVillage = (updated: VillageItem) => {
    setVillages(prev => prev.map(v => v.id === updated.id ? updated : v));
  };

  const handleDeleteVillage = (id: string) => {
    setVillages(prev => prev.filter(v => v.id !== id));
  };

  const handleResetVillages = () => {
    setVillages(DEFAULT_VILLAGES);
  };

  // รับเข้าสต็อก (Restock) พร้อมลงบัญชีรายจ่าย
  const handleRestock = (productId: string, quantityToAdd: number, unitCost: number, recordAsExpense: boolean) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    setProducts(products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stockQuantity: p.stockQuantity + quantityToAdd,
          costPrice: unitCost > 0 ? unitCost : p.costPrice
        };
      }
      return p;
    }));

    if (recordAsExpense) {
      const totalAmount = quantityToAdd * unitCost;
      setExpenses([
        {
          id: `exp-${Date.now()}`,
          title: `ซื้อสต็อก: ${target.name} (${quantityToAdd} ${target.unit})`,
          amount: totalAmount,
          category: 'stock_purchase',
          date: new Date().toISOString().split('T')[0]
        },
        ...expenses
      ]);
    }
  };

  // จัดการค่าใช้จ่ายร้าน
  const handleAddExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    setExpenses([{ ...expense, id: `exp-${Date.now()}` }, ...expenses]);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(expenses.filter(e => e.id !== expenseId));
  };

  if (!currentUser) {
    return (
      <AuthPage 
        onLoginSuccess={handleLogin}
        onCreateStore={handleCreateStore}
        onRegisterStaff={handleRegisterStaff}
        storeInfo={storeInfo}
      />
    );
  }

  // ตรวจสอบว่าพนักงานอยู่ระหว่างรอการยืนยัน/อนุมัติจากเจ้าของร้านหรือไม่
  const currentStaffRecord = staffMembers.find(s => s.username === currentUser.username || s.id === currentUser.id);
  const isPendingStaff = currentUser.role === 'staff' && (currentStaffRecord?.status === 'pending' || currentUser.status === 'pending');

  if (isPendingStaff) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-amber-50 via-rose-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md max-w-md w-full rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-200 animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
              ⏳ บัญชีอยู่ระหว่างรอการยืนยัน
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-2">
              สวัสดีคุณ {currentUser.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              คุณได้สมัครเข้าร่วมสังกัด <b>{storeInfo.storeName}</b> (รหัสร้าน: <span className="font-mono font-bold text-amber-700">{storeInfo.storeCode}</span>)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-left space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>ต้องการการยืนยันจากเจ้าของร้าน:</span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              ระบบร้านดอกไม้กำหนดให้ <b>เจ้าของร้าน ({storeInfo.ownerName})</b> ต้องเป็นผู้กดยืนยัน/อนุมัติสิทธิ์ หรือดึงไอดีของคุณ (@{currentUser.username}) ก่อน คุณจึงจะสามารถเปิดบิล POS และจัดการคิวงานหน้าร้านได้
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                const refreshed = staffMembers.find(s => s.username === currentUser.username || s.id === currentUser.id);
                if (refreshed && refreshed.status === 'approved') {
                  const updatedUser: User = { ...currentUser, status: 'approved' };
                  setCurrentUser(updatedUser);
                  localStorage.setItem('florist_current_user', JSON.stringify(updatedUser));
                  alert('🎉 บัญชีของคุณได้รับการอนุมัติจากเจ้าของร้านแล้ว!');
                } else {
                  alert('⏳ บัญชียังอยู่ระหว่างรอการอนุมัติ กรุณาติดต่อเจ้าของร้านเพื่อกดยืนยันสิทธิ์');
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-bold rounded-2xl shadow-md shadow-amber-300/40 text-xs active:scale-95 transition"
            >
              🔄 ตรวจสอบสถานะการอนุมัติ (Refresh)
            </button>

            <button
              type="button"
              onClick={() => {
                const ownerUser: User = {
                  id: 'owner-1',
                  username: 'owner',
                  name: storeInfo.ownerName,
                  role: 'owner',
                  storeCode: storeInfo.storeCode,
                  status: 'approved'
                };
                setCurrentUser(ownerUser);
                localStorage.setItem('florist_current_user', JSON.stringify(ownerUser));
                setActiveTab('finance');
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs active:scale-95 transition"
            >
              👑 สลับไปเป็นเจ้าของร้าน (เพื่อไปกดยืนยันอนุมัติ)
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 text-rose-500 hover:text-rose-600 text-xs font-semibold"
            >
              🚪 ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        user={currentUser} 
        activeTab={activeTab} 
        setActiveTab={(t: any) => setActiveTab(t)} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'home' && (
          <DashboardPage 
            user={currentUser}
            orders={orders}
            onOpenPOS={() => setActiveTab('pos')}
            onUpdateStatus={handleUpdateOrderStatus}
            onViewSlip={(o) => setSelectedSlipOrder(o)}
            onTogglePayment={handleTogglePayment}
          />
        )}

        {activeTab === 'pos' && (
          <POSPage 
            products={products}
            villages={villages}
            onAddOrder={handleAddOrder}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'board' && (
          <KanbanPage 
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onViewSlip={(o) => setSelectedSlipOrder(o)}
            onTogglePayment={handleTogglePayment}
          />
        )}

        {activeTab === 'finance' && currentUser.role === 'owner' && (
          <FinancePage 
            user={currentUser} 
            orders={orders}
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onRestock={handleRestock}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            storeInfo={storeInfo}
            staffMembers={staffMembers}
            onPullStaff={handlePullStaff}
            onApproveStaff={handleApproveStaff}
            onRejectStaff={handleRejectStaff}
            onRemoveStaff={handleRemoveStaff}
            onUpdateStoreInfo={handleUpdateStoreInfo}
            villages={villages}
            onAddVillage={handleAddVillage}
            onUpdateVillage={handleUpdateVillage}
            onDeleteVillage={handleDeleteVillage}
            onResetVillages={handleResetVillages}
          />
        )}
      </main>

      <BottomNav 
        role={currentUser.role}
        activeTab={activeTab}
        setActiveTab={(t: any) => setActiveTab(t)}
      />

      <FloristSlipModal 
        isOpen={Boolean(selectedSlipOrder)}
        order={selectedSlipOrder}
        storeInfo={storeInfo}
        onClose={() => setSelectedSlipOrder(null)}
      />

      <PaymentConfirmModal 
        isOpen={Boolean(paymentGuardOrder)}
        order={paymentGuardOrder}
        onClose={() => setPaymentGuardOrder(null)}
        onConfirmPayment={handleConfirmPaymentAndDeliver}
        onProceedUnpaid={handleProceedUnpaidAndDeliver}
      />
    </div>
  );
};
