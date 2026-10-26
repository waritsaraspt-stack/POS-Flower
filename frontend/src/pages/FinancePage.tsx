import React, { useState, useEffect } from 'react';
import { Order, User, ProductItem, ExpenseItem, StoreInfo, StaffMember, VillageItem } from '../types';
import { 
  Banknote, 
  QrCode, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  Layers, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Flower2,
  FileSpreadsheet,
  Store,
  UserPlus,
  Copy,
  Check,
  Clock,
  UserCheck,
  Users,
  Settings,
  Save,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  MapPin,
  RotateCcw
} from 'lucide-react';

interface Props {
  user: User;
  orders: Order[];
  products: ProductItem[];
  onAddProduct: (product: Omit<ProductItem, 'id'>) => void;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
  onRestock: (productId: string, quantityToAdd: number, unitCost: number, recordAsExpense: boolean) => void;
  expenses: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
  storeInfo: StoreInfo;
  staffMembers: StaffMember[];
  onPullStaff: (identifier: string) => void;
  onApproveStaff: (staffId: string) => void;
  onRejectStaff: (staffId: string) => void;
  onRemoveStaff: (staffId: string) => void;
  onUpdateStoreInfo: (updatedInfo: Partial<StoreInfo>) => void;
  villages?: VillageItem[];
  onAddVillage?: (village: Omit<VillageItem, 'id'>) => void;
  onUpdateVillage?: (village: VillageItem) => void;
  onDeleteVillage?: (villageId: string) => void;
  onResetVillages?: () => void;
}

