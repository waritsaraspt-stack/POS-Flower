const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getFinancialSummary = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    const expenses = await prisma.expense.findMany();

    const totalSales = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalPrice, 0);
    const cashTotal = orders.filter(o => o.paymentStatus === 'paid' && o.paymentMethod === 'cash').reduce((sum, o) => sum + o.totalPrice, 0);
    const qrTotal = orders.filter(o => o.paymentStatus === 'paid' && o.paymentMethod === 'qr').reduce((sum, o) => sum + o.totalPrice, 0);
    const unpaidTotal = orders.filter(o => o.paymentStatus === 'unpaid').reduce((sum, o) => sum + o.totalPrice, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      totalSales,
      cashTotal,
      qrTotal,
      unpaidTotal,
      totalExpenses,
      netProfit: totalSales - totalExpenses,
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเงิน', error: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const { title, amount, category, note } = req.body;
    const expense = await prisma.expense.create({
      data: { title, amount: parseFloat(amount), category, note }
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกค่าใช้จ่าย', error: error.message });
  }
};

module.exports = { getFinancialSummary, addExpense };
