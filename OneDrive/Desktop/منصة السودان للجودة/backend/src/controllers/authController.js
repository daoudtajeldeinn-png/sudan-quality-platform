const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { userId, email, displayName, photoURL } = req.body;

    // التحقق من صحة البيانات
    if (!userId || !email || !displayName) {
      return res.status(400).json({
        error: 'Missing required fields: userId, email, displayName'
      });
    }

    // Check for Demo Mode
    if (req.isDemoMode) {
      let user = await req.demoDB.findUserByEmail(email);
      if (!user) {
        user = await req.demoDB.createUser({ userId, email, displayName, photoURL });
        console.log('Demo user created:', email);
      } else {
        user.lastLogin = new Date();
        console.log('Demo user login updated:', email);
      }

      return res.status(200).json({
        success: true,
        message: 'User registered successfully (Demo Mode)',
        user
      });
    }

    // البحث عن المستخدم الحالي
    let user = await User.findOne({ userId });

    if (!user) {
      // إنشاء مستخدم جديد
      user = new User({
        userId,
        email,
        displayName,
        photoURL,
        createdAt: new Date(),
        lastLogin: new Date()
      });
      await user.save();
      console.log('New user created:', email);
    } else {
      // تحديث تاريخ آخر دخول
      user.lastLogin = new Date();
      await user.save();
      console.log('User login updated:', email);
    }

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      user: {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.isDemoMode) {
      const user = await req.demoDB.findUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ user });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
};
