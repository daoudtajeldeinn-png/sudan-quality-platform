const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "الوصول مرفوض، لا توجد رمز مصادقة" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sudan_quality_secret");
    const user = await User.findOne({ userId: decoded.userId });
    
    if (!user) {
      return res.status(401).json({ error: "المستخدم غير موجود" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "رمز المصادقة غير صالح" });
  }
};

module.exports = authMiddleware;
