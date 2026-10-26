const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลออเดอร์ได้', error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const count = await prisma.order.count();
    const orderNumber = `ORD-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${(count + 1).toString().padStart(3, '0')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        bouquetCount: parseInt(req.body.bouquetCount) || 1,
        flowerTypeId: req.body.flowerTypeId || 'rose',
        isFreshFlower: Boolean(req.body.isFreshFlower),
        useOasis: Boolean(req.body.useOasis),
        deliveryMethod: req.body.deliveryMethod || 'store_pickup',
        pickupTime: new Date(req.body.pickupTime),
        cardMessage: req.body.cardMessage,
        totalPrice: parseFloat(req.body.totalPrice),
        orderStatus: 'pending_arrangement',
        paymentStatus: req.body.paymentStatus || 'unpaid',
        paymentMethod: req.body.paymentStatus === 'paid' ? req.body.paymentMethod : null
      }
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างออเดอร์', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, paymentMethod } = req.body;
    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentMethod) updateData.paymentMethod = paymentMethod;
    }

    const order = await prisma.order.update({ where: { id }, data: updateData });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถอัปเดตสถานะออเดอร์ได้', error: error.message });
  }
};

module.exports = { getOrders, createOrder, updateOrderStatus };