export const FinancePage: React.FC<Props> = ({ 
  user, 
  orders,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRestock,
  expenses,
  onAddExpense,
  onDeleteExpense,
  storeInfo,
  staffMembers,
  onPullStaff,
  onApproveStaff,
  onRejectStaff,
  onRemoveStaff,
  onUpdateStoreInfo,
  villages = [],
  onAddVillage,
  onUpdateVillage,
  onDeleteVillage,
  onResetVillages
}) => {
  if (user.role !== 'owner') {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-rose-100">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">ปฏิเสธการเข้าถึง</h3>
        <p className="text-sm text-slate-500">ข้อมูลบัญชีและการเงินสงวนสิทธิ์เฉพาะบัญชีเจ้าของร้านเท่านั้น</p>
      </div>
    );
  }

  // ซับแท็บของหน้าเจ้าของร้าน (ค่าเริ่มต้นเป็นหน้ารวมการ์ดเมนู 'overview')
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'pnl' | 'products' | 'stock' | 'delivery' | 'store_settings' | 'staff'>('overview');
  const [showPullStaffForm, setShowPullStaffForm] = useState(false);
  const [pullStaffInput, setPullStaffInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // ข้อมูลตั้งค่าร้านและใบเสร็จ
  const [editStoreName, setEditStoreName] = useState(storeInfo.storeName);
  const [editTagline, setEditTagline] = useState(storeInfo.tagline || '');
  const [editPhone, setEditPhone] = useState(storeInfo.phone || '');
  const [editAddress, setEditAddress] = useState(storeInfo.address || '');
  const [editSocial, setEditSocial] = useState(storeInfo.socialContact || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    setEditStoreName(storeInfo.storeName);
    setEditTagline(storeInfo.tagline || '');
    setEditPhone(storeInfo.phone || '');
    setEditAddress(storeInfo.address || '');
    setEditSocial(storeInfo.socialContact || '');
  }, [storeInfo]);

  // Modal States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'flower' | 'bouquet'>('flower');
  const [prodCost, setProdCost] = useState<number | ''>(400);
  const [prodPrice, setProdPrice] = useState<number | ''>(850);
  const [prodStock, setProdStock] = useState<number | ''>(20);
  const [prodUnit, setProdUnit] = useState('ช่อ');
  const [prodMinAlert, setProdMinAlert] = useState<number | ''>(5);
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<'all' | 'flower' | 'bouquet'>('all');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<'all' | 'flower' | 'bouquet'>('all');

  // Restock Modal
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockProductId, setRestockProductId] = useState('');
  const [restockQty, setRestockQty] = useState<number | ''>(10);
  const [restockUnitCost, setRestockUnitCost] = useState<number | ''>(400);
  const [restockRecordExpense, setRestockRecordExpense] = useState(true);

  // Expense Form
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState<number | ''>('');
  const [expenseCategory, setExpenseCategory] = useState<'stock_purchase' | 'delivery' | 'utility' | 'salary' | 'other'>('stock_purchase');

  // Village Management Modal
  const [showVillageModal, setShowVillageModal] = useState(false);
  const [editingVillage, setEditingVillage] = useState<VillageItem | null>(null);
  const [villageName, setVillageName] = useState('');
  const [villageFee, setVillageFee] = useState<number | ''>('');
  const [villageCost, setVillageCost] = useState<number | ''>('');

  const openAddVillage = () => {
    setEditingVillage(null);
    setVillageName('');
    setVillageFee(40);
    setVillageCost(30);
    setShowVillageModal(true);
  };

  const openEditVillage = (village: VillageItem) => {
    setEditingVillage(village);
    setVillageName(village.name);
    setVillageFee(village.defaultFeeCharged ?? 40);
    setVillageCost(village.defaultCostActual ?? 30);
    setShowVillageModal(true);
  };

  const handleSaveVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageName.trim()) return;

    if (editingVillage && onUpdateVillage) {
      onUpdateVillage({
        ...editingVillage,
        name: villageName.trim(),
        defaultFeeCharged: villageFee === '' ? 0 : Number(villageFee),
        defaultCostActual: villageCost === '' ? 0 : Number(villageCost)
      });
    } else if (onAddVillage) {
      onAddVillage({
        name: villageName.trim(),
        defaultFeeCharged: villageFee === '' ? 0 : Number(villageFee),
        defaultCostActual: villageCost === '' ? 0 : Number(villageCost)
      });
    }
    setShowVillageModal(false);
  };

  // คำนวณตัวเลขบัญชีทั้งหมด
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const totalSales = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const cashSales = paidOrders.filter(o => o.paymentMethod === 'cash').reduce((sum, o) => sum + o.totalPrice, 0);
  const qrSales = paidOrders.filter(o => o.paymentMethod === 'qr').reduce((sum, o) => sum + o.totalPrice, 0);
  const unpaidSales = orders.filter(o => o.paymentStatus === 'unpaid').reduce((sum, o) => sum + o.totalPrice, 0);

  // ต้นทุนสินค้า (COGS) จากออเดอร์ที่ชำระแล้ว
  const totalProductCost = paidOrders.reduce((sum, o) => sum + (o.productCost || 0), 0);
  const grossProfit = totalSales - totalProductCost;
  const grossMarginPercent = totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(1) : '0';

  // สรุปค่าจัดส่ง
  const deliveryChargedTotal = paidOrders.reduce((sum, o) => sum + (o.deliveryFeeCharged || 0), 0);
  const deliveryCostActualTotal = paidOrders.reduce((sum, o) => sum + (o.deliveryCostActual || 0), 0);
  const deliveryNetProfit = deliveryChargedTotal - deliveryCostActualTotal;

  // รวมรายจ่ายดำเนินงานทั่วไป (ไม่รวม stock_purchase ซ้ำซ้อนถ้าอิงตามต้นทุนขาย หรือแสดงครบถ้วน)
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const operatingExpenses = expenses.filter(e => e.category !== 'stock_purchase').reduce((sum, e) => sum + e.amount, 0);

  // กำไรสุทธิแท้จริง (Net Profit) = กำไรขั้นต้น + กำไรจากค่าส่ง - ค่าใช้จ่ายร้านดำเนินงาน
  const netProfit = grossProfit + deliveryNetProfit - operatingExpenses;

  // สินค้าที่สต็อกต่ำกว่าเกณฑ์
  const lowStockProducts = products.filter(p => p.stockQuantity <= p.minStockAlert);

  // เปิด Modal เพิ่ม/แก้ไขสินค้า
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('flower');
    setProdCost(300);
    setProdPrice(750);
    setProdStock(15);
    setProdUnit('ช่อ');
    setProdMinAlert(5);
    setShowProductModal(true);
  };

  const openEditProduct = (p: ProductItem) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdCost(p.costPrice);
    setProdPrice(p.sellingPrice);
    setProdStock(p.stockQuantity);
    setProdUnit(p.unit);
    setProdMinAlert(p.minStockAlert);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: prodName,
        category: prodCategory,
        costPrice: Number(prodCost) || 0,
        sellingPrice: Number(prodPrice) || 0,
        stockQuantity: Number(prodStock) || 0,
        unit: prodUnit,
        minStockAlert: Number(prodMinAlert) || 0
      });
    } else {
      onAddProduct({
        name: prodName,
        category: prodCategory,
        costPrice: Number(prodCost) || 0,
        sellingPrice: Number(prodPrice) || 0,
        stockQuantity: Number(prodStock) || 0,
        unit: prodUnit,
        minStockAlert: Number(prodMinAlert) || 0
      });
    }
    setShowProductModal(false);
  };

  const handleQuickRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProductId || !restockQty) return;
    onRestock(restockProductId, Number(restockQty), Number(restockUnitCost) || 0, restockRecordExpense);
    setShowRestockModal(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;
    onAddExpense({
      title: expenseTitle,
      amount: Number(expenseAmount),
      category: expenseCategory,
      date: new Date().toISOString().split('T')[0]
    });
    setExpenseTitle('');
    setExpenseAmount('');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header และแท็บนำทาง (ไม่มี Scrollbar แนวนอนอีกต่อไป) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              👑 ศูนย์ควบคุมเฉพาะเจ้าของร้าน
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-1">
            {activeSubTab === 'overview' && 'ศูนย์รวมการ์ดเมนูบริหารร้าน (Owner Hub)'}
            {activeSubTab === 'pnl' && '📊 งบกำไร-ขาดทุน & บัญชีร้าน'}
            {activeSubTab === 'products' && '📦 จัดการสินค้า & แค็ตตาล็อก'}
            {activeSubTab === 'stock' && '📋 คลังสต็อก & รับเข้าสินค้า'}
            {activeSubTab === 'delivery' && '🛵 ค่าจัดส่ง & ไรเดอร์'}
            {activeSubTab === 'store_settings' && '⚙️ ข้อมูลร้าน & ใบเสร็จ'}
            {activeSubTab === 'staff' && '👥 จัดการพนักงาน & สิทธิ์การใช้งาน'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeSubTab === 'overview' && 'คลิกเลือกการ์ดเมนูเพื่อเข้าสู่ระบบการทำงานแต่ละส่วน'}
            {activeSubTab === 'pnl' && 'ดูสรุปยอดขาย ต้นทุน กำไรสุทธิ และบันทึกค่าใช้จ่ายร้าน'}
            {activeSubTab === 'products' && 'กำหนดราคาขายหน้าร้าน ต้นทุน และเพิ่มสินค้าใหม่'}
            {activeSubTab === 'stock' && 'ตรวจสอบสต็อกคงเหลือ และรับสินค้าเข้าสต็อก (Restock)'}
            {activeSubTab === 'delivery' && 'บริหารอัตราค่าส่ง เทียบต้นทุนจ่ายไรเดอร์จริง'}
            {activeSubTab === 'store_settings' && 'ตั้งค่าชื่อร้าน เบอร์ติดต่อ สโลแกน และ Live Preview ใบเสร็จ'}
            {activeSubTab === 'staff' && 'อนุมัติพนักงาน ดึงพนักงานด้วยไอดี และสิทธิ์เปิดบิล POS'}
          </p>
        </div>

        {/* ปุ่มกลับหน้าเมนูหลักเมื่ออยู่ในหน้ารายละเอียด */}
        {activeSubTab !== 'overview' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200/90 shadow-xs transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>‹ กลับหน้าการ์ดเมนูหลัก</span>
            </button>
          </div>
        )}
      </div>

      {/* แถบ Quick Switcher เมื่ออยู่ในหน้ารายละเอียด (ไม่มี scrollbar แนวนอนยาว) */}
      {activeSubTab !== 'overview' && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white/80 p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 px-2 text-xs text-slate-500 font-medium">
            <span>หมวดหมู่ด่วน:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'pnl', label: '📊 งบการเงิน' },
              { id: 'products', label: '📦 สินค้า' },
              { id: 'stock', label: `📋 สต็อก (${lowStockProducts.length > 0 ? `⚠️${lowStockProducts.length}` : products.length})` },
              { id: 'delivery', label: '🛵 ค่าส่ง' },
              { id: 'store_settings', label: '⚙️ ข้อมูลร้าน' },
              { id: 'staff', label: `👥 พนักงาน ${staffMembers.filter(s => s.status === 'pending').length > 0 ? `(รออนุมัติ ${staffMembers.filter(s => s.status === 'pending').length})` : ''}` },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
                  activeSubTab === tab.id
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* แจ้งเตือนสินค้าใกล้หมดสต็อกถ้ามี */}
      {lowStockProducts.length > 0 && activeSubTab !== 'stock' && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>มีสินค้า <b>{lowStockProducts.length} รายการ</b> ที่ใกล้หมดสต็อก (ต่ำกว่าเกณฑ์แจ้งเตือน)</span>
          </div>
          <button
            onClick={() => setActiveSubTab('stock')}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-[11px] shadow-sm transition cursor-pointer"
          >
            ไปดูสต็อก ➔
          </button>
        </div>
      )}

      {/* ========================================================
          หน้าหลัก: การ์ดเมนูศูนย์ควบคุม 6 หมวด (Card-Based Navigation)
          ======================================================== */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* แบนเนอร์หัวหน้าศูนย์ควบคุม */}
          <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 p-6 rounded-3xl border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-xs">
                  👑 OWNER HUB
                </span>
                <span className="text-xs font-bold text-amber-900">
                  ร้าน {storeInfo.storeName}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-800">ศูนย์ควบคุมและบริหารจัดการร้าน</h3>
              <p className="text-xs text-slate-500">
                คลิกเลือกการ์ดเมนูด้านล่าง เพื่อเข้าสู่ระบบการทำงาน ดูแลงบการเงิน สต็อก และทีมงาน
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-amber-200/80 shadow-xs text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">กำไรสุทธิรวม</div>
                <div className="text-lg font-black text-emerald-600">฿{netProfit.toLocaleString()}</div>
              </div>
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-amber-200/80 shadow-xs text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">รหัสร้าน</div>
                <div className="text-lg font-black text-amber-700 font-mono tracking-wider">{storeInfo.storeCode}</div>
              </div>
            </div>
          </div>

          {/* Grid รวมการ์ดเมนู 6 หมวดหลัก */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* การ์ด 1: งบกำไร-ขาดทุน */}
            <div
              onClick={() => setActiveSubTab('pnl')}
              className="group p-5 rounded-3xl bg-white border border-rose-100 hover:border-rose-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-100/50 to-pink-100/20 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition duration-300" />
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25 group-hover:scale-105 transition">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                    ยอดขาย ฿{totalSales.toLocaleString()}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-rose-600 transition">
                    📊 งบกำไร-ขาดทุน & บัญชีร้าน
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ดูสรุปยอดขายรวม ต้นทุนสินค้า กำไรสุทธิแท้จริง เงินสด/QR และบันทึกค่าใช้จ่ายร้าน
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative">
                <span className="font-bold text-emerald-600">กำไรสุทธิ ฿{netProfit.toLocaleString()}</span>
                <span className="text-rose-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  เข้าดูงบ ➔
                </span>
              </div>
            </div>

            {/* การ์ด 2: จัดการสินค้า & ราคา */}
            <div
              onClick={() => setActiveSubTab('products')}
              className="group p-5 rounded-3xl bg-white border border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100/50 to-blue-100/20 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition duration-300" />
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    {products.length} รายการ
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-indigo-600 transition">
                    📦 จัดการสินค้า & แค็ตตาล็อก
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    เพิ่ม/แก้ไขดอกไม้สด วัสดุอุปกรณ์ กำหนดราคาขายหน้าร้าน ราคาต้นทุน และหน่วยนับ
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative">
                <span className="font-semibold text-slate-500">หมวดดอกไม้ & อุปกรณ์</span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  จัดการสินค้า ➔
                </span>
              </div>
            </div>

            {/* การ์ด 3: คลังสต็อก & วัตถุดิบ */}
            <div
              onClick={() => setActiveSubTab('stock')}
              className="group p-5 rounded-3xl bg-white border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-orange-100/20 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition duration-300" />
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25 group-hover:scale-105 transition">
                    <Layers className="w-6 h-6" />
                  </div>
                  {lowStockProducts.length > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                      ⚠️ ใกล้หมด {lowStockProducts.length} ชนิด
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      ✓ สต็อกพร้อมขาย
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-amber-600 transition">
                    📋 คลังสต็อก & รับสินค้าเข้า
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ตรวจสอบสต็อกดอกไม้คงเหลือ แจ้งเตือนสินค้าใกล้หมด และปุ่มรับเข้าสต็อก (Restock) ด่วน
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative">
                <span className="font-semibold text-slate-500">คุมสต็อก & ทุนซื้อ</span>
                <span className="text-amber-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  ดูคลังสต็อก ➔
                </span>
              </div>
            </div>

            {/* การ์ด 4: ค่าจัดส่ง & ไรเดอร์ */}
            <div
              onClick={() => setActiveSubTab('delivery')}
              className="group p-5 rounded-3xl bg-white border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/50 to-cyan-100/20 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition duration-300" />
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${deliveryNetProfit >= 0 ? 'bg-blue-50 text-blue-700 border border-blue-200/60' : 'bg-rose-50 text-rose-700 border border-rose-200/60'}`}>
                    {deliveryNetProfit >= 0 ? `+฿${deliveryNetProfit.toLocaleString()}` : `-฿${Math.abs(deliveryNetProfit).toLocaleString()}`}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-blue-600 transition">
                    🛵 ค่าจัดส่ง & ไรเดอร์
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    บริหารค่าจัดส่งที่เก็บลูกค้า เทียบต้นทุนจ่ายไรเดอร์จริง และดูส่วนต่างกำไรค่าส่ง
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative">
                <span className="font-semibold text-slate-500">{paidOrders.filter(o => o.deliveryMethod === 'delivery_service').length} ออเดอร์ส่ง</span>
                <span className="text-blue-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  ดูระบบขนส่ง ➔
                </span>
              </div>
            </div>

            {/* การ์ด 5: ข้อมูลร้าน & ใบเสร็จ */}
            <div
              onClick={() => setActiveSubTab('store_settings')}
              className="group p-5 rounded-3xl bg-white border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-pink-100/20 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition duration-300" />
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25 group-hover:scale-105 transition">
                    <Store className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60 font-mono">
                    {storeInfo.storeCode}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-purple-600 transition">
                    ⚙️ ข้อมูลร้าน & ใบเสร็จ
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ตั้งค่าชื่อร้าน สโลแกน เบอร์โทร โซเชียล ที่อยู่ พร้อมดูพรีวิวหัวบิลและท้ายบิลใบเสร็จ
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative">
                <span className="font-semibold text-slate-500">Live Preview ใบเสร็จ</span>
                <span className="text-purple-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  ตั้งค่าร้าน ➔
                </span>
              </div>
            </div>

            {/* การ์ด 6: พนักงานร้าน & สิทธิ์การใช้งาน */}
            <div
              onClick={() => setActiveSubTab('staff')}
              className="group p-5 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-100/50 to-teal-100/20 rounded-full blur-2xl -mr-6 -mt-6 group-hover:scale-125 transition duration-300" />
              <div className="space-y-3 relative">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition">
                    <Users className="w-6 h-6" />
                  </div>
                  {staffMembers.filter(s => s.status === 'pending').length > 0 ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                      ⏳ รออนุมัติ {staffMembers.filter(s => s.status === 'pending').length} คน
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      พนักงาน {staffMembers.filter(s => s.status === 'approved').length} คน
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-800 group-hover:text-emerald-600 transition">
                    👥 พนักงานร้าน & สิทธิ์การใช้งาน
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    ยืนยันคำขอพนักงาน ดึงพนักงานด้วยไอดี และจัดการสิทธิ์เปิดบิล POS ประจำร้าน
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs relative">
                <span className="font-semibold text-slate-500">จัดการสิทธิ์ POS</span>
                <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition flex items-center gap-1">
                  จัดการพนักงาน ➔
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          แท็บที่ 1: งบกำไรขาดทุน & สรุปบัญชีร้าน (P&L Accounting)
          ======================================================== */}
      {activeSubTab === 'pnl' && (
        <div className="space-y-6">
          {/* แผง 4 การ์ดสรุปตัวเลขหลัก */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. ยอดขายรวม */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">ยอดขายรวม (Revenue)</span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
                  🌸
                </div>
              </div>
              <p className="text-3xl font-black text-slate-800 mt-2">฿{totalSales.toLocaleString()}</p>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                <span>จาก {paidOrders.length} บิลที่ชำระแล้ว</span>
              </div>
            </div>

            {/* 2. ต้นทุนสินค้า COGS */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">ต้นทุนดอกไม้ & วัสดุ</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-amber-600 mt-2">฿{totalProductCost.toLocaleString()}</p>
              <div className="mt-2 text-[11px] text-slate-400">
                <span>กำไรขั้นต้น: </span>
                <span className="font-bold text-slate-700">฿{grossProfit.toLocaleString()} ({grossMarginPercent}%)</span>
              </div>
            </div>

            {/* 3. ส่วนต่างค่าจัดส่ง */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">ผลต่างค่าส่ง (Logistics)</span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <p className={`text-3xl font-black mt-2 ${deliveryNetProfit >= 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                {deliveryNetProfit >= 0 ? `+฿${deliveryNetProfit.toLocaleString()}` : `-฿${Math.abs(deliveryNetProfit).toLocaleString()}`}
              </p>
              <div className="mt-2 text-[11px] text-slate-400">
                <span>เก็บลูกค้า ฿{deliveryChargedTotal} • จ่ายจริง ฿{deliveryCostActualTotal}</span>
              </div>
            </div>

            {/* 4. กำไรสุทธิแท้จริง (Net Profit) */}
            <div className="bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white p-5 rounded-3xl shadow-lg shadow-emerald-200/60 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-100">กำไรสุทธิแท้จริง (Net Profit)</span>
                <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                  🏆
                </div>
              </div>
              <p className="text-3xl font-black mt-2">฿{netProfit.toLocaleString()}</p>
              <div className="mt-2 text-[11px] text-emerald-100/90">
                <span>หักค่าใช้จ่ายร้านแล้วทั้งหมด</span>
              </div>
            </div>
          </div>

          {/* สรุปกระเป๋าเงิน (เงินสด vs QR vs ค้างชำระ) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">💵 เงินสดในลิ้นชัก (Cash)</p>
                <p className="text-xl font-bold text-slate-800 mt-1">฿{cashSales.toLocaleString()}</p>
              </div>
              <Banknote className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">📱 บัญชีเงินโอน QR / ธนาคาร</p>
                <p className="text-xl font-bold text-slate-800 mt-1">฿{qrSales.toLocaleString()}</p>
              </div>
              <QrCode className="w-8 h-8 text-blue-500" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-rose-500 font-medium">⚠️ ยอดรอเก็บเงิน (ค้างชำระ)</p>
                <p className="text-xl font-bold text-rose-600 mt-1">฿{unpaidSales.toLocaleString()}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
          </div>

          {/* บัญชีรายรับ-รายจ่ายร้าน และฟอร์มบันทึก */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ฟอร์มบันทึกรายจ่ายร้าน */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-500" />
                บันทึกค่าใช้จ่ายร้าน / ซื้อของ
              </h3>

              <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">รายการค่าใช้จ่าย</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ค่าไฟร้าน, ซื้อริบบิ้น, จ้างช่างเสริม"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">จำนวนเงิน (บาท)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="0"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">หมวดหมู่</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <option value="stock_purchase">📦 ซื้อดอกไม้/สต็อก</option>
                      <option value="utility">💡 ค่าน้ำ-ค่าไฟ</option>
                      <option value="delivery">🛵 ค่าขนส่ง</option>
                      <option value="salary">👤 ค่าแรง/พนักงาน</option>
                      <option value="other">📝 อื่นๆ</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition"
                >
                  + บันทึกรายจ่ายลงบัญชี
                </button>
              </form>
            </div>

            {/* ตารางประวัติรายจ่าย */}
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-800">
                  ประวัติค่าใช้จ่ายร้าน (รวม ฿{totalExpenses.toLocaleString()})
                </h3>
                <span className="text-xs text-slate-400">{expenses.length} รายการ</span>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {expenses.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-300">ยังไม่มีบันทึกรายจ่าย</div>
                ) : (
                  expenses.map(exp => (
                    <div key={exp.id} className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-800">{exp.title}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>{exp.date}</span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                            {exp.category === 'stock_purchase' && 'ซื้อสต็อก/ดอกไม้'}
                            {exp.category === 'utility' && 'ค่าน้ำ-ไฟ'}
                            {exp.category === 'delivery' && 'ค่าส่ง'}
                            {exp.category === 'salary' && 'ค่าแรง'}
                            {exp.category === 'other' && 'อื่นๆ'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-rose-600">-฿{exp.amount.toLocaleString()}</span>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 transition"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          แท็บที่ 2: จัดการสินค้าและบริการ (Products & Pricing)
          ======================================================== */}
      {activeSubTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">แค็ตตาล็อกสินค้าของร้าน</h3>
              <p className="text-xs text-slate-500">แบ่งเป็น 2 หมวดหมู่: 🌸 ดอกไม้สด และ 💐 จัดช่อ กำหนดราคาขายและต้นทุน</p>
            </div>
            <button
              onClick={openAddProduct}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-200 hover:from-rose-600 hover:to-pink-600 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ เพิ่มสินค้าใหม่</span>
            </button>
          </div>

          {/* ฟิลเตอร์หมวดหมู่สินค้า */}
          <div className="flex gap-2">
            <button
              onClick={() => setCatalogCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                catalogCategoryFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ทั้งหมด ({products.length})
            </button>
            <button
              onClick={() => setCatalogCategoryFilter('flower')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                catalogCategoryFilter === 'flower'
                  ? 'bg-rose-500 text-white shadow-xs shadow-rose-200'
                  : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              🌸 ดอกไม้สด ({products.filter(p => p.category === 'flower').length})
            </button>
            <button
              onClick={() => setCatalogCategoryFilter('bouquet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                catalogCategoryFilter === 'bouquet'
                  ? 'bg-purple-600 text-white shadow-xs shadow-purple-200'
                  : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              💐 จัดช่อ ({products.filter(p => p.category === 'bouquet').length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products
              .filter(p => catalogCategoryFilter === 'all' || p.category === catalogCategoryFilter)
              .map(p => {
              const margin = p.sellingPrice > 0 ? (((p.sellingPrice - p.costPrice) / p.sellingPrice) * 100).toFixed(1) : '0';
              const isLowStock = p.stockQuantity <= p.minStockAlert;

              return (
                <div key={p.id} className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.category === 'flower' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                        'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {p.category === 'flower' ? '🌸 ดอกไม้สด' : '💐 จัดช่อ'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800 mt-1">{p.name}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditProduct(p)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition"
                        title="ลบสินค้านี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* ราคาและกำไร */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">ราคาขาย</div>
                      <div className="text-xs font-black text-rose-600">฿{p.sellingPrice}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">ต้นทุน</div>
                      <div className="text-xs font-bold text-slate-600">฿{p.costPrice}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">กำไร/ชิ้น</div>
                      <div className="text-xs font-black text-emerald-600">+{margin}%</div>
                    </div>
                  </div>

                  {/* ข้อมูลสต็อก */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 text-[11px]">คงเหลือ:</span>
                    <span className={`font-bold px-2 py-0.5 rounded-lg text-xs ${
                      isLowStock ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {p.stockQuantity} {p.unit} {isLowStock && '⚠️'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          แท็บที่ 3: คลังสต็อก & รับเข้าสต็อก (Inventory & Restock)
          ======================================================== */}
      {activeSubTab === 'stock' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">คลังสต็อกวัตถุดิบ & การตัดสต็อก</h3>
              <p className="text-xs text-slate-500">ระบบตัดสต็อกอัตโนมัติเมื่อเปิดออเดอร์ และแจ้งเตือนเมื่อของใกล้หมด</p>
            </div>
            <button
              onClick={() => {
                if (products.length > 0) {
                  setRestockProductId(products[0].id);
                  setRestockUnitCost(products[0].costPrice);
                }
                setShowRestockModal(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-200 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Package className="w-4 h-4" />
              <span>+ เติมสต็อกสินค้า (Restock)</span>
            </button>
          </div>

          {/* ฟิลเตอร์หมวดหมู่สต็อก */}
          <div className="flex gap-2">
            <button
              onClick={() => setInventoryCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                inventoryCategoryFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              สต็อกทั้งหมด ({products.length})
            </button>
            <button
              onClick={() => setInventoryCategoryFilter('flower')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                inventoryCategoryFilter === 'flower'
                  ? 'bg-rose-500 text-white shadow-xs shadow-rose-200'
                  : 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              🌸 ดอกไม้สด ({products.filter(p => p.category === 'flower').length})
            </button>
            <button
              onClick={() => setInventoryCategoryFilter('bouquet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                inventoryCategoryFilter === 'bouquet'
                  ? 'bg-purple-600 text-white shadow-xs shadow-purple-200'
                  : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              💐 จัดช่อ ({products.filter(p => p.category === 'bouquet').length})
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3.5">ชื่อสินค้า</th>
                    <th className="p-3.5">หมวดหมู่</th>
                    <th className="p-3.5 text-center">คงเหลือในสต็อก</th>
                    <th className="p-3.5 text-right">ต้นทุน/หน่วย</th>
                    <th className="p-3.5 text-right">มูลค่าสต็อกรวม</th>
                    <th className="p-3.5 text-center">สถานะสต็อก</th>
                    <th className="p-3.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products
                    .filter(p => inventoryCategoryFilter === 'all' || p.category === inventoryCategoryFilter)
                    .map(p => {
                    const isLow = p.stockQuantity <= p.minStockAlert;
                    const stockValue = p.stockQuantity * p.costPrice;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-3.5 font-bold text-slate-800">{p.name}</td>
                        <td className="p-3.5 text-slate-500 font-semibold">
                          {p.category === 'flower' ? '🌸 ดอกไม้สด' : '💐 จัดช่อ'}
                        </td>
                        <td className="p-3.5 text-center font-black text-sm">
                          {p.stockQuantity} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                        </td>
                        <td className="p-3.5 text-right text-slate-600 font-medium">฿{p.costPrice}</td>
                        <td className="p-3.5 text-right font-bold text-slate-800">฿{stockValue.toLocaleString()}</td>
                        <td className="p-3.5 text-center">
                          {isLow ? (
                            <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                              ⚠️ สต็อกใกล้หมด (&le;{p.minStockAlert})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                              ✓ สต็อกพร้อมขาย
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => {
                              setRestockProductId(p.id);
                              setRestockUnitCost(p.costPrice);
                              setShowRestockModal(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px] transition"
                          >
                            + เติมของ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          แท็บที่ 4: สรุปค่าจัดส่ง & ไรเดอร์ (Delivery Analysis)
          ======================================================== */}
      {activeSubTab === 'delivery' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-800">สรุปผลต่างต้นทุนค่าจัดส่ง (Delivery Margin)</h3>
            <p className="text-xs text-slate-500">เปรียบเทียบค่าส่งที่เรียกเก็บจากลูกค้า กับต้นทุนที่จ่ายให้ไรเดอร์จริง</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <span className="text-xs text-blue-600 font-semibold">ค่าส่งที่เก็บจากลูกค้า</span>
                <p className="text-2xl font-black text-blue-700 mt-1">฿{deliveryChargedTotal.toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">ต้นทุนจ่ายไรเดอร์จริง</span>
                <p className="text-2xl font-black text-slate-700 mt-1">฿{deliveryCostActualTotal.toLocaleString()}</p>
              </div>

              <div className={`p-4 rounded-2xl border ${deliveryNetProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                <span className={`text-xs font-semibold ${deliveryNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {deliveryNetProfit >= 0 ? 'กำไรจากค่าจัดส่ง' : 'ขาดทุนจากค่าส่ง'}
                </span>
                <p className={`text-2xl font-black mt-1 ${deliveryNetProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {deliveryNetProfit >= 0 ? `+฿${deliveryNetProfit.toLocaleString()}` : `-฿${Math.abs(deliveryNetProfit).toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          {/* จัดการหมู่บ้าน & โซนจัดส่ง */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <MapPin className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">จัดการหมู่บ้าน & เขตจัดส่ง (Village & Delivery Management)</h3>
                    <p className="text-xs text-slate-500">กำหนดรายชื่อหมู่บ้านและค่าส่งเริ่มต้นสำหรับหน้าแคชเชียร์ POS</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onResetVillages && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('ต้องการคืนค่ารายชื่อหมู่บ้านเป็นค่าเริ่มต้น (ม.1 - ม.12) หรือไม่?')) {
                        onResetVillages();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                    title="คืนค่าเป็น ม.1 - ม.12 ค่าส่งเริ่มต้น ฿40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">คืนค่าเริ่มต้น</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={openAddVillage}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มหมู่บ้านใหม่</span>
                </button>
              </div>
            </div>

            {villages.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                ยังไม่มีรายการหมู่บ้านในระบบ คลิกปุ่ม "+ เพิ่มหมู่บ้านใหม่" หรือ "คืนค่าเริ่มต้น" ด้านบน
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {villages.map((v) => {
                  const fee = v.defaultFeeCharged ?? 40;
                  const cost = v.defaultCostActual ?? 30;
                  const margin = fee - cost;
                  return (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-rose-200 hover:bg-rose-50/30 transition group flex flex-col justify-between gap-3 shadow-[0_2px_6px_rgba(0,0,0,0.02)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-white border border-slate-200 text-rose-600 flex items-center justify-center shrink-0 text-xs font-black shadow-2xs">
                            📍
                          </span>
                          <span className="font-bold text-slate-800 text-xs truncate" title={v.name}>
                            {v.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditVillage(v)}
                            className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition cursor-pointer"
                            title="แก้ไข"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`ต้องการลบ "${v.name}" ใช่หรือไม่?`)) {
                                onDeleteVillage?.(v.id);
                              }
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                            title="ลบ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">เก็บลูกค้า</span>
                          <span className="font-bold text-blue-600">฿{fee}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">จ่ายไรเดอร์</span>
                          <span className="font-bold text-slate-600">฿{cost}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px]">ส่วนต่าง</span>
                          <span className={`font-black ${margin >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {margin >= 0 ? `+฿${margin}` : `-฿${Math.abs(margin)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* รายการออเดอร์เดลิเวอรี่ */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700">รายการออเดอร์จัดส่งทั้งหมด</h4>
            <div className="space-y-2">
              {orders.filter(o => o.deliveryMethod === 'delivery_service').length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-300">ยังไม่มีออเดอร์ที่เลือกบริการจัดส่ง</div>
              ) : (
                orders.filter(o => o.deliveryMethod === 'delivery_service').map(o => {
                  const charged = o.deliveryFeeCharged || 0;
                  const actual = o.deliveryCostActual || 0;
                  const diff = charged - actual;

                  return (
                    <div key={o.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{o.orderNumber}</span> • <span>{o.customerName}</span>
                        <div className="text-[11px] text-slate-400">{o.flowerType} ({o.bouquetCount} ช่อ)</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">เก็บลูกค้า: <b>฿{charged}</b></span>
                        <span className="text-slate-500">จ่ายไรเดอร์: <b>฿{actual}</b></span>
                        <span className={`font-black px-2 py-0.5 rounded-lg ${diff >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {diff >= 0 ? `+฿${diff}` : `-฿${Math.abs(diff)}`}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. ซับแท็บ: ข้อมูลร้านค้า & ข้อมูลบนใบเสร็จ (Store Profile & Receipt Branding)
          ======================================================== */}
      {activeSubTab === 'store_settings' && (
        <div className="space-y-6">
          {/* ข้อมูลโปรไฟล์ร้าน และ Store Code */}
          <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-rose-500/10 p-5 rounded-3xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/30">
                  <Store className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-base text-slate-800">{storeInfo.storeName}</h3>
                  <p className="text-xs text-slate-500">
                    เจ้าของร้าน: <b className="text-slate-700">{storeInfo.ownerName}</b> • ก่อตั้งเมื่อ {storeInfo.createdAt}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-purple-200 shadow-sm">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">รหัสร้าน (Store Code)</div>
                <div className="text-base font-black text-purple-700 font-mono tracking-wider">{storeInfo.storeCode}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(storeInfo.storeCode);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="ml-2 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 transition active:scale-95 flex items-center gap-1.5"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>

          {/* การตั้งค่าข้อมูลร้านค้า & ข้อมูลบนใบเสร็จ (Receipt Branding) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Settings className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    ตั้งค่าชื่อร้านและข้อมูลติดต่อบนใบเสร็จ (Receipt Branding)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    ข้อมูลส่วนนี้จะถูกนำไปแสดงที่หัวบิลและท้ายบิลใบเสร็จของร้านแบบอัตโนมัติ
                  </p>
                </div>
              </div>
              {saveSuccessMsg && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  บันทึกสำเร็จแล้ว!
                </span>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onUpdateStoreInfo({
                  storeName: editStoreName.trim(),
                  tagline: editTagline.trim(),
                  phone: editPhone.trim(),
                  address: editAddress.trim(),
                  socialContact: editSocial.trim()
                });
                setSaveSuccessMsg(true);
                setTimeout(() => setSaveSuccessMsg(false), 2500);
              }}
              className="space-y-3.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ชื่อร้านดอกไม้ (แสดงตัวโตบนหัวบิล) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    placeholder="เช่น Bloom Florist Studio"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    สโลแกน / คำอธิบายร้าน (ใต้ชื่อร้าน)
                  </label>
                  <input
                    type="text"
                    value={editTagline}
                    onChange={(e) => setEditTagline(e.target.value)}
                    placeholder="เช่น ร้านดอกไม้สดและบริการจัดช่อพรีเมียม"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    เบอร์โทรศัพท์ติดต่อร้าน (แสดงบนหัวบิล) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="เช่น 081-234-5678"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ช่องทางติดต่อโซเชียล / LINE ID (แสดงบนหัวบิล)
                  </label>
                  <input
                    type="text"
                    value={editSocial}
                    onChange={(e) => setEditSocial(e.target.value)}
                    placeholder="เช่น LINE: @bloomstudio / FB: BloomStudio"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ที่อยู่ร้าน / สาขา (แสดงบนหัวบิล)
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="เช่น 123/45 ถนนสุขุมวิท แขวงคลองเตย กรุงเทพฯ"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* ตัวอย่างพรีวิวหัวบิลและท้ายบิลแบบเรียลไทม์ */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  ตัวอย่างการแสดงผลบนหัวบิลและท้ายบิล (Live Preview):
                </span>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                  <div className="font-black text-sm text-slate-900">{editStoreName || 'ชื่อร้านของคุณ'}</div>
                  {editTagline && <div className="text-[10px] text-slate-500">{editTagline}</div>}
                  <div className="space-y-0.5 pt-0.5">
                    <p className="text-[9px] text-slate-600 font-medium leading-tight">
                      ติดต่อสอบถาม โทร {editPhone || 'เบอร์โทร'}
                    </p>
                    {editSocial && (
                      <p className="text-[9px] text-slate-600 font-medium leading-tight">
                        {editSocial}
                      </p>
                    )}
                    {editAddress && <p className="text-[8px] text-slate-400 leading-tight">{editAddress}</p>}
                  </div>
                  <div className="text-[9px] text-rose-500 font-bold mt-1 inline-block px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                    ใบเสร็จรับเงิน / ใบสั่งงานจัดดอกไม้
                  </div>
                  <div className="text-[9px] text-slate-400 pt-1.5 border-t border-dashed border-slate-200 mt-2">
                    ขอบคุณที่ไว้วางใจให้เราดูแลช่วงเวลาพิเศษของคุณ 💖
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-90 text-white font-bold text-xs rounded-2xl shadow-md shadow-pink-500/30 transition active:scale-95 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกการตั้งค่าร้านและใบเสร็จ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          6. ซับแท็บ: จัดการพนักงานร้าน (Staff Management)
          ======================================================== */}
      {activeSubTab === 'staff' && (
        <div className="space-y-6">
          {/* แบนเนอร์หัวข้อพนักงาน & สรุปจำนวน + ปุ่มเปิดฟอร์มดึงพนักงาน */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10 p-5 rounded-3xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/30">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-black text-base text-slate-800">จัดการพนักงานและสิทธิ์การใช้งาน</h3>
                <p className="text-xs text-slate-500">
                  พนักงานที่สังกัดร้าน {storeInfo.storeName} • มีสิทธิ์เปิดบิล POS และจัดการคิวงาน
                </p>
              </div>
            </div>

            {/* ปุ่มกดเปิด/ปิด การดึงพนักงานด้วยไอดี (ซ่อนไว้เป็นค่าเริ่มต้น) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPullStaffForm(prev => !prev)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95 border cursor-pointer ${
                  showPullStaffForm
                    ? 'bg-slate-150 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white border-transparent shadow-indigo-500/25'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{showPullStaffForm ? 'ซ่อนฟอร์มดึงพนักงาน ▲' : '+ ดึงพนักงานด้วยไอดี ▼'}</span>
              </button>
            </div>
          </div>

          {/* ฟอร์มดึงไอดีของพนักงานเข้าร้าน (จะแสดงเมื่อกดปุ่มเปิดเท่านั้น - ซ่อนไว้เป็นค่าเริ่มต้น) */}
          {showPullStaffForm && (
            <div className="bg-gradient-to-b from-indigo-50/70 to-white p-5 rounded-3xl border border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <UserPlus className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-indigo-950">ดึงไอดีพนักงานเข้าร้าน (Pull Staff ID)</h4>
                    <p className="text-[11px] text-slate-500">เจ้าของร้านสามารถระบุ Username หรือไอดีของพนักงานเพื่อดึงเข้าสังกัดร้านและอนุมัติสิทธิ์ได้ทันที</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPullStaffForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  ✕ ซ่อนฟอร์ม
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!pullStaffInput.trim()) return;
                  onPullStaff(pullStaffInput.trim());
                  setPullStaffInput('');
                  setShowPullStaffForm(false);
                }}
                className="flex flex-col sm:flex-row gap-2 pt-1"
              >
                <input
                  type="text"
                  placeholder="ระบุ Username หรือ ไอดีพนักงาน เช่น somjai, kamol_staff"
                  value={pullStaffInput}
                  onChange={(e) => setPullStaffInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-indigo-200 text-xs focus:ring-2 focus:ring-indigo-400 font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/30 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ดึงพนักงานเข้าร้าน & อนุมัติทันที</span>
                </button>
              </form>
            </div>
          )}

          {/* รายการคำขอเข้าร่วมร้าน รอการยืนยันจากเจ้าของร้าน (Pending Staff) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    คำขอเข้าร่วมร้าน (รอการยืนยัน/อนุมัติจากเจ้าของร้าน)
                  </h4>
                  <p className="text-[11px] text-slate-500">พนักงานที่ใช้รหัสร้านสมัครเข้ามา ต้องได้รับการยืนยันก่อนจึงจะเข้าใช้งานระบบ POS ได้</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                รออนุมัติ {staffMembers.filter(s => s.status === 'pending').length} คน
              </span>
            </div>

            {staffMembers.filter(s => s.status === 'pending').length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                ✓ ไม่มีคำขอรออนุมัติในขณะนี้ พนักงานทุกคนได้รับการยืนยันเรียบร้อยแล้ว
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {staffMembers.filter(s => s.status === 'pending').map(staff => (
                  <div key={staff.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                        {staff.name.charAt(0) || 'พ'}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-800">{staff.name}</div>
                        <div className="text-[11px] text-slate-500">@{staff.username} • ขอเข้าร่วมเมื่อ {staff.joinedAt}</div>
                        <div className="text-[10px] text-amber-700 font-semibold mt-0.5">⏳ รอเจ้าของร้านอนุมัติ</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApproveStaff(staff.id)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/30 active:scale-95 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ยืนยันอนุมัติ</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectStaff(staff.id)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-xs font-medium active:scale-95 transition cursor-pointer"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* รายชื่อพนักงานประจำร้านที่ได้รับอนุมัติแล้ว (Active Staff) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <UserCheck className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    พนักงานประจำร้านที่ได้รับอนุมัติแล้ว (Active Staff)
                  </h4>
                  <p className="text-[11px] text-slate-500">พนักงานที่มีสิทธิ์เปิดบิล POS จัดคิว และพิมพ์ใบเสร็จของร้าน</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                อนุมัติแล้ว {staffMembers.filter(s => s.status === 'approved').length} คน
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {staffMembers.filter(s => s.status === 'approved').map(staff => (
                <div key={staff.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {staff.name.charAt(0) || 'ส'}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <span>{staff.name}</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                          ✓ ได้รับอนุมัติ
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        ไอดี: @{staff.username} • เข้าร่วมเมื่อ {staff.joinedAt}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`ต้องการลบหรือเพิกถอนสิทธิ์พนักงาน "${staff.name}" หรือไม่?`)) {
                        onRemoveStaff(staff.id);
                      }
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="ลบพนักงาน"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          Modal: เพิ่ม / แก้ไขสินค้าและบริการ
          ======================================================== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800">
              {editingProduct ? 'แก้ไขสินค้า / บริการ' : 'เพิ่มสินค้า / บริการใหม่'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อสินค้า/บริการ *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ดอกทิวลิปสีขาว, ริบบิ้นสีทอง"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">หมวดหมู่ *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as 'flower' | 'bouquet')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-rose-400"
                >
                  <option value="flower">🌸 ดอกไม้สด</option>
                  <option value="bouquet">💐 จัดช่อ</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ราคาขายหน้าร้าน (฿)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ราคาต้นทุน (฿)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodCost}
                    onChange={(e) => setProdCost(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">หน่วยนับ</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ช่อ, ดอก, ก้อน"
                    value={prodUnit}
                    onChange={(e) => setProdUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">จำนวนสต็อก</label>
                  <input
                    type="number"
                    min="0"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">เตือนเมื่อ &le;</label>
                  <input
                    type="number"
                    min="0"
                    value={prodMinAlert}
                    onChange={(e) => setProdMinAlert(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-200 hover:from-rose-600"
                >
                  บันทึกสินค้า
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 border rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          Modal: เติมสต็อกสินค้า (Restock)
          ======================================================== */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              รับเข้าสต็อกสินค้า (Restock)
            </h3>

            <form onSubmit={handleQuickRestockSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">เลือกสินค้าที่จะเติมสต็อก</label>
                <select
                  value={restockProductId}
                  onChange={(e) => {
                    setRestockProductId(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) setRestockUnitCost(prod.costPrice);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.category === 'flower' ? '🌸' : '💐'} {p.name} (คงเหลือ {p.stockQuantity} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">จำนวนที่เติม</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ราคาต้นทุน/หน่วย (฿)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={restockUnitCost}
                    onChange={(e) => setRestockUnitCost(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-amber-900">
                  <span>มูลค่าที่ซื้อเข้าร้าน:</span>
                  <span>฿{((Number(restockQty) || 0) * (Number(restockUnitCost) || 0)).toLocaleString()}</span>
                </div>
                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={restockRecordExpense}
                    onChange={(e) => setRestockRecordExpense(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <span className="text-[11px] text-slate-600">ลงเป็นรายจ่ายในบัญชีร้านทันที</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  ยืนยันเติมสต็อก
                </button>
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2.5 border rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: เพิ่ม / แก้ไขหมู่บ้าน */}
      {showVillageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <MapPin className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-slate-800 text-sm">
                  {editingVillage ? 'แก้ไขข้อมูลหมู่บ้าน / เขตจัดส่ง' : 'เพิ่มหมู่บ้าน / เขตจัดส่งใหม่'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVillageModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVillage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อหมู่บ้าน / เขตจัดส่ง <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ม.1 บ้านหนองโน, ม.13 บ้านสันติสุข"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ค่าส่งเก็บลูกค้า (บาท)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="40"
                    value={villageFee}
                    onChange={(e) => setVillageFee(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ต้นทุนจ่ายไรเดอร์ (บาท)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="30"
                    value={villageCost}
                    onChange={(e) => setVillageCost(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                  />
                </div>
              </div>

              {/* Margin preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">ผลต่างกำไร/ขาดทุนค่าส่ง:</span>
                <span className={`font-black ${(Number(villageFee) || 0) - (Number(villageCost) || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(Number(villageFee) || 0) - (Number(villageCost) || 0) >= 0 ? '+' : ''}฿{(Number(villageFee) || 0) - (Number(villageCost) || 0)} ต่อเที่ยว
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                >
                  {editingVillage ? 'บันทึกการแก้ไข' : 'บันทึกหมู่บ้าน'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVillageModal(false)}
                  className="px-4 py-2.5 border rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
