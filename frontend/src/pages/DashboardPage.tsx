import React, { useState } from 'react';
import { Order, User, OrderStatus } from '../types';
import { Search, Plus, Phone, Clock, Truck, AlertCircle, FileText, X } from 'lucide-react';

interface Props {
  user: User;
  orders: Order[];
  onOpenPOS: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewSlip: (order: Order) => void;
  onTogglePayment: (orderId: string) => void;
}

export const DashboardPage: React.FC<Props> = ({
  user,
  orders,
  onOpenPOS,
  onUpdateStatus,
  onViewSlip,
  onTogglePayment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const totalOrders = orders.length;
  const pendingArrangement = orders.filter(o => o.orderStatus === 'pending_arrangement').length;
  const waitingDelivery = orders.filter(o => o.orderStatus === 'waiting_delivery').length;
  const unpaidCount = orders.filter(o => o.paymentStatus === 'unpaid').length;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerPhone ? order.customerPhone.includes(searchTerm) : false) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.flowerType.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unpaid') return order.paymentStatus === 'unpaid';
    if (selectedFilter === 'paid') return order.paymentStatus === 'paid';
    return order.orderStatus === selectedFilter;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">ศูนย์รวมงานและประวัติออเดอร์</h2>
          <p className="text-sm text-slate-500">จัดการคิวงาน ตรวจสอบการชำระเงิน และค้นหาออเดอร์ทั้งหมด</p>
        </div>
        <button 
          onClick={onOpenPOS}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-rose-200 transition active:scale-95"
        >
          <Plus className="w-5 h-5" /> รับออเดอร์ใหม่
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">ออเดอร์วันนี้</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{totalOrders}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">🌸</div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-500 font-medium">รอจัดช่อ</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingArrangement}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-500 font-medium">รอส่ง / รับหน้าร้าน</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{waitingDelivery}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-500 font-medium">ค้างชำระเงิน</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{unpaidCount}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, เลขออเดอร์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-gradient-to-b from-slate-100 to-slate-200/70 p-1.5 rounded-2xl border border-slate-300/70 shadow-inner shrink-0">
            <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1">
              <span className="hidden sm:inline">การชำระ:</span>
            </span>
            <button
              onClick={() => setSelectedFilter(selectedFilter === 'unpaid' || selectedFilter === 'paid' ? 'all' : selectedFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                selectedFilter !== 'unpaid' && selectedFilter !== 'paid'
                  ? 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/35 border-t border-slate-500 ring-1 ring-slate-950'
                  : 'bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200/90 shadow-xs hover:-translate-y-0.5'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setSelectedFilter('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                selectedFilter === 'paid'
                  ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/40 border-t border-emerald-300 ring-2 ring-emerald-400/40'
                  : 'bg-white/90 hover:bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs hover:-translate-y-0.5'
              }`}
            >
              ✓ จ่ายแล้ว
            </button>
            <button
              onClick={() => setSelectedFilter('unpaid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                selectedFilter === 'unpaid'
                  ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/40 border-t border-rose-300 ring-2 ring-rose-400/40'
                  : 'bg-white/90 hover:bg-rose-50 text-rose-700 border border-rose-200 shadow-xs hover:-translate-y-0.5'
              }`}
            >
              ✕ ยังไม่จ่าย ({unpaidCount})
            </button>
          </div>
        </div>

        {/* แผงปุ่มกรองสถานะงานแบบ Grid ไม่ต้องเลื่อนดู */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500">เลือกกรองตามสถานะงาน:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {[
              { id: 'all', label: 'ทั้งหมด', count: totalOrders, color: 'bg-slate-800 text-white', inactive: 'bg-slate-50 text-slate-700' },
              { id: 'pending_arrangement', label: 'รอจัดช่อ', count: pendingArrangement, color: 'bg-amber-500 text-white shadow-amber-200', inactive: 'bg-amber-50/70 text-amber-700 border-amber-200' },
              { id: 'arranged', label: 'จัดเสร็จแล้ว', count: orders.filter(o => o.orderStatus === 'arranged').length, color: 'bg-indigo-500 text-white shadow-indigo-200', inactive: 'bg-indigo-50/70 text-indigo-700 border-indigo-200' },
              { id: 'waiting_delivery', label: 'รอส่งมอบ', count: waitingDelivery, color: 'bg-blue-500 text-white shadow-blue-200', inactive: 'bg-blue-50/70 text-blue-700 border-blue-200' },
              { id: 'delivered', label: 'จัดส่งแล้ว', count: orders.filter(o => o.orderStatus === 'delivered').length, color: 'bg-emerald-500 text-white shadow-emerald-200', inactive: 'bg-emerald-50/70 text-emerald-700 border-emerald-200' },
            ].map((tab, idx) => {
              const isSelected = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between ${
                    idx === 0 ? 'col-span-2 sm:col-span-1' : ''
                  } ${
                    isSelected
                      ? `${tab.color} border-transparent shadow-md ring-2 ring-slate-400/20`
                      : `${tab.inactive} hover:bg-slate-100 border-slate-200`
                  }`}
                >
                  <span className="text-xs font-bold truncate">{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                    isSelected ? 'bg-white text-slate-900' : 'bg-white/80 shadow-xs'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <p className="text-slate-400 text-sm">ไม่พบรายการออเดอร์ที่ตรงกับการค้นหา</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:border-rose-100 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-base">{order.orderNumber}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                    order.orderStatus === 'pending_arrangement' ? 'bg-amber-100 text-amber-700' :
                    order.orderStatus === 'arranged' ? 'bg-indigo-100 text-indigo-700' :
                    order.orderStatus === 'waiting_delivery' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {order.orderStatus === 'pending_arrangement' ? 'รอจัดช่อ' :
                     order.orderStatus === 'arranged' ? 'จัดเสร็จแล้ว' :
                     order.orderStatus === 'waiting_delivery' ? 'รอจัดส่ง' : 'จัดส่งสำเร็จ'}
                  </span>

                  <button 
                    onClick={() => onTogglePayment(order.id)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold transition ${
                      order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                    }`}
                  >
                    {order.paymentStatus === 'paid' ? `จ่ายแล้ว (${order.paymentMethod === 'cash' ? 'เงินสด' : 'QR'})` : 'ยังไม่จ่าย'}
                  </button>
                </div>

                <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span>{order.customerName}</span>
                  {order.customerPhone && order.customerPhone.trim() !== '' && (
                    <a href={`tel:${order.customerPhone}`} className="text-xs text-rose-500 font-normal hover:underline flex items-center gap-0.5">
                      <Phone className="w-3 h-3" /> {order.customerPhone}
                    </a>
                  )}
                </div>

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700">
                    {order.flowerType} ({order.bouquetCount} {order.isBouquet !== false ? 'ช่อ' : 'ก้าน/กำ'})
                  </span>
                  <span>•</span>
                  {order.isFreshFlower && <span className="text-emerald-700 font-medium">🌸 ดอกไม้สด</span>}
                  {order.isBouquet !== false && <span className="text-pink-700 font-medium">💐 งานจัดช่อ</span>}
                  {order.useOasis && <span>• 💧 โอเอซิส</span>}
                  <span>•</span>
                  <span className="text-rose-600 font-medium">
                    นัดรับ: {new Date(order.pickupTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </span>
                  <span>•</span>
                  <span>{order.deliveryMethod === 'delivery_service' ? '🛵 บริการจัดส่ง' : '🏠 รับหน้าร้าน'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button 
                  onClick={() => onViewSlip(order)}
                  className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <FileText className="w-4 h-4 text-slate-400" /> สลิป
                </button>

                {order.orderStatus === 'pending_arrangement' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'arranged')}
                    className="py-2.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition"
                  >
                    จัดเสร็จแล้ว
                  </button>
                )}

                {order.orderStatus === 'arranged' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'waiting_delivery')}
                    className="py-2.5 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition"
                  >
                    พร้อมส่ง/รับ
                  </button>
                )}

                {order.orderStatus === 'waiting_delivery' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'delivered')}
                    className="py-2.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-200 transition"
                  >
                    ส่งแล้ว / รับแล้ว
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
