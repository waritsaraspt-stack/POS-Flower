import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../types';
import { 
  Search, 
  Filter, 
  Clock, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  FileText, 
  CreditCard,
  MessageSquare,
  Flower,
  X,
  Phone,
  User as UserIcon,
  Layers
} from 'lucide-react';

interface Props {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewSlip: (order: Order) => void;
  onTogglePayment: (orderId: string) => void;
}

interface ColumnConfig {
  id: OrderStatus;
  title: string;
  shortTitle: string;
  stepNumber: number;
  icon: React.ElementType;
  color: string;
  badgeBg: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  ringColor: string;
}

export const KanbanPage: React.FC<Props> = ({ 
  orders, 
  onUpdateStatus, 
  onViewSlip, 
  onTogglePayment 
}) => {
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'all' | PaymentStatus>('all');

  const columns: ColumnConfig[] = [
    { 
      id: 'pending_arrangement', 
      title: '1. รอจัดช่อ', 
      shortTitle: 'รอจัดช่อ',
      stepNumber: 1,
      icon: Clock,
      color: 'border-amber-300 text-amber-700 bg-amber-50/60',
      badgeBg: 'bg-amber-100 text-amber-800',
      activeBg: 'bg-amber-500 text-white shadow-amber-200',
      activeBorder: 'border-amber-500',
      activeText: 'text-amber-700',
      ringColor: 'ring-amber-400/30'
    },
    { 
      id: 'arranged', 
      title: '2. จัดเสร็จแล้ว', 
      shortTitle: 'จัดเสร็จแล้ว',
      stepNumber: 2,
      icon: Sparkles,
      color: 'border-indigo-300 text-indigo-700 bg-indigo-50/60',
      badgeBg: 'bg-indigo-100 text-indigo-800',
      activeBg: 'bg-indigo-500 text-white shadow-indigo-200',
      activeBorder: 'border-indigo-500',
      activeText: 'text-indigo-700',
      ringColor: 'ring-indigo-400/30'
    },
    { 
      id: 'waiting_delivery', 
      title: '3. รอจัดส่ง/รับหน้าร้าน', 
      shortTitle: 'รอส่ง/รับหน้าร้าน',
      stepNumber: 3,
      icon: Truck,
      color: 'border-blue-300 text-blue-700 bg-blue-50/60',
      badgeBg: 'bg-blue-100 text-blue-800',
      activeBg: 'bg-blue-500 text-white shadow-blue-200',
      activeBorder: 'border-blue-500',
      activeText: 'text-blue-700',
      ringColor: 'ring-blue-400/30'
    },
    { 
      id: 'delivered', 
      title: '4. จัดส่งแล้ว', 
      shortTitle: 'จัดส่งแล้ว',
      stepNumber: 4,
      icon: CheckCircle2,
      color: 'border-emerald-300 text-emerald-700 bg-emerald-50/60',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      activeBg: 'bg-emerald-500 text-white shadow-emerald-200',
      activeBorder: 'border-emerald-500',
      activeText: 'text-emerald-700',
      ringColor: 'ring-emerald-400/30'
    }
  ];

  // คำนวณจำนวนในแต่ละสถานะ (อิง search/payment)
  const statusCounts = useMemo(() => {
    const baseList = orders.filter(o => {
      const matchesSearch = searchQuery === '' || 
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.customerPhone ? o.customerPhone.includes(searchQuery) : false) ||
        o.flowerType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPayment = selectedPayment === 'all' || o.paymentStatus === selectedPayment;
      return matchesSearch && matchesPayment;
    });

    return {
      all: baseList.length,
      pending_arrangement: baseList.filter(o => o.orderStatus === 'pending_arrangement').length,
      arranged: baseList.filter(o => o.orderStatus === 'arranged').length,
      waiting_delivery: baseList.filter(o => o.orderStatus === 'waiting_delivery').length,
      delivered: baseList.filter(o => o.orderStatus === 'delivered').length
    };
  }, [orders, searchQuery, selectedPayment]);

  // กรองออเดอร์ตามตัวเลือกทั้งหมด
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (selectedStatus !== 'all' && order.orderStatus !== selectedStatus) {
        return false;
      }
      if (selectedPayment !== 'all' && order.paymentStatus !== selectedPayment) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesOrderNum = order.orderNumber.toLowerCase().includes(query);
        const matchesName = order.customerName.toLowerCase().includes(query);
        const matchesPhone = order.customerPhone ? order.customerPhone.includes(query) : false;
        const matchesFlower = order.flowerType.toLowerCase().includes(query);
        if (!matchesOrderNum && !matchesName && !matchesPhone && !matchesFlower) {
          return false;
        }
      }
      return true;
    });
  }, [orders, selectedStatus, selectedPayment, searchQuery]);

  // คอมโพเนนต์การ์ดออเดอร์
  const renderOrderCard = (order: Order) => {
    return (
      <div 
        key={order.id} 
        className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-800 tracking-wide">{order.orderNumber}</span>
            <div className="text-[11px] text-slate-400">
              {new Date(order.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => onTogglePayment(order.id)}
            className={`text-[11px] px-2.5 py-1 rounded-full font-semibold transition flex items-center gap-1 ${
              order.paymentStatus === 'paid' 
                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                : 'bg-rose-100 text-rose-700 hover:bg-rose-200 animate-pulse'
            }`}
            title="คลิกเพื่อสลับสถานะชำระเงิน"
          >
            <CreditCard className="w-3 h-3" />
            {order.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'ยังไม่ชำระ'}
          </button>
        </div>

        {/* ข้อมูลลูกค้า */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl space-y-1">
          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{order.customerName}</span>
          </div>
          {order.customerPhone && order.customerPhone.trim() !== '' && (
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <a href={`tel:${order.customerPhone}`} className="hover:underline">{order.customerPhone}</a>
            </div>
          )}
        </div>

        {/* ข้อมูลดอกไม้ */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1 font-medium">
              <Flower className="w-3.5 h-3.5 text-rose-500" />
              {order.flowerType}
            </span>
            <span className="font-bold text-slate-900">
              {order.bouquetCount} {order.isBouquet !== false ? 'ช่อ' : 'ก้าน/กำ'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pt-1">
            {order.deliveryMethod === 'delivery_service' ? (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200 flex items-center gap-1">
                <span>🛵</span>
                <span>ส่ง: {order.deliveryMoo || 'จัดส่งถึงที่'}</span>
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                🏠 รับหน้าร้าน
              </span>
            )}
            {order.isFreshFlower && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                🌸 ดอกไม้สด
              </span>
            )}
            {order.isBouquet !== false && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-medium">
                💐 งานจัดช่อ
              </span>
            )}
            {order.useOasis && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-medium">
                💧 ปักโอเอซิส
              </span>
            )}
          </div>
        </div>

        {/* ข้อความบนการ์ด */}
        {order.cardMessage && (
          <div className="p-2 rounded-xl bg-pink-50/60 border border-pink-100 text-[11px] text-pink-700 flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="line-clamp-2 italic">"{order.cardMessage}"</div>
          </div>
        )}

        {/* เวลานัดหมาย */}
        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <span className="text-slate-500 text-[11px]">เวลานัดรับ/ส่ง:</span>
          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
            {new Date(order.pickupTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
          </span>
        </div>

        {/* ปุ่มจัดการสถานะ */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => onViewSlip(order)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
            title="ดูใบสลิปจัดดอกไม้"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>สลิป</span>
          </button>

          {order.orderStatus === 'pending_arrangement' && (
            <button 
              type="button"
              onClick={() => onUpdateStatus(order.id, 'arranged')}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition"
            >
              จัดเสร็จแล้ว ➔
            </button>
          )}

          {order.orderStatus === 'arranged' && (
            <button 
              type="button"
              onClick={() => onUpdateStatus(order.id, 'waiting_delivery')}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-semibold shadow-sm transition"
            >
              พร้อมส่ง ➔
            </button>
          )}

          {order.orderStatus === 'waiting_delivery' && (
            <button 
              type="button"
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              จัดส่งแล้ว ✓
            </button>
          )}

          {order.orderStatus === 'delivered' && (
            <div className="flex-1 py-1.5 text-center text-xs text-emerald-600 font-semibold bg-emerald-50 rounded-xl">
              ✓ ส่งมอบสมบูรณ์
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black text-slate-800">กระดานติดตามคิวงาน</h2>
          <p className="text-xs text-slate-500">จัดการขั้นตอนจัดดอกไม้ ตรวจสอบคิว และคุมสถานะการชำระเงิน</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 font-semibold text-slate-600">
            แสดง {filteredOrders.length} จาก {orders.length} ออเดอร์
          </span>
        </div>
      </div>

      {/* แถบตัวกรองและค้นหา */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        {/* แถวค้นหาและตัวกรองการชำระเงิน */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* กล่องค้นหา */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า, เบอร์โทร..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ตัวกรองสถานะการเงิน (ดีไซน์แสงและเงา 3D Tactile Buttons) */}
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-slate-100 to-slate-200/70 p-1.5 rounded-2xl border border-slate-300/70 shadow-inner shrink-0">
            <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">การชำระ:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedPayment('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                selectedPayment === 'all'
                  ? 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/35 border-t border-slate-500 ring-1 ring-slate-950'
                  : 'bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => setSelectedPayment('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                selectedPayment === 'paid'
                  ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/40 border-t border-emerald-300 ring-2 ring-emerald-400/40'
                  : 'bg-white/90 hover:bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs hover:-translate-y-0.5'
              }`}
            >
              ✓ ชำระแล้ว
            </button>
            <button
              type="button"
              onClick={() => setSelectedPayment('unpaid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                selectedPayment === 'unpaid'
                  ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/40 border-t border-rose-300 ring-2 ring-rose-400/40'
                  : 'bg-white/90 hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-xs hover:-translate-y-0.5'
              }`}
            >
              ✕ ยังไม่ชำระ
            </button>
          </div>
        </div>

        {/* แผงปุ่มเลือกสถานะแบบ Card Grid (ไม่ต้องเลื่อนดู เห็นครบทุกสถานะในหน้าเดียว) */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>กดเลือกสถานะงานที่ต้องการดู:</span>
            {selectedStatus !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className="text-rose-500 hover:text-rose-600 font-bold underline text-[11px]"
              >
                ดูทุกขั้นตอน
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 sm:gap-2">
            {/* 1. ปุ่มทั้งหมด */}
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`col-span-2 md:col-span-1 p-2 sm:p-2.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                selectedStatus === 'all'
                  ? 'bg-slate-800 text-white border-slate-900 shadow-md ring-2 ring-slate-800/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedStatus === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-bold leading-tight">ทุกขั้นตอน</div>
                  <div className={`text-[9px] hidden sm:block leading-tight ${
                    selectedStatus === 'all' ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    บอร์ดรวม 4 เสา
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shrink-0 ${
                selectedStatus === 'all' ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-700'
              }`}>
                {statusCounts.all}
              </span>
            </button>

            {/* 2. ปุ่ม 4 สถานะ */}
            {columns.map(col => {
              const count = statusCounts[col.id];
              const isSelected = selectedStatus === col.id;
              const Icon = col.icon;

              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedStatus(col.id)}
                  className={`p-2 sm:p-2.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? `${col.activeBg} ${col.activeBorder} shadow-md ring-2 ${col.ringColor}`
                      : `bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-xs`
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : col.badgeBg
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-[11px] sm:text-xs font-bold leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}>
                        {col.shortTitle}
                      </div>
                      <div className={`text-[9px] hidden sm:block leading-tight ${
                        isSelected ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        ขั้นที่ {col.stepNumber}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shrink-0 ${
                    isSelected ? 'bg-white text-slate-900' : col.badgeBg
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* พื้นที่แสดงกระดาน / รายการออเดอร์ */}
      {selectedStatus === 'all' ? (
        /* แสดงผลมุมมอง 4 คอลัมน์ (Kanban View) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map(col => {
            const colOrders = filteredOrders.filter(o => o.orderStatus === col.id);
            const Icon = col.icon;

            return (
              <div 
                key={col.id} 
                className="bg-slate-100/70 rounded-3xl p-3.5 border border-slate-200/80 space-y-3"
              >
                {/* หัวคอลัมน์ */}
                <div className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-between shadow-sm bg-white ${col.activeBorder}`}>
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${col.activeText}`} />
                    <span className="text-slate-800">{col.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeBg}`}>
                    {colOrders.length}
                  </span>
                </div>

                {/* รายการการ์ดในคอลัมน์ */}
                <div className="space-y-3 min-h-[350px]">
                  {colOrders.length === 0 ? (
                    <div className="py-16 text-center text-xs text-slate-400 bg-white/60 rounded-2xl border border-dashed border-slate-200">
                      ไม่มีออเดอร์ในขั้นตอนนี้
                    </div>
                  ) : (
                    colOrders.map(order => renderOrderCard(order))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* แสดงผลมุมมองโฟกัสเฉพาะสถานะที่เลือก (Single Status Focus View) */
        <div className="space-y-4">
          {(() => {
            const currentConfig = columns.find(c => c.id === selectedStatus);
            if (!currentConfig) return null;
            const Icon = currentConfig.icon;

            return (
              <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${currentConfig.activeBg}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      {currentConfig.title}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full ${currentConfig.badgeBg}`}>
                        {filteredOrders.length} ออเดอร์
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">มุมมองเจาะลึกเฉพาะคิวงานในขั้นตอนนี้</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStatus('all')}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                >
                  ✕ ปิดดูรวม 4 เสา
                </button>
              </div>
            );
          })()}

          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Filter className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">ไม่พบออเดอร์ในขั้นตอนนี้</div>
              <p className="text-xs text-slate-400">ยังไม่มีคิวงานที่ตรงกับเงื่อนไขการค้นหา/การชำระเงิน</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedPayment('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map(order => renderOrderCard(order))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
