export type Role = 'owner' | 'staff';
export type OrderStatus = 'pending_arrangement' | 'arranged' | 'waiting_delivery' | 'delivered';
export type PaymentStatus = 'paid' | 'unpaid';
export type PaymentMethod = 'cash' | 'qr';
export type DeliveryMethod = 'store_pickup' | 'delivery_service';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  storeCode?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface StoreInfo {
  id: string;
  storeCode: string;
  storeName: string;
  ownerId: string;
  ownerName: string;
  phone?: string;
  tagline?: string;
  address?: string;
  socialContact?: string;
  createdAt: string;
}

export interface StaffMember {
  id: string;
  username: string;
  name: string;
  storeCode: string;
  status: 'pending' | 'approved' | 'rejected';
  joinedAt: string;
}

export interface VillageItem {
  id: string;
  name: string;              // เช่น 'ม.1' หรือ 'ม.3 บ้านหนองโน'
  defaultFeeCharged?: number; // ค่าส่งเก็บลูกค้าเริ่มต้น
  defaultCostActual?: number; // ต้นทุนจ่ายไรเดอร์เริ่มต้น
}

export interface BouquetTier {
  id: string;
  name: string;
  size: string;
  sellingPrice: number;
  costPrice: number;
  flowerStemsApprox: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'flower' | 'bouquet'; // มีแค่ 2 หมวดหมู่: ดอกไม้สด และ จัดช่อ
  costPrice: number;       // ราคาต้นทุนต่อหน่วย
  sellingPrice: number;    // ราคาขายต่อหน่วย
  stockQuantity: number;   // จำนวนคงเหลือในสต็อก
  unit: string;            // หน่วยนับ เช่น ดอก, กิ่ง, ช่อ, ชุด
  minStockAlert: number;   // แจ้งเตือนเมื่อสต็อกเหลือน้อยกว่า
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'stock_purchase' | 'delivery' | 'utility' | 'salary' | 'other';
  date: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  bouquetCount: number;
  flowerType: string;
  pricePerBouquet: number;
  isFreshFlower: boolean;
  isBouquet?: boolean;
  useOasis: boolean;
  oasisCount?: number;
  deliveryMethod: DeliveryMethod;
  deliveryMoo?: string;         // หมู่ที่ / ชุมชน / ชื่อหมู่บ้าน
  deliveryAddress?: string;     // บ้านเลขที่ / ซอย / จุดสังเกต
  pickupTime: string;
  cardMessage?: string;
  totalPrice: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdAt: string;

  // ข้อมูลต้นทุนและค่าส่ง
  productCost?: number;         // ต้นทุนวัตถุดิบ/ดอกไม้ในออเดอร์นี้
  deliveryFeeCharged?: number;  // ค่าจัดส่งที่เรียกเก็บจากลูกค้า
  deliveryCostActual?: number;  // ต้นทุนค่าส่งที่ร้านจ่ายให้ไรเดอร์จริง
  grossProfit?: number;         // กำไรของออเดอร์นี้
}
