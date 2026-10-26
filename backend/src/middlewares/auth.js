const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'ไม่พบ Token การเข้าสู่ระบบ' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-florist-key-change-me');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
};

const requireOwner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    return res.status(403).json({ message: 'ปฏิเสธการเข้าถึง: เฉพาะเจ้าของร้านเท่านั้น' });
  }
};

module.exports = { verifyToken, requireOwner };
