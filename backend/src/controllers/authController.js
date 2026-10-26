const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { username, password, name, role, storeKey } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' });
    }

    let assignedRole = 'staff';
    if (role === 'owner') {
      if (storeKey !== (process.env.OWNER_SECRET_KEY || 'FLOWER888')) {
        return res.status(403).json({ message: 'รหัสความปลอดภัยร้านไม่ถูกต้อง' });
      }
      assignedRole = 'owner';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, name, role: assignedRole }
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'super-secret-florist-key-change-me',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'super-secret-florist-key-change-me',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
  }
};

module.exports = { register, login };
