const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Hardcoded MongoDB URI - can be changed here
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://daoudtajeldeinn113_db_user:HbdStyeaJyk5DaVz@sudanqualityplatform.xmr9cgw.mongodb.net/?appName=SUDANQUALITYPLATFORM&retryWrites=true&w=majority";

console.log("MongoDB URI:", MONGO_URI);

// Middleware
const corsOptions = {
  origin: [
    'https://decisive-octane-472816-d3.web.app',
    'https://decisive-octane-472816-d3.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:5000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Demo mode flag - set to true if MongoDB is not available
let isDemoMode = false;

// In-memory storage for demo mode
const demoUsers = new Map();
const demoQuestions = [
  // Unit 1 - Good Storage Practices (gmp-intro)
  { _id: "demo_q1", unitId: "gmp-intro", questionText: "ما هي درجة الحرارة المناسبة لتخزين الأدوية التي تتطلب مبردة؟", options: ["2-8°C", "15-25°C", "0-2°C", "-20°C"], correctAnswer: 0 },
  { _id: "demo_q2", unitId: "gmp-intro", questionText: "أي مما يلي يُعد من متطلبات التخزين الجيد؟", options: ["التعرض المباشر للشمس", "التهوية الجيدة", "الرطوبة العالية", "الازدحام في المساحة"], correctAnswer: 1 },
  { _id: "demo_q3", unitId: "gmp-intro", questionText: "ما هو الحد الأقصى لارتفاع_STACKING_في المستودع؟", options: ["متر واحد", "متران", "ثلاثة أمتار", "أربعة أمتار"], correctAnswer: 1 },
  { _id: "demo_q4", unitId: "gmp-intro", questionText: "يجب أن تكون الرطوبة النسبية في منطقة التخزين:", options: ["أقل من 30%", "30-60%", "60-80%", "أعلى من 80%"], correctAnswer: 1 },
  { _id: "demo_q5", unitId: "gmp-intro", questionText: "ما هو الغرض من نظام FIFO (First In First Out)؟", options: ["زيادة الربح", "تقليل المساحة", "منع انتهاء الصلاحية", "تسريع العمليات"], correctAnswer: 2 },

  // Unit 2 - Good Distribution Practices (glp-basics)
  { _id: "demo_q6", unitId: "glp-basics", questionText: "ما هو الحد الأقصى допустимой времени для транспортировки охлажденных препаратов?", options: ["2 часа", "8 часов", "24 часа", "48 часов"], correctAnswer: 2 },
  { _id: "demo_q7", unitId: "glp-basics", questionText: "Какой документ является обязательным при транспортировке лекарств?", options: ["Сертификат качества", "Товарно-транспортная накладная", "Лицензия на продажу", "Договор аренды"], correctAnswer: 1 },
  { _id: "demo_q8", unitId: "glp-basics", questionText: "Что необходимо проверять при получении лекарств?", options: ["Только цену", "Только количество", "Температуру و срок годности", "Только упаковку"], correctAnswer: 2 },
  { _id: "demo_q9", unitId: "glp-basics", questionText: "Какой транспорт используется для перевозки термолабильных препаратов?", options: ["Обычный грузовик", "Изотермический транспорт", "Открытый транспорт", "Любой доступный"], correctAnswer: 1 },
  { _id: "demo_q10", unitId: "glp-basics", questionText: "Какова минимальная документация для отгрузки?", options: ["1 документ", "2 документа", "3 документа", "4 документа"], correctAnswer: 2 },

  // Unit 3 - Good Manufacturing Practices (iso-17025)
  { _id: "demo_q11", unitId: "iso-17025", questionText: "ما هي المتطلبات الأساسية لمنطقة الإنتاج؟", options: ["نظيفة ومهواة", "أي مساحة متاحة", "خارج المبنى", "بالقرب من المدخل"], correctAnswer: 0 },
  { _id: "demo_q12", unitId: "iso-17025", questionText: "ما هو نظام التصنيف حسب洁净度؟", options: ["درجة A, B, C, D", "نظام 5S", "نظام ISO", "نظام HACCP"], correctAnswer: 0 },
  { _id: "demo_q13", unitId: "iso-17025", questionText: "كم مرة يجب إجراء الصيانة الوقائية للمعدات؟", options: ["سنوياً", "شهرياً", "حسب الحاجة فقط", "يوميا"], correctAnswer: 1 },
  { _id: "demo_q14", unitId: "iso-17025", questionText: "ما هو الغرض من توثيق التصنيع؟", options: ["توفير الورق", "تتبع المنتج", "إرضاء المفتش", "زيادة الإنتاج"], correctAnswer: 1 },
  { _id: "demo_q15", unitId: "iso-17025", questionText: "من يتحقق من جودة المنتج النهائي؟", options: ["المنتج", "المبيعات", "ضمان الجودة", "الموارد البشرية"], correctAnswer: 2 },

  // Unit 4 - Good Laboratory Practices (gmp-intro) - This unit was removed from the provided snippet, but I'll keep the original content for now and just update the format.
  // If the intention was to remove units 4 and 5, please specify.
  { _id: "demo_q16", unitId: "gmp-intro", questionText: "ما هو الغرض من معايرة الأجهزة؟", options: ["توفير الكهرباء", "ضمان دقة النتائج", "إطالة عمر الجهاز", "تحسين المظهر"], correctAnswer: 1 },
  { _id: "demo_q17", unitId: "gmp-intro", questionText: "كم مرة يجب إجراء التحقق من الأجهزة؟", options: ["سنوياً فقط", "شهرياً فقط", "según المخطط", "أيامياً"], correctAnswer: 2 },
  { _id: "demo_q18", unitId: "gmp-intro", questionText: "ما هو الحد الأقصى допустимой погрешности للميزان؟", options: ["1%", "5%", "10%", "20%"], correctAnswer: 0 },
  { _id: "demo_q19", unitId: "gmp-intro", questionText: "كيف يجب تخزين المعايير المرجعية؟", options: ["في أي مكان", "according to instructions", "في الضوء", "مع المواد الكيميائية"], correctAnswer: 1 },
  { _id: "demo_q20", unitId: "gmp-intro", questionText: "من يتحقق من صحة نتائج المختبر؟", options: ["المختبر نفسه", "مختبر خارجي مستقل", "الشركة المصنعة", "لا أحد"], correctAnswer: 1 },

  // Unit 5 - Good Pharmacovigilance Practices (glp-basics) - This unit was removed from the provided snippet, but I'll keep the original content for now and just update the format.
  { _id: "demo_q21", unitId: "glp-basics", questionText: "ما هو الهدف الرئيسي من اليقظة الدوائية؟", options: ["زيادة المبيعات", "مراقبة الآثار الجانبية", "تطوير أدوية جديدة", "تقليل التكاليف"], correctAnswer: 1 },
  { _id: "demo_q22", unitId: "glp-basics", questionText: "كم يجب الإبلاغ عن الآثار الجانبية الخطيرة؟", options: ["في غضون 24 ساعة", "خلال أسبوع", "شهريا", "سنوياً"], correctAnswer: 0 },
  { _id: "demo_q23", unitId: "glp-basics", questionText: "من يجمع معلومات السلامة الدوائية؟", options: ["التسويق", "المبيعات", "قسم اليقظة الدوائية", "المالية"], correctAnswer: 2 },
  { _id: "demo_q24", unitId: "glp-basics", questionText: "ما هوUTR؟", options: ["تقرير تجربة المستخدم", "تقرير التطور الزمني", "تقرير التفاعلات غير المتوقعة", "تقرير الاستخدام"], correctAnswer: 2 },
  { _id: "demo_q25", unitId: "glp-basics", questionText: "كيف يجب توثيق الشكاوى؟", options: ["شفهياً", "بالنظام الإلكتروني", "بالإيميل فقط", "لا تحتاج توثيق"], correctAnswer: 1 },

  // Unit 6 - Good Clinical Practices (ich-guidelines)
  { _id: "demo_q26", unitId: "ich-guidelines", questionText: "ما هو مبدأConsentient؟", options: ["موافقة مسبقة", "موافقة المريض", "موافقة الطبيب", "موافقة المستشفى"], correctAnswer: 1 },
  { _id: "demo_q27", unitId: "ich-guidelines", questionText: "من يشرف على التجربة السريرية؟", options: ["راعي التجربة", "مكتب التجربة", "جميع ما سبق", "لا أحد"], correctAnswer: 2 },
  { _id: "demo_q28", unitId: "ich-guidelines", questionText: "ما هوالغرض من randomization؟", options: ["اختيار العلاج", "منع التحيز", "تسريع التجربة", "توفير المال"], correctAnswer: 1 },
  { _id: "demo_q29", unitId: "ich-guidelines", questionText: "كم مدةfollow-up после التجربة؟", options: ["يوم واحد", "أسبوع", "حسب البروتوكول", "سنة"], correctAnswer: 2 },
  { _id: "demo_q30", unitId: "ich-guidelines", questionText: "ما هو دور data management؟", options: ["جمع البيانات فقط", "تحليل وإدارة البيانات", "تخزين البيانات", "حذف البيانات"], correctAnswer: 1 }
];

// Demo mode database simulation
const DemoDB = {
  users: demoUsers,
  questions: demoQuestions,

  // Helper to simulate async operations
  async findUserByEmail(email) {
    for (let user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  },

  async findUserById(id) {
    return this.users.get(id) || null;
  },

  async createUser(userData) {
    const id = 'demo_' + Date.now();
    const user = { ...userData, _id: id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  },

  async getRandomQuestions(unitId, count = 5) {
    const unitQuestions = this.questions.filter(q => q.unitId === unitId);
    const shuffled = [...unitQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  async checkAnswer(questionId, answer) {
    if (this.isDemoMode) {
      const question = this.questions.find(q => q._id === questionId);
      if (!question) return { correct: false, message: 'Question not found' };
      return {
        correct: answer === question.correctAnswer,
        correctAnswer: question.correctAnswer
      };
    }
    const question = this.questions.find(q => q._id === questionId || q.question === questionId);
    if (!question) return { correct: false, message: 'Question not found' };
    return {
      correct: answer === question.correctAnswer,
      correctAnswer: question.correctAnswer
    };
  }
};


// MongoDB Connection
const connectDB = async () => {
  try {
    // Use the hardcoded MONGO_URI or environment variable
    let mongoUri = process.env.MONGODB_URI || MONGO_URI;

    console.log("Attempting to connect to MongoDB...");
    console.log("MongoDB URI:", mongoUri ? "Found" : "Not found");
    
    // Try to connect to the provided MongoDB URI first
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
        return; // Connection successful, exit function
      } catch (connError) {
        console.log('Failed to connect to provided MongoDB, starting in DEMO mode...');
        mongoUri = null;
      }
    }

    // If no MongoDB URI or connection failed, try mongodb-memory-server
    if (!mongoUri) {
      console.log('Trying MongoDB Memory Server...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('MongoDB Memory Server connected successfully');
        return;
      } catch (memServerError) {
        console.log('MongoDB Memory Server not available, starting in DEMO mode...');
      }
    }

    // Fallback to demo mode
    isDemoMode = true;
    console.log('===========================================');
    console.log('⚠️  RUNNING IN DEMO MODE (No Database)');
    console.log('===========================================');
    console.log('Features available in demo mode:');
    console.log('✓ User registration and login');
    console.log('✓ Quiz with sample questions');
    console.log('✓ All API endpoints respond normally');
    console.log('Note: Data will not persist after server restart');
    console.log('===========================================');

  } catch (error) {
    console.log('Database not available, starting in DEMO mode...');
    isDemoMode = true;
  }
};

connectDB();

// Make demoDB available to routes
app.use((req, res, next) => {
  req.demoDB = DemoDB;
  req.isDemoMode = isDemoMode;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);

app.get('/', (req, res) => {
  const status = isDemoMode ? 'demo' : 'production';
  res.json({
    message: 'منصة السودان للجودة - API работает بنجاح!',
    version: '1.0.0',
    status: status,
    database: isDemoMode ? 'Demo Mode (In-Memory)' : 'MongoDB',
    endpoints: {
      auth: '/api/auth',
      questions: '/api/questions'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: isDemoMode ? 'demo' : 'production',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

