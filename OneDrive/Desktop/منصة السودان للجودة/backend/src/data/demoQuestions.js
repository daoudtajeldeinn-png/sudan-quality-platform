// Full set of questions for Demo Mode, matching the Intermediate expansion.
// These are extracted from content_new.js and categorized by unitId.

const demoQuestions = {
    // --- NMPB ---
    'nmpb-reg': [
        { _id: 'nmpb_q1', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'ما هو الدور الأساسي للمجلس القومي للأدوية والسموم (NMPB)؟', en: 'What is the primary role of the National Medicines and Poisons Board (NMPB)?' }, options: { ar: ['تنظيم الرقابة على الأدوية والمستلزمات الطبية والسموم في السودان', 'تصنيع الأدوية محلياً', 'بيع الأدوية للجمهور مباشرة', 'إدارة المستشفيات الحكومية'], en: ['Regulatory control of medicines, medical devices, and poisons in Sudan', 'Manufacturing medicines locally', 'Selling medicines directly to the public', 'Managing government hospitals'] }, correctAnswer: 0 },
        { _id: 'nmpb_tf1', unitId: 'nmpb-reg', type: 'tf', questionText: { ar: 'هل يتولى المجلس القومي للأدوية والسموم مسؤولية تسجيل الأدوية البشرية والبيطرية؟', en: 'Is the NMPB responsible for registering both human and veterinary medicines?' }, correctAnswer: true }
    ],
    // --- BASIC UNITS ---
    'gmp-intro': [
        { _id: 'gmp_q1', unitId: 'gmp-intro', type: 'mcq', questionText: { ar: 'من المسؤول عن ضمان الجودة (QA) في المصنع؟', en: 'Who is responsible for QA in the factory?' }, options: { ar: ['وحدة الجودة فقط', 'الإدارة العليا فقط', 'جميع الموظفين المعنيين', 'الجهات الخارجية فقط'], en: ['Quality Unit only', 'Senior management only', 'All personnel involved', 'External parties only'] }, correctAnswer: 2 },
        { _id: 'gmp_tf1', unitId: 'gmp-intro', type: 'tf', questionText: { ar: 'هل ضمان الجودة (QA) هو جزء من مراقبة الجودة (QC)؟', en: 'Is Quality Assurance (QA) a part of Quality Control (QC)?' }, correctAnswer: false }
    ],
    'glp-basics': [
        { _id: 'glp_q1', unitId: 'glp-basics', type: 'mcq', questionText: { ar: 'من هو الشخص المسؤول بالكامل عن السيطرة الفنية للدراسة في الـ GLP؟', en: 'Who is fully responsible for the technical conduct of a GLP study?' }, options: { ar: ['عامل المختبر', 'مدير الدراسة (Study Director)', 'مدير المشتريات', 'مسؤول الأمن'], en: ['Lab tech', 'Study Director', 'Purchasing manager', 'Security'] }, correctAnswer: 1 }
    ],
    'iso-17025': [
        { _id: 'iso_q1', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'ما هو التركيز الرئيسي لإصدار ISO 17025:2017؟', en: 'What is the primary focus of ISO 17025:2017 version?' }, options: { ar: ['زيادة التقارير الورقية', 'التفكير المبني على المخاطر', 'تقليل عدد المختبرات', 'استبدال الموازين اليدوية'], en: ['Increasing paperwork', 'Risk-based thinking', 'Reducing lab count', 'Replacing manual balances'] }, correctAnswer: 1 }
    ],
    'ich-guidelines': [
        { _id: 'ich_q1', unitId: 'ich-guidelines', type: 'mcq', questionText: { ar: 'أي قسم في ICH يركز على اختبارات الثبات والشوائب؟', en: 'Which ICH section focuses on Stability and Impurities?' }, options: { ar: ['Safety (S)', 'Quality (Q)', 'Efficacy (E)', 'Multidisciplinary (M)'], en: ['Safety (S)', 'Quality (Q)', 'Efficacy (E)', 'Multidisciplinary (M)'] }, correctAnswer: 1 }
    ],
    // --- INTERMEDIATE UNITS ---
    'adv-gmp': [
        { _id: 'adv_gmp_q1', unitId: 'adv-gmp', type: 'mcq', questionText: { ar: 'ما هو الفرق الجوهري بين ضمان الجودة (QA) ونظام الجودة الصيدلاني (PQS)؟', en: 'What is the fundamental difference between QA and PQS (ICH Q10)?' }, options: { ar: ['الـ QA أشمل ويغطي دورة حياة المنتج بالكامل', 'الـ PQS يركز فقط على التصنيع بينما QA يركز على الأوزان', 'PQS نموذج حديث يربط GMP بالتطوير وتحسين العمليات المستمر', 'لا يوجد فرق بينهما'], en: ['QA is broader, covering the full product lifecycle', 'PQS only focuses on manufacturing while QA focuses on weights', 'PQS is a modern model linking GMP to development and continuous process improvement', 'There is no difference between them'] }, correctAnswer: 2 },
        { _id: 'adv_gmp_q3', unitId: 'adv-gmp', type: 'mcq', questionText: { ar: 'ماذا يعني مصطلح "Data Integrity" (نزاهة البيانات) حسب معيار ALCOA+؟', en: 'What does "Data Integrity" mean according to ALCOA+ standards?' }, options: { ar: ['أن تكون البيانات جميلة ومنسقة', 'أن تكون البيانات معاصرة، منسوبة، دقيقة، وأصلية ومقروءة', 'أن يتم حفظها في ملفات ورقية فقط', 'أن تكون باللغة الإنجليزية حصراً'], en: ['Data must be beautiful and formatted', 'Data must be Attributable, Legible, Contemporaneous, Original, and Accurate', 'Data saved in paper files only', 'Data must be in English exclusively'] }, correctAnswer: 1 }
    ],
    'adv-glp': [
        { _id: 'adv_glp_q1', unitId: 'adv-glp', type: 'mcq', questionText: { ar: 'في حال فشل العينة (OOS)، ما هو الإجراء الصحيح في المرحلة الأولى من التحقيق المخبري؟', en: 'In case of a failing sample (OOS), what is the correct action in Phase 1 of the lab investigation?' }, options: { ar: ['إعادة الاختبار فوراً حتى تنجح العينة', 'إعدام العينة والتخلص منها', 'التحقق من الكواشف والأدوات والمحاليل الأصلية (Stock) دون التخلص منها', 'تغيير النتائج في السجل الرسمى'], en: ['Retest immediately until it passes', 'Discard the sample and dispose of it', 'Verify reagents, tools, and the original Stock solution without discarding them', 'Change the results in official logs'] }, correctAnswer: 2 }
    ],
    'adv-validation': [
        { _id: 'adv_val_q1', unitId: 'adv-validation', type: 'mcq', questionText: { ar: 'حسب إرشادات 2011، التحقق من العملية (Process Validation) أصبح يتكون من:', en: 'According to 2011 guidelines, Process Validation now consists of:' }, options: { ar: ['ثلاث دفعات تجريبية فقط', 'دورة حياة تشمل التصميم والتأهيل والتحقق المستمر (CPV)', 'فحص المنتج النهائي فقط', 'كتابة تقرير واحد في السنة'], en: ['Three trial batches only', 'A lifecycle comprising Design, Qualification, and Continuous Verification (CPV)', 'Final product testing only', 'Writing one report per year'] }, correctAnswer: 1 }
    ],
    'adv-qrm': [
        { _id: 'adv_qrm_q1', unitId: 'adv-qrm', type: 'mcq', questionText: { ar: 'في تحليل المخاطر (FMEA)، ما هي العناصر الثلاثة المستخدمة لحساب رقم أولوية المخاطر (RPN)؟', en: 'In Risk Analysis (FMEA), what are the three elements used to compute RPN?' }, options: { ar: ['السعر، الوقت، الجمال', 'الشدة (Severity)، الوقوع (Occurrence)، الاكتشاف (Detection)', 'اسم الموظف، رقم الجهاز، تاريخ اليوم', 'لا توجد عناصر محددة'], en: ['Price, Time, Beauty', 'Severity, Occurrence, Detection', 'Employee name, instrument ID, date', 'No specific elements'] }, correctAnswer: 1 }
    ],
    'adv-gdp': [
        { _id: 'adv_gdp_q1', unitId: 'adv-gdp', type: 'mcq', questionText: { ar: 'ما هو المبدأ الأساسي لشحن أدوية "Cold Chain" (سلسلة التبريد)؟', en: 'What is the primary principle of shipping "Cold Chain" bio-meds?' }, options: { ar: ['الشحن في أي درجة حرارة متاحة', 'الحفاظ على درجة حرارة 2-8 مئوية طوال الرحلة وتوثيقها بمسجلات البيانات', 'التجميد الدائم للأدوية حتى تصل للعميل', 'استخدام صناديق كرتونية عادية'], en: ['Shipping at any available temperature', 'Maintaining 2-8°C throughout the journey and documenting it via data loggers', 'Permanent freezing until delivery', 'Using standard cardboard boxes'] }, correctAnswer: 1 }
    ]
};

// Flatten all categories into a single array for easier lookup by _id if needed
const flatQuestions = Object.values(demoQuestions).flat();

module.exports = {
  demoQuestions: flatQuestions,
  getQuestionsByUnit: (unitId, count = 10) => {
    const questions = demoQuestions[unitId] || [];
    // Shuffle and return requested count
    return questions.sort(() => Math.random() - 0.5).slice(0, count);
  },
  checkAnswer: (id, answer) => {
    const q = flatQuestions.find(it => it._id === id);
    if (!q) return { found: false };
    
    let isCorrect = false;
    if (q.type === 'fill') {
        const normalizedUser = String(answer || '').trim().toLowerCase();
        isCorrect = (q.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
    } else {
        isCorrect = q.correctAnswer === answer;
    }
    
    return {
        found: true,
        isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || { ar: 'لم يتم توفير شرح في وضع العرض التوضيحي.', en: 'No explanation provided in demo mode.' }
    };
  }
};
