import React, { useRef, useState } from 'react';
import { Order, StoreInfo } from '../types';
import { Printer, Download, X, Flower2, CheckCircle2, Clock, MapPin, Phone, User, MessageSquare } from 'lucide-react';
import html2canvas from 'html2canvas';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  storeInfo: StoreInfo;
}

export const FloristSlipModal: React.FC<Props> = ({ order, isOpen, onClose, storeInfo }) => {
  const slipRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !order) return null;

  const handleDownloadPNG = async () => {
    if (!slipRef.current) return;
    setIsExporting(true);

    try {
      // ใช้ html2canvas แปลง div ใบเสร็จเป็นรูปภาพ PNG คุณภาพสูง (scale: 3)
      const canvas = await html2canvas(slipRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = image;
      downloadLink.download = `Bill-${order.orderNumber}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error generating bill PNG:', error);
      alert('ไม่สามารถบันทึกรูปภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsExporting(false);
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedPickupTime = new Date(order.pickupTime).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between p-3.5 px-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800">ออกบิลใบสั่งงาน / ใบเสร็จ</span>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ตัวบิลใบเสร็จที่จะถูก Render และบันทึกเป็น PNG (สัดส่วนกะทัดรัด พอดีสายตา ไม่ล้นหน้าจอ) */}
        <div className="p-3.5 sm:p-4 overflow-y-auto flex-1">
          <div 
            ref={slipRef} 
            className="bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 font-sans text-slate-800"
            style={{ maxWidth: '340px', margin: '0 auto' }}
          >
            {/* หัวกระดาษบิล - แสดงชื่อร้าน ข้อมูลติดต่อ และสโลแกนตามที่เจ้าของร้านตั้งค่า */}
            <div className="text-center space-y-1 pb-2.5 border-b-2 border-dashed border-slate-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-sm shadow-rose-200 mb-1.5">
                <Flower2 className="w-5 h-5" />
              </div>
              <h2 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                {storeInfo.storeName || 'BloomPOS Studio'}
              </h2>
              {storeInfo.tagline && (
                <p className="text-[10px] text-slate-500 leading-tight">{storeInfo.tagline}</p>
              )}
              {/* ข้อมูลการติดต่อบนหัวบิล - แยกเบอร์โทรกับช่องทางติดต่อคนละบรรทัด */}
              <div className="space-y-0.5 pt-0.5">
                <p className="text-[10px] text-slate-600 font-medium leading-tight">
                  ติดต่อสอบถาม โทร {storeInfo.phone || '081-234-5678'}
                </p>
                {storeInfo.socialContact && (
                  <p className="text-[10px] text-slate-600 font-medium leading-tight">
                    {storeInfo.socialContact}
                  </p>
                )}
                {storeInfo.address && (
                  <p className="text-[9px] text-slate-400 leading-tight">{storeInfo.address}</p>
                )}
              </div>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold text-[9px] border border-rose-200">
                ใบเสร็จรับเงิน / ใบสั่งงานจัดดอกไม้
              </div>
            </div>

            {/* เลขที่บิลและวันที่ */}
            <div className="text-xs space-y-0.5 pb-2 border-b border-dashed border-slate-200">
              <div className="flex justify-between font-bold text-[11px]">
                <span className="text-slate-500">เลขออเดอร์:</span>
                <span className="text-slate-900 font-mono">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>วันที่ออกบิล:</span>
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* ข้อมูลลูกค้า & การนัดหมาย */}
            <div className="text-xs space-y-1 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
                <User className="w-3 h-3 text-slate-400" />
                <span>{order.customerName}</span>
              </div>
              {order.customerPhone && order.customerPhone.trim() !== '' && (
                <div className="flex items-center gap-1.5 text-slate-600 text-[10px]">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60 font-semibold">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-500" />
                  เวลานัดหมาย:
                </span>
                <span className="text-rose-600 font-bold">{formattedPickupTime} น.</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">วิธีรับสินค้า:</span>
                <span className="font-semibold text-slate-800">
                  {order.deliveryMethod === 'delivery_service' 
                    ? `🛵 จัดส่ง: ${order.deliveryMoo || 'จัดส่งถึงที่'}`
                    : '🏠 รับหน้าร้าน'}
                </span>
              </div>
            </div>

            {/* รายการสินค้าและบริการ */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-700 uppercase tracking-wider">รายการสินค้า</span>
                <div className="flex gap-1">
                  {order.isFreshFlower && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px]">
                      🌸 ดอกไม้สด
                    </span>
                  )}
                  {order.isBouquet !== false && (
                    <span className="px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 font-bold text-[9px]">
                      💐 งานจัดช่อ
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{order.flowerType}</div>
                    <div className="text-[10px] text-slate-400">
                      จำนวน: {order.bouquetCount} {order.isBouquet !== false ? 'ช่อ' : 'ก้าน/กำ'} @ ฿{order.pricePerBouquet.toLocaleString()}
                    </div>
                  </div>
                  <span className="font-bold text-slate-800 text-xs">
                    ฿{(order.bouquetCount * order.pricePerBouquet).toLocaleString()}
                  </span>
                </div>

                {order.useOasis && (
                  <div className="flex justify-between text-[10px] text-slate-600 pl-2 border-l-2 border-teal-400">
                    <span>ฐานปักโอเอซิส Wet Foam ({order.oasisCount || 1} ก้อน)</span>
                    <span className="font-semibold">฿{(50 * (order.oasisCount || 1)).toLocaleString()}</span>
                  </div>
                )}

                {order.deliveryMethod === 'delivery_service' && (order.deliveryFeeCharged || 0) > 0 && (
                  <div className="flex justify-between text-[10px] text-blue-700 pl-2 border-l-2 border-blue-400">
                    <span>ค่าบริการจัดส่ง (ไรเดอร์)</span>
                    <span className="font-semibold">฿{order.deliveryFeeCharged?.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ข้อความบนการ์ดอวยพร (ถ้ามี) */}
            {order.cardMessage && (
              <div className="p-2.5 bg-pink-50/70 rounded-xl border border-pink-200/80 text-xs space-y-0.5">
                <div className="font-bold text-pink-700 flex items-center gap-1 text-[10px]">
                  <MessageSquare className="w-3 h-3" />
                  <span>ข้อความการ์ดอวยพร 💌</span>
                </div>
                <p className="italic text-slate-700 text-[10px] leading-relaxed">
                  "{order.cardMessage}"
                </p>
              </div>
            )}

            {/* ยอดเงินรวมและสถานะการชำระเงิน */}
            <div className="pt-2 border-t-2 border-dashed border-slate-300 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-800">ยอดรวมทั้งสิ้น</span>
                <span className="text-lg font-black text-rose-600">
                  ฿{order.totalPrice.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="text-slate-500 font-medium">สถานะการชำระ:</span>
                {order.paymentStatus === 'paid' ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px] flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    ชำระเงินแล้ว ({order.paymentMethod === 'cash' ? 'เงินสด' : 'โอน QR PromptPay'})
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[9px]">
                    ✕ ค้างชำระเงิน
                  </span>
                )}
              </div>
            </div>

            {/* ท้ายบิล */}
            <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
              <p>ขอบคุณที่ไว้วางใจให้เราดูแลช่วงเวลาพิเศษของคุณ 💖</p>
            </div>
          </div>
        </div>

        {/* ปุ่มดำเนินการ (บันทึกรูป PNG / พิมพ์ / ปิด) */}
        <div className="p-3 px-4 bg-slate-50 border-t border-slate-100 flex gap-2">
          {/* ปุ่มบันทึกเป็นรูปภาพ PNG 3D Tactile */}
          <button 
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPNG}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-95 shadow-md ${
              isExporting 
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-b from-rose-500 via-rose-600 to-pink-600 shadow-rose-500/35 border-t border-rose-300 hover:-translate-y-0.5'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'กำลังสร้าง...' : '📸 บันทึกรูปบิล (PNG)'}</span>
          </button>

          {/* ปุ่มพิมพ์บิล */}
          <button 
            type="button"
            onClick={() => window.print()}
            className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์</span>
          </button>

          {/* ปุ่มปิด */}
          <button 
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 border border-slate-200 hover:bg-white text-slate-500 hover:text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
