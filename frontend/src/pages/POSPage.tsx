import React, { useState, useMemo } from 'react';
import { DeliveryMethod, ProductItem, VillageItem } from '../types';
import { Plus, Minus, Flower2, Truck, Check } from 'lucide-react';

interface Props {
  products: ProductItem[];
  villages?: VillageItem[];
  onAddOrder: (newOrder: any) => void;
  onCancel: () => void;
}

const FALLBACK_VILLAGES: VillageItem[] = [
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

export const POSPage: React.FC<Props> = ({ products, villages, onAddOrder, onCancel }) => {
  const villageList = useMemo(() => {
    return (villages && villages.length > 0) ? villages : FALLBACK_VILLAGES;
  }, [villages]);
  const [customerName, setCustomerName] = useState('');
  const [bouquetCount, setBouquetCount] = useState(0); // เริ่มต้นเป็น 0 ตามต้องการ ไม่แสดงจำนวนขึ้นมาก่อน

  // เลือกว่าเป็นประเภท ดอกไม้สด และ/หรือ จัดช่อ (ค่าเริ่มต้นเป็น false: ต้องกดเลือกก่อนถึงจะแสดง)
  const [isFreshFlower, setIsFreshFlower] = useState(false);
  const [isBouquet, setIsBouquet] = useState(false);

  // รายการระดับราคาของงานจัดช่อ
  const BOUQUET_TIERS = [
    { id: 'tier-s', name: 'ช่อไซส์ S (มินิ)', size: 'S', sellingPrice: 490, costPrice: 220, note: '3-5 ดอก เหมาะเป็นของขวัญกะทัดรัด' },
    { id: 'tier-m', name: 'ช่อไซส์ M (มาตรฐาน)', size: 'M', sellingPrice: 850, costPrice: 400, note: '7-10 ดอก ไซส์ยอดนิยม เหมาะทุกโอกาส' },
    { id: 'tier-l', name: 'ช่อไซส์ L (พรีเมียม)', size: 'L', sellingPrice: 1500, costPrice: 750, note: '15-20 ดอก หรูหรา ดอกไม้คัดเกรดพิเศษ' },
    { id: 'tier-xl', name: 'ช่อไซส์ XL (อลังการ)', size: 'XL', sellingPrice: 2500, costPrice: 1200, note: '25+ ดอก จัดเต็มสำหรับวันสำคัญสุดพิเศษ' },
    { id: 'tier-custom', name: 'กำหนดราคาจัดช่อเอง', size: 'Custom', sellingPrice: 850, costPrice: 400, note: 'ระบุราคาและงบประมาณเองตามสั่ง' }
  ];

  const [selectedTierId, setSelectedTierId] = useState<string>('tier-m');
  const selectedTier = useMemo(() => {
    return BOUQUET_TIERS.find(t => t.id === selectedTierId) || BOUQUET_TIERS[1];
  }, [selectedTierId]);

  // ดึงรายการดอกไม้สดและงานจัดช่อจากแค็ตตาล็อกสินค้าของร้าน (มี 2 หมวดหมู่)
  const flowerProducts = useMemo(() => {
    return products.filter(p => p.category === 'flower');
  }, [products]);

  const bouquetProducts = useMemo(() => {
    return products.filter(p => p.category === 'bouquet');
  }, [products]);

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    return flowerProducts[0]?.id || '';
  });

  const selectedProduct = useMemo(() => {
    return flowerProducts.find(p => p.id === selectedProductId) || flowerProducts[0];
  }, [flowerProducts, selectedProductId]);

  const [selectedBouquetProductId, setSelectedBouquetProductId] = useState<string>(() => {
    return bouquetProducts[0]?.id || '';
  });

  const selectedBouquetProduct = useMemo(() => {
    return bouquetProducts.find(p => p.id === selectedBouquetProductId) || bouquetProducts[0];
  }, [bouquetProducts, selectedBouquetProductId]);

  const [isCustomTier, setIsCustomTier] = useState<boolean>(false);

  const [pricePerBouquet, setPricePerBouquet] = useState<number>(() => {
    return bouquetProducts[0]?.sellingPrice || 850;
  });

  const [useOasis, setUseOasis] = useState(false);
  const [oasisCount, setOasisCount] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('store_pickup');
  const [deliveryMoo, setDeliveryMoo] = useState('หมู่ 1');
  const [pickupTime, setPickupTime] = useState('17:00');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'unpaid'>('paid');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('qr');

  // ค่าจัดส่งและต้นทุนจริง
  const [deliveryFeeCharged, setDeliveryFeeCharged] = useState<number>(100);
  const [deliveryCostActual, setDeliveryCostActual] = useState<number>(70);

  const oasisSellingPrice = (isBouquet && useOasis) ? (oasisCount * 50) : 0;
  const oasisCost = (isBouquet && useOasis) ? (oasisCount * 18) : 0;

  // คำนวณยอดเงินรวม
  const hasSelectedType = isFreshFlower || isBouquet;
  const flowerSubtotal = hasSelectedType ? bouquetCount * pricePerBouquet : 0;
  const oasisSubtotal = oasisSellingPrice;
  const deliverySubtotal = (hasSelectedType && deliveryMethod === 'delivery_service') ? deliveryFeeCharged : 0;
  const totalPrice = flowerSubtotal + oasisSubtotal + deliverySubtotal;

  // คำนวณต้นทุนรวมและกำไร
  const unitCost = isBouquet 
    ? (isCustomTier || !selectedBouquetProduct ? selectedTier.costPrice : selectedBouquetProduct.costPrice) 
    : (selectedProduct?.costPrice || 400);

  const flowerCostTotal = hasSelectedType ? bouquetCount * unitCost : 0;
  const oasisCostTotal = bouquetCount * oasisCost;
  const deliveryCostTotal = (hasSelectedType && deliveryMethod === 'delivery_service') ? deliveryCostActual : 0;
  const totalCost = flowerCostTotal + oasisCostTotal + deliveryCostTotal;
  const estimatedProfit = totalPrice - totalCost;
  const marginPercent = totalPrice > 0 ? ((estimatedProfit / totalPrice) * 100).toFixed(1) : '0';

  const handleSelectBouquetProduct = (product: ProductItem) => {
    setIsCustomTier(false);
    setSelectedBouquetProductId(product.id);
    setPricePerBouquet(product.sellingPrice);
  };

  const handleSelectTier = (tier: typeof BOUQUET_TIERS[0]) => {
    setIsCustomTier(true);
    setSelectedTierId(tier.id);
    setPricePerBouquet(tier.sellingPrice);
  };

  const handleSelectFlower = (product: ProductItem) => {
    setSelectedProductId(product.id);
    if (!isBouquet) {
      setPricePerBouquet(product.sellingPrice);
    }
  };

  const handleToggleFreshFlower = () => {
    if (isFreshFlower) {
      setIsFreshFlower(false);
    } else {
      setIsFreshFlower(true);
      setIsBouquet(false); // สลับเป็นดอกไม้สด
      if (selectedProduct) {
        setPricePerBouquet(selectedProduct.sellingPrice);
      }
    }
  };

  const handleToggleBouquet = () => {
    if (isBouquet) {
      setIsBouquet(false);
    } else {
      setIsBouquet(true);
      setIsFreshFlower(false); // สลับเป็นจัดช่อดอกไม้
      if (!isCustomTier && selectedBouquetProduct) {
        setPricePerBouquet(selectedBouquetProduct.sellingPrice);
      } else {
        setPricePerBouquet(selectedTier.sellingPrice);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert('กรุณากรอกชื่อลูกค้า หรือระบุคิวหน้าร้าน');
      return;
    }

    if (!isFreshFlower && !isBouquet) {
      alert('กรุณาเลือกประเภทงานอย่างน้อย 1 ประเภท (ดอกไม้สด หรือ จัดช่อ)');
      return;
    }

    if (bouquetCount <= 0) {
      alert(`กรุณาระบุ${isBouquet ? 'จำนวนช่อ' : 'จำนวนดอก/ก้าน'} อย่างน้อย 1`);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const fullPickupTime = `${today}T${pickupTime}:00`;

    // ตั้งชื่อรายการสินค้าในออเดอร์
    let orderItemTitle = 'ดอกไม้สด';
    if (isBouquet) {
      orderItemTitle = (!isCustomTier && selectedBouquetProduct) 
        ? selectedBouquetProduct.name 
        : `งานจัดช่อ: ${selectedTier.name}`;
    } else {
      orderItemTitle = selectedProduct?.name || 'ดอกไม้สด';
    }

    onAddOrder({
      customerName,
      customerPhone: '',
      bouquetCount,
      flowerType: orderItemTitle,
      pricePerBouquet,
      isFreshFlower,
      isBouquet,
      useOasis: isBouquet && useOasis,
      oasisCount: (isBouquet && useOasis) ? oasisCount : 0,
      deliveryMethod,
      deliveryMoo: deliveryMethod === 'delivery_service' ? deliveryMoo : undefined,
      pickupTime: fullPickupTime,
      totalPrice,
      paymentStatus,
      paymentMethod: paymentStatus === 'paid' ? paymentMethod : undefined,
      // ข้อมูลต้นทุนและค่าส่ง
      productCost: flowerCostTotal + oasisCostTotal,
      deliveryFeeCharged: deliverySubtotal,
      deliveryCostActual: deliveryCostTotal,
      grossProfit: estimatedProfit
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-8">
      <div>
        <h2 className="text-2xl font-black text-slate-800">เปิดบิลรับออเดอร์หน้าร้าน (POS)</h2>
        <p className="text-xs text-slate-500">เลือกประเภทดอกไม้สดและจัดช่อ ตัดสต็อก และคำนวณต้นทุน/กำไรอัตโนมัติ</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
        {/* ข้อมูลลูกค้า (ชื่อลูกค้าเท่านั้น ไม่ต้องมีเบอร์โทร) */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            ชื่อลูกค้า (หรือระบุคิวหน้าร้าน) *
          </label>
          <input 
            type="text" 
            required
            placeholder="เช่น คุณฟ้าใส / ลูกค้าหน้าร้าน / คิวที่ 1"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {/* แผงเลือกประเภท: ดอกไม้สด และ จัดช่อ (3D Tactile Buttons) */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700">
            เลือกประเภทงาน (คลิกเพื่อแสดงตัวเลือกราคาจัดช่อ หรือรายการดอกไม้สด):
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {/* ปุ่ม 1: ดอกไม้สด */}
            <button
              type="button"
              onClick={handleToggleFreshFlower}
              className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${
                isFreshFlower
                  ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/35 border-t border-emerald-300 ring-2 ring-emerald-300/40'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/90'
              }`}
            >
              <span className="text-sm">🌿</span>
              <span>ดอกไม้สด</span>
              {isFreshFlower && <Check className="w-4 h-4 ml-1" />}
            </button>

            {/* ปุ่ม 2: จัดช่อ */}
            <button
              type="button"
              onClick={handleToggleBouquet}
              className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 ${
                isBouquet
                  ? 'bg-gradient-to-b from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/35 border-t border-rose-300 ring-2 ring-rose-300/40'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200/90'
              }`}
            >
              <span className="text-sm">💐</span>
              <span>จัดช่อดอกไม้</span>
              {isBouquet && <Check className="w-4 h-4 ml-1" />}
            </button>
          </div>
        </div>

        {/* แผงข้อความแจ้งเตือนเมื่อยังไม่ได้กดเลือกประเภทงาน */}
        {!isFreshFlower && !isBouquet && (
          <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 text-center space-y-2 animate-fade-in my-1">
            <span className="text-3xl block">👆</span>
            <h4 className="text-xs font-bold text-slate-700">กรุณากดเลือกประเภทงานด้านบน</h4>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
              กดเลือก <b>"🌿 ดอกไม้สด"</b> เพื่อดูรายการดอกไม้สดในสต็อก หรือกดเลือก <b>"💐 จัดช่อดอกไม้"</b> เพื่อเลือกแพ็กเกจและราคาจัดช่อ
            </p>
          </div>
        )}

        {/* 1. แผงแสดงราคาและรูปแบบจัดช่อดอกไม้ (แสดงเมื่อกดเลือก 'จัดช่อดอกไม้') */}
        {isBouquet && (
          <div className="space-y-3 pt-2 border-t border-rose-100 bg-rose-50/30 p-3.5 rounded-2xl">
            {/* รายการจัดช่อจากแค็ตตาล็อกสินค้าของร้าน */}
            {bouquetProducts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <span>💐</span>
                    <span>ช่อดอกไม้จากแค็ตตาล็อกร้าน (สต็อกพร้อมขาย):</span>
                  </label>
                  <span className="text-[10px] text-rose-500 bg-rose-100/70 px-2 py-0.5 rounded-full font-semibold">
                    ตัดสต็อกอัตโนมัติ
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bouquetProducts.map(p => {
                    const isSelected = !isCustomTier && selectedBouquetProductId === p.id;
                    const isLowStock = p.stockQuantity <= p.minStockAlert;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => handleSelectBouquetProduct(p)}
                        className={`p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between gap-1 active:scale-95 ${
                          isSelected
                            ? 'border-purple-600 bg-white text-purple-900 shadow-md ring-2 ring-purple-300/50'
                            : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-purple-600' : 'bg-slate-300'}`} />
                            {p.name}
                          </span>
                          <span className="font-black text-sm text-purple-700">฿{p.sellingPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                            isLowStock ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            เหลือ {p.stockQuantity} {p.unit}
                          </span>
                          <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-medium">
                            ทุน ฿{p.costPrice}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* เลือกขนาด & ราคาจัดช่อตามสั่ง (Size Customization) */}
            <div className="space-y-2 pt-2 border-t border-rose-100/80">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>📐</span>
                  <span>หรือเลือกจัดตามไซส์ / กำหนดราคาเอง:</span>
                </label>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-semibold">
                  เลือกตามงบประมาณลูกค้า
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BOUQUET_TIERS.map(tier => {
                  const isSelected = isCustomTier && selectedTierId === tier.id;
                  return (
                    <button
                      type="button"
                      key={tier.id}
                      onClick={() => handleSelectTier(tier)}
                      className={`p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between gap-1 active:scale-95 ${
                        isSelected
                          ? 'border-rose-500 bg-white text-rose-900 shadow-md ring-2 ring-rose-300/50'
                          : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-rose-500' : 'bg-slate-300'}`} />
                          {tier.name}
                        </span>
                        <span className="font-black text-sm text-rose-600">฿{tier.sellingPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{tier.note}</span>
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-medium text-slate-500">
                          ทุน ฿{tier.costPrice}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ตัวเลือกและเพิ่ม/ลดจำนวนก้อนโอเอซิส Wet Foam */}
            <div className="pt-1">
              <div className={`p-3 rounded-2xl border transition-all ${
                useOasis 
                  ? 'bg-teal-50/80 border-teal-300 ring-1 ring-teal-200' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !useOasis;
                      setUseOasis(next);
                      if (next && oasisCount === 0) setOasisCount(1);
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-slate-800 text-left active:scale-95 transition"
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                      useOasis ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-300'
                    }`}>
                      {useOasis && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">💧 ฐานปักโอเอซิส Wet Foam</span>
                        <span className="text-[10px] text-teal-700 bg-teal-100/70 px-1.5 py-0.5 rounded font-semibold">
                          +฿50/ก้อน
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        ยืดอายุดอกไม้สด ชุ่มชื้นยาวนาน
                      </div>
                    </div>
                  </button>

                  {/* แผงควบคุมเพิ่ม/ลดจำนวนก้อนโอเอซิส */}
                  {useOasis && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-teal-300 shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOasisCount(prev => Math.max(1, prev - 1));
                        }}
                        className="w-8 h-8 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm cursor-pointer select-none transition active:scale-95 border border-teal-200"
                        title="ลดจำนวนก้อน"
                      >
                        <Minus className="w-4 h-4 pointer-events-none" />
                      </button>
                      <div className="flex items-center px-1">
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={oasisCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setOasisCount(isNaN(val) || val < 1 ? 1 : val);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-10 text-center font-black text-sm text-teal-900 bg-transparent focus:outline-none focus:ring-1 focus:ring-teal-400 rounded py-0.5"
                        />
                        <span className="text-xs font-bold text-teal-700 select-none">ก้อน</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOasisCount(prev => prev + 1);
                        }}
                        className="w-8 h-8 rounded-lg bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer select-none shadow-xs transition active:scale-95"
                        title="เพิ่มจำนวนก้อน"
                      >
                        <Plus className="w-4 h-4 pointer-events-none" />
                      </button>
                    </div>
                  )}
                </div>

                {useOasis && (
                  <div className="flex justify-between items-center text-[11px] text-teal-800 pt-2 mt-2 border-t border-teal-200/60 font-semibold">
                    <span>ยอดรวมค่าโอเอซิส ({oasisCount} ก้อน):</span>
                    <span className="font-bold">฿{(oasisCount * 50).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">(ทุน ฿{(oasisCount * 18).toLocaleString()})</span></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. แผงแสดงรายการดอกไม้สด (แสดงเมื่อกดเลือก 'ดอกไม้สด') */}
        {isFreshFlower && (
          <div className="space-y-2 pt-2 border-t border-emerald-100 bg-emerald-50/20 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <span>🌿</span>
                <span>รายการดอกไม้สด (อิงจากสต็อกร้าน):</span>
              </label>
              <span className="text-[10px] text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-full font-semibold">
                ตัดสต็อกอัตโนมัติ
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {flowerProducts.map(p => {
                const isSelected = selectedProductId === p.id;
                const isLowStock = p.stockQuantity <= p.minStockAlert;

                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => handleSelectFlower(p)}
                    className={`p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'border-emerald-500 bg-white text-emerald-900 shadow-md ring-2 ring-emerald-300/50'
                        : 'border-slate-200/80 bg-white/70 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xs">{p.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        isLowStock ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        เหลือ {p.stockQuantity}
                      </span>
                    </div>
                    <div className="text-[11px] flex items-center justify-between font-bold">
                      <span className="text-emerald-700">฿{p.sellingPrice}</span>
                      <span className="text-slate-400 font-normal text-[10px]">ทุน ฿{p.costPrice}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* จำนวนและราคา */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isBouquet ? 'จำนวนช่อ' : 'จำนวนดอก/ก้าน'}
            </label>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-1">
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setBouquetCount(prev => Math.max(0, prev - 1));
                }}
                disabled={bouquetCount <= 0}
                className="w-10 h-10 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-xs transition active:scale-95 cursor-pointer border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                title="ลดจำนวน"
              >
                <Minus className="w-4 h-4 pointer-events-none" />
              </button>
              <input
                type="number"
                min="0"
                value={bouquetCount}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setBouquetCount(isNaN(val) || val < 0 ? 0 : val);
                }}
                className="flex-1 min-w-0 text-center font-black text-lg text-slate-800 bg-transparent focus:outline-none"
              />
              <button 
                type="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setBouquetCount(prev => prev + 1);
                }}
                className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center font-bold shadow-xs transition active:scale-95 cursor-pointer"
                title="เพิ่มจำนวน"
              >
                <Plus className="w-4 h-4 pointer-events-none" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {isBouquet ? 'ราคาต่อช่อ (บาท)' : 'ราคาต่อหน่วย (บาท)'}
            </label>
            <input 
              type="number"
              min="0"
              value={pricePerBouquet}
              onChange={(e) => setPricePerBouquet(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-rose-600"
            />
          </div>
        </div>



        {/* วิธีรับสินค้า & การเลือกหมู่จัดส่ง */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">วิธีรับสินค้า</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('store_pickup')}
                  className={`py-2.5 rounded-2xl text-xs font-bold border transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                    deliveryMethod === 'store_pickup' 
                      ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-xs ring-1 ring-rose-300' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>🏠</span>
                  <span>รับหน้าร้าน</span>
                  {deliveryMethod === 'store_pickup' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod('delivery_service');
                    if (!deliveryMoo && villageList.length > 0) {
                      setDeliveryMoo(villageList[0].name);
                      if (villageList[0].defaultFeeCharged) setDeliveryFeeCharged(villageList[0].defaultFeeCharged);
                      if (villageList[0].defaultCostActual) setDeliveryCostActual(villageList[0].defaultCostActual);
                    }
                  }}
                  className={`py-2.5 rounded-2xl text-xs font-bold border transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                    deliveryMethod === 'delivery_service' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-xs ring-1 ring-blue-300' 
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span>🛵</span>
                  <span>บริการจัดส่ง</span>
                  {deliveryMethod === 'delivery_service' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">เวลานัดรับ / ส่ง</label>
              <input 
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium"
              />
            </div>
          </div>

          {/* แผงตัวเลือกหมู่ (แสดงเฉพาะเมื่อกด 'บริการจัดส่ง' ตามคำขอ) */}
          {deliveryMethod === 'delivery_service' && (
            <div className="p-4 rounded-3xl bg-blue-50/70 border border-blue-200/90 shadow-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>🏡 เลือกหมู่ที่จัดส่ง:</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-md font-bold bg-blue-600 text-white shadow-2xs">
                  กำลังเลือก: {deliveryMoo}
                </span>
              </div>

              {/* ปุ่มหมู่บ้านที่ดึงจากระบบที่เจ้าของร้านจัดการได้ */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {villageList.map(v => {
                  const isSelected = deliveryMoo === v.name;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setDeliveryMoo(v.name);
                        if (v.defaultFeeCharged) setDeliveryFeeCharged(v.defaultFeeCharged);
                        if (v.defaultCostActual) setDeliveryCostActual(v.defaultCostActual);
                      }}
                      className={`py-2.5 px-2 rounded-2xl text-xs font-black transition-all active:scale-95 text-center flex items-center justify-center gap-1 cursor-pointer truncate ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-300 ring-2 ring-blue-400'
                          : 'bg-white text-blue-900 border border-blue-200/90 hover:bg-blue-100/70 shadow-2xs'
                      }`}
                      title={v.name}
                    >
                      <span className="truncate">{v.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* ส่วนคำนวณค่าส่ง & ไรเดอร์ */}
              <div className="pt-2 border-t border-blue-200/60 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-blue-800 mb-0.5">
                      ค่าส่งเก็บลูกค้า (฿)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={deliveryFeeCharged}
                      onChange={(e) => setDeliveryFeeCharged(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      ต้นทุนจ่ายไรเดอร์จริง (฿)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={deliveryCostActual}
                      onChange={(e) => setDeliveryCostActual(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-blue-700 flex justify-between pt-1">
                  <span>ส่วนต่างกำไรค่าส่ง:</span>
                  <span className="font-bold">
                    {deliveryFeeCharged - deliveryCostActual >= 0 ? `+฿${deliveryFeeCharged - deliveryCostActual}` : `-฿${Math.abs(deliveryFeeCharged - deliveryCostActual)}`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* แถบสรุปยอดเงินและกำไรคำนวณสด */}
        <div className="p-4 bg-gradient-to-br from-slate-50 to-rose-50/40 rounded-2xl border border-rose-100/80 space-y-3">
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>
                ค่าดอกไม้ ({bouquetCount} {isBouquet ? 'ช่อ' : 'ก้าน'}):
              </span>
              <span className="font-semibold text-slate-800">฿{flowerSubtotal.toLocaleString()}</span>
            </div>
            {isBouquet && useOasis && (
              <div className="flex justify-between">
                <span>ค่าโอเอซิส:</span>
                <span className="font-semibold text-slate-800">฿{oasisSubtotal.toLocaleString()}</span>
              </div>
            )}
            {deliveryMethod === 'delivery_service' && (
              <div className="flex justify-between text-blue-700 font-semibold">
                <span>ค่าจัดส่ง ({deliveryMoo || 'จัดส่งถึงที่'}):</span>
                <span>฿{deliverySubtotal.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800">ยอดรวมเก็บลูกค้า:</span>
              <span className="text-2xl font-black text-rose-600">฿{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* สรุปต้นทุนและกำไรประมาณการ */}
          <div className="p-3 bg-white/90 rounded-xl border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-400">ต้นทุนรวม</div>
              <div className="font-bold text-slate-600">฿{totalCost.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">กำไรสุทธิบิลนี้</div>
              <div className="font-black text-emerald-600">฿{estimatedProfit.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">อัตรากำไร</div>
              <div className="font-black text-teal-600">{marginPercent}%</div>
            </div>
          </div>

          {/* สถานะการชำระเงิน */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => setPaymentStatus('paid')}
              className={`py-2.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                paymentStatus === 'paid' 
                  ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30 border-t border-emerald-300' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              ✓ ชำระแล้ว
            </button>
            <button
              type="button"
              onClick={() => setPaymentStatus('unpaid')}
              className={`py-2.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                paymentStatus === 'unpaid' 
                  ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-600 text-white shadow-md shadow-rose-500/30 border-t border-rose-300' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              ✕ ยังไม่ชำระ (ค้างจ่าย)
            </button>
          </div>

          {paymentStatus === 'paid' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`py-2 rounded-xl text-xs font-bold border transition active:scale-95 ${
                  paymentMethod === 'qr' 
                    ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-xs' 
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                📱 สแกนโอน QR
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 rounded-xl text-xs font-bold border transition active:scale-95 ${
                  paymentMethod === 'cash' 
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs' 
                    : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                💵 รับเงินสด
              </button>
            </div>
          )}
        </div>

        {/* ปุ่มบันทึก */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!hasSelectedType}
            className={`flex-1 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition active:scale-95 ${
              hasSelectedType
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-rose-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {hasSelectedType ? 'บันทึกเปิดออเดอร์ (ตัดสต็อกอัตโนมัติ)' : 'กรุณากดเลือกประเภทงานด้านบนก่อน'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};
