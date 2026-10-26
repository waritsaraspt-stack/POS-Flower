import React from 'react';
import { Order } from '../types';
import { AlertCircle, Banknote, QrCode, ArrowRight } from 'lucide-react';

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (method: 'cash' | 'qr') => void;
  onProceedUnpaid: () => void;
}

export const PaymentConfirmModal: React.FC<Props> = ({
  order,
  isOpen,
  onClose,
  onConfirmPayment,
  onProceedUnpaid
}) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-800">ยืนยันการชำระเงินก่อนส่งมอบ</h3>
        <p className="text-sm text-slate-500 mt-1">
          ออเดอร์ <span className="font-semibold text-slate-700">{order.orderNumber}</span> ของคุณ <span className="font-semibold text-slate-700">{order.customerName}</span> ยังมีสถานะเป็น <span className="text-rose-500 font-semibold">"ยังไม่จ่ายเงิน"</span>
        </p>

        <div className="my-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <span className="text-sm text-amber-800 font-medium">ยอดที่ต้องเรียกเก็บ:</span>
          <span className="text-2xl font-black text-rose-600">฿{order.totalPrice.toLocaleString()}</span>
        </div>

        <div className="space-y-2.5">
          <button 
            onClick={() => onConfirmPayment('cash')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-md shadow-emerald-200 transition"
          >
            <div className="flex items-center gap-2.5">
              <Banknote className="w-5 h-5" />
              <span>ลูกค้าจ่ายเงินสดแล้ว</span>
            </div>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={() => onConfirmPayment('qr')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-md shadow-blue-200 transition"
          >
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5" />
              <span>ลูกค้าสแกนโอน QR แล้ว</span>
            </div>
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>

          <button 
            onClick={onProceedUnpaid}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
          >
            ⚠️ ส่งมอบสินค้าโดย "ยังไม่ได้รับเงิน" (ค้างชำระ)
          </button>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-3 py-2 text-slate-400 hover:text-slate-600 text-sm font-medium transition"
        >
          ยกเลิก (คงสถานะเดิม)
        </button>
      </div>
    </div>
  );
};
