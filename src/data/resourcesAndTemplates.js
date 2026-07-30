/**
 * resourcesAndTemplates.js
 * Official Regulatory Resources & Interactive GMP Templates
 * Imported from G:\GMP Pharma
 */

export const REGULATORY_RESOURCES = [
  // FDA Resources
  {
    id: 'fda-21cfr',
    agency: 'FDA',
    category: 'GMP',
    title: '21 CFR Part 210/211',
    titleAr: '21 CFR Part 210/211 - أسلوب التصنيع الجيد للأدوية',
    description: 'Current Good Manufacturing Practice in Manufacturing, Processing, Packing, or Holding of Drugs.',
    descriptionAr: 'القواعد النهائية لممارسات التصنيع الجيد للأدوية - المرجع الأساسي لـ GMP في الولايات المتحدة.',
    link: 'https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?CFRPart=210',
    badge: '21 CFR',
    icon: '🏛️',
  },
  {
    id: 'fda-guidance',
    agency: 'FDA',
    category: 'Guidance',
    title: 'FDA Guidance for Industry',
    titleAr: 'دليل FDA الإرشادي للصناعة الصيدلانية',
    description: 'Comprehensive guidelines for GMP compliance, risk management, and quality control.',
    descriptionAr: 'دليل إرشادي شامل من FDA لممارسات التصنيع الجيد والتحكم في الجودة.',
    link: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents',
    badge: 'Guidance',
    icon: '📄',
  },
  {
    id: 'fda-pv',
    agency: 'FDA',
    category: 'Validation',
    title: 'Process Validation Guidance',
    titleAr: 'إرشادات FDA للتحقق من العمليات (Process Validation)',
    description: 'General Principles and Practices for Process Validation (Stage 1, 2 & 3).',
    descriptionAr: 'دليل FDA لتحقق العمليات - إرشادات شاملة لـ IQ/OQ/PQ والدورة الحياتية للعملية.',
    link: 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents?search=process+validation',
    badge: 'Validation',
    icon: '🔬',
  },

  // WHO Resources
  {
    id: 'who-gmp',
    agency: 'WHO',
    category: 'GMP',
    title: 'WHO GMP Guidelines',
    titleAr: 'إرشادات منظمة الصحة العالمية لـ GMP',
    description: 'World Health Organization guidelines for good manufacturing practices of pharmaceutical products.',
    descriptionAr: 'إرشادات منظمة الصحة العالمية لممارسات التصنيع الجيد - المعيار العالمي للمنشآت الصيدلانية.',
    link: 'https://www.who.int/medicines/areas/quality_safety/quality_assurance/gmp/en/',
    badge: 'WHO TRS',
    icon: '🌍',
  },
  {
    id: 'who-qa',
    agency: 'WHO',
    category: 'Quality Assurance',
    title: 'WHO Quality Assurance',
    titleAr: 'نظام ضمان الجودة الصيدلاني - WHO',
    description: 'Comprehensive guidelines for quality control laboratories and distribution practices.',
    descriptionAr: 'نظام ضمان الجودة الشامل من منظمة الصحة العالمية للمختبرات والتوزيع.',
    link: 'https://www.who.int/medicines/areas/quality_safety/quality_assurance/en/',
    badge: 'QA System',
    icon: '🛡️',
  },
  {
    id: 'who-prequal',
    agency: 'WHO',
    category: 'Prequalification',
    title: 'WHO Prequalification Program',
    titleAr: 'برنامج التأهيل المسبق للأدوية - WHO',
    description: 'Ensures medicines supplied by international procurement agencies meet acceptable standards.',
    descriptionAr: 'برنامج التأهيل المسبق لمنظمة الصحة العالمية لضمان سلامة وجودة الأدوية العالمية.',
    link: 'https://www.who.int/prequalification/',
    badge: 'Prequal',
    icon: '🏅',
  },

  // ICH Resources
  {
    id: 'ich-q7',
    agency: 'ICH',
    category: 'ICH Q7',
    title: 'ICH Q7 - GMP for Active Pharmaceutical Ingredients',
    titleAr: 'ICH Q7 - التصنيع الجيد للمواد الفعالة (APIs)',
    description: 'Guidance for active pharmaceutical ingredient manufacturing and quality management.',
    descriptionAr: 'ممارسات التصنيع الجيد للمواد الفعالة الصيدلانية (API) والتحكم في سلاسل التوريد.',
    link: 'https://www.ich.org/page/quality-guidelines',
    badge: 'ICH Q7',
    icon: '📋',
  },
  {
    id: 'ich-q9',
    agency: 'ICH',
    category: 'ICH Q9',
    title: 'ICH Q9(R1) - Quality Risk Management',
    titleAr: 'ICH Q9 - إدارة مخاطر الجودة (QRM)',
    description: 'Systematic process for the assessment, control, communication, and review of quality risks.',
    descriptionAr: 'إدارة مخاطر الجودة - إطار علمي وشامل لتحليل وتقييم مخاطر جودة الدواء.',
    link: 'https://www.ich.org/page/quality-guidelines',
    badge: 'ICH Q9',
    icon: '⚠️',
  },
  {
    id: 'ich-q10',
    agency: 'ICH',
    category: 'ICH Q10',
    title: 'ICH Q10 - Pharmaceutical Quality System',
    titleAr: 'ICH Q10 - نظام الجودة الصيدلاني (PQS)',
    description: 'Model for an effective quality management system across the product lifecycle.',
    descriptionAr: 'نظام الجودة الصيدلاني - نموذج متكامل للتحسين المستمر ودورة حياة المنتج.',
    link: 'https://www.ich.org/page/quality-guidelines',
    badge: 'ICH Q10',
    icon: '🏆',
  },
  {
    id: 'ich-q2',
    agency: 'ICH',
    category: 'ICH Q2',
    title: 'ICH Q2(R2) - Validation of Analytical Procedures',
    titleAr: 'ICH Q2(R2) - اعتماد الطرق التحليلية',
    description: 'Validation parameters including specificity, linearity, accuracy, precision, and LOD/LOQ.',
    descriptionAr: 'اعتماد الطرق التحليلية - معايير ودراسات الدقة والضبط في مختبرات QC.',
    link: 'https://www.ich.org/page/quality-guidelines',
    badge: 'ICH Q2',
    icon: '🧪',
  },

  // ISO Standards
  {
    id: 'iso-9001',
    agency: 'ISO',
    category: 'ISO 9001',
    title: 'ISO 9001:2015',
    titleAr: 'ISO 9001:2015 - نظام إدارة الجودة',
    description: 'International benchmark for Quality Management Systems across industries.',
    descriptionAr: 'نظام إدارة الجودة - المعيار الدولي الأكثر اعتماداً لإدارة العمليات.',
    link: 'https://www.iso.org/standard/64620.html',
    badge: 'ISO 9001',
    icon: '📊',
  },
  {
    id: 'iso-17025',
    agency: 'ISO',
    category: 'ISO 17025',
    title: 'ISO/IEC 17025:2017',
    titleAr: 'ISO/IEC 17025:2017 - كفاءة مختبرات الفحص والمعايرة',
    description: 'General requirements for the competence of testing and calibration laboratories.',
    descriptionAr: 'متطلبات كفاءة مختبرات الاختبار والمعايرة والمواصفات المعتمدة.',
    link: 'https://www.iso.org/standard/66812.html',
    badge: 'ISO 17025',
    icon: '⚖️',
  },
  {
    id: 'iso-13485',
    agency: 'ISO',
    category: 'ISO 13485',
    title: 'ISO 13485:2016',
    titleAr: 'ISO 13485:2016 - إدارة الجودة للأجهزة الطبية',
    description: 'Quality Management Systems for Medical Devices regulatory requirements.',
    descriptionAr: 'نظام إدارة الجودة المعتمد للأجهزة الطبية والمستلزمات التشخيصية.',
    link: 'https://www.iso.org/standard/59752.html',
    badge: 'ISO 13485',
    icon: '🩺',
  },

  // EMA Standards
  {
    id: 'ema-gmp',
    agency: 'EMA',
    category: 'EU GMP',
    title: 'EU GMP Guidelines (EudraLex Vol 4)',
    titleAr: 'إرشادات GMP الأوروبية (EudraLex Vol 4)',
    description: 'The rules governing medicinal products in the European Union, Parts I, II & III + Annexes.',
    descriptionAr: 'إرشادات التصنيع الجيد الأوروبية - تشمل الملحق 1 الخاص بالمنتجات المعقمة.',
    link: 'https://www.ema.europa.eu/en/human-regulatory/research-development/compliance/good-manufacturing-practice',
    badge: 'EU GMP',
    icon: '🇪🇺',
  },
  {
    id: 'ema-guidelines',
    agency: 'EMA',
    category: 'EMA Scientific',
    title: 'EMA Scientific Guidelines',
    titleAr: 'المبادئ العلمية الشاملة من EMA',
    description: 'Scientific advice and regulatory guidance for quality, safety, and efficacy.',
    descriptionAr: 'المبادئ العلمية الشاملة والارشادية من الوكالة الأوروبية للأدوية.',
    link: 'https://www.ema.europa.eu/en/human-regulatory/research-development/scientific-guidelines-overview',
    badge: 'Scientific',
    icon: '📘',
  },

  // Video Resources
  {
    id: 'video-fda',
    agency: 'Videos',
    category: 'Training Webinars',
    title: 'FDA Continuing Education & Webinars',
    titleAr: 'فيديوهات وندوات FDA التدريبية',
    description: 'Official video lectures and webinars covering cGMP compliance and inspections.',
    descriptionAr: 'سلسلة الندوات الإلكترونية والمحاضرات التدريبية من FDA حول الامتثال لـ cGMP.',
    link: 'https://www.fda.gov/drugs/development-approval-process-drugs/training-and-continuing-education',
    badge: 'Webinar',
    icon: '🎥',
  },
  {
    id: 'video-who',
    agency: 'Videos',
    category: 'Training Webinars',
    title: 'WHO Quality Assurance Training Videos',
    titleAr: 'فيديوهات تدريب منظمة الصحة العالمية (WHO)',
    description: 'Training modules covering inspections, GDP, and sterile manufacturing.',
    descriptionAr: 'فيديوهات ووحدات تدريبية تفاعلية من WHO في التفتيش وضمان الجودة.',
    link: 'https://www.who.int/medicines/areas/quality_safety/quality_assurance/training/en/',
    badge: 'WHO Video',
    icon: '🎬',
  },
];

export const GMP_TEMPLATES = [
  {
    id: 'bmr-bpr',
    title: 'Batch Manufacturing Record (BMR / BPR)',
    titleAr: 'نموذج سجل تشغيل الدفعة (BMR / BPR)',
    category: 'GMP',
    icon: '📋',
    badge: 'GMP Core',
    description: 'Standard template for documenting batch details, raw material reconciliation, and IPQC according to 21 CFR 211 & WHO GMP.',
    descriptionAr: 'نموذج قياسي لتوثيق تشغيلة الدفعة، مطابقة المواد الخام، ومراقبة الجودة أثناء التصنيع (IPQC).',
    fields: [
      { name: 'productName', label: 'اسم المنتج', labelEn: 'Product Name', type: 'text', required: true, default: 'Paracetamol 500mg Tablets' },
      { name: 'batchNumber', label: 'رقم الدفعة', labelEn: 'Batch Number', type: 'text', required: true, default: 'BN-2026-0891' },
      { name: 'batchSize', label: 'حجم الدفعة', labelEn: 'Batch Size', type: 'text', required: true, default: '500,000 Tablets (150 kg)' },
      { name: 'productionDate', label: 'تاريخ الإنتاج', labelEn: 'Production Date', type: 'date', required: true, default: '2026-08-01' },
      { name: 'expiryDate', label: 'تاريخ الانتهاء', labelEn: 'Expiry Date', type: 'date', required: true, default: '2029-08-01' },
      { name: 'supervisor', label: 'اسم المشرف المسؤول', labelEn: 'Production Supervisor', type: 'text', required: true, default: 'Dr. Ahmed Hassan' },
      { name: 'operator', label: 'المشغل الرئيس', labelEn: 'Lead Operator', type: 'text', required: true, default: 'Tariq Mohamed' },
      { name: 'notes', label: 'ملاحظات وتوجيهات خاصة', labelEn: 'Special Instructions / Notes', type: 'textarea', required: false, default: 'Ensure RH < 45% during granulation stage.' },
    ],
    markdownContent: `# Batch Manufacturing Record (BMR) / Batch Production Record (BPR) Template
## قالب وثيقة الدفعة (BMR/BPR)

---

### معلومات المنتج
**اسم المنتج:** __________________________  
**رقم المنتج:** __________________________  
**حجم الدفعة:** __________________________  
**رقم الدفعة:** __________________________  
**تاريخ الإنتاج:** __________________________  
**تاريخ انتهاء الصلاحية:** __________________________  

---

### معلومات المواد الخام
| المادة | رقم المواصفات | الكمية المطلوبة | الكمية المستخدمة | رقم الدفعة | التحقق |
|--------|--------------|----------------|-----------------|-----------|--------|
|        |              |                |                 |           |        |
|        |              |                |                 |           |        |
|        |              |                |                 |           |        |

---

### إجراءات التصنيع
#### المرحلة 1: التحضير
- [ ] التحقق من نظافة المعدات
- [ ] التحقق من صلاحية المواد الخام
- [ ] إعداد المعدات
- [ ] التحقق من المعايير البيئية

**ملاحظات:** _________________________________________________________

#### المرحلة 2: التصنيع
- [ ] وزن المواد الخام
- [ ] خلط المواد
- [ ] المعالجة الحرارية
- [ ] التعبئة

**ملاحظات:** _________________________________________________________

#### المرحلة 3: التعبئة والتغليف
- [ ] التحقق من جودة العبوات
- [ ] التعبئة
- [ ] التغليف
- [ ] التسمية

**ملاحظات:** _________________________________________________________

---

### مراقبة الجودة أثناء العملية (IPQC)
| المعيار | المطلوب | الفعلي | الحالة |
|----------|--------|--------|--------|
| الوزن | | | |
| الصلابة | | | |
| التفكك | | | |
| الذوبان | | | |
| اللون | | | |
| الرائحة | | | |

---

### نتائج الاختبار النهائي
| الاختبار | المواصفات | النتيجة | الحالة |
|----------|-----------|---------|--------|
| الهوية | | | |
| النقاء | | | |
| القوة | | | |
| التلوث الميكروبي | | | |

---

### الموافقة والإفراج
**تم إنتاج الدفعة وفق GMP:** [ ] نعم [ ] لا  
**الدفعة مطابقة للمواصفات:** [ ] نعم [ ] لا  

**توقيع المشرف:** __________________________  
**التاريخ:** __________________________  

**توقيع ضبط الجودة:** __________________________  
**التاريخ:** __________________________  

**إفراج الدفعة:** [ ] معتمد [ ] مرفوض  

---

**ملاحظة:** هذا القالب متوافق مع متطلبات FDA 21 CFR Part 211 و WHO GMP Guidelines`
  },
  {
    id: 'capa-deviation',
    title: 'CAPA & Deviation Investigation Form',
    titleAr: 'نموذج تقرير الانحراف والإجراءات التصحيحية (CAPA)',
    category: 'CAPA',
    icon: '📊',
    badge: 'CAPA System',
    description: 'Root cause analysis (5 Whys / Fishbone) and CAPA tracking sheet compliant with ICH Q10.',
    descriptionAr: 'توثيق الانحرافات، تحليل السبب الجذري (5 Whys)، ومتابعة تنفيذ الإجراءات التصحيحية والوقائية.',
    fields: [
      { name: 'deviationNumber', label: 'رقم الانحراف', labelEn: 'Deviation No.', type: 'text', required: true, default: 'DEV-2026-042' },
      { name: 'deviationDate', label: 'تاريخ الاكتشاف', labelEn: 'Discovery Date', type: 'date', required: true, default: '2026-07-20' },
      { name: 'discoveredBy', label: 'المكتشف بواسطة', labelEn: 'Discovered By', type: 'text', required: true, default: 'Sara Ali (QC Analyst)' },
      { name: 'severity', label: 'درجة الشدة', labelEn: 'Severity Level', type: 'select', options: ['بسيط (Minor)', 'متوسط (Major)', 'حرج (Critical)'], required: true, default: 'متوسط (Major)' },
      { name: 'description', label: 'وصف الانحراف', labelEn: 'Deviation Description', type: 'textarea', required: true, default: 'Temperature spike in Granulation Oven #2 exceeded limit (72°C vs max 65°C) for 12 minutes.' },
      { name: 'rootCause', label: 'السبب الجذري (Root Cause)', labelEn: 'Root Cause', type: 'textarea', required: true, default: 'Faulty temperature sensor probe RTD-04 due to wear.' },
      { name: 'correctiveAction', label: 'الإجراء التصحيحي (CAPA)', labelEn: 'Corrective Action', type: 'textarea', required: true, default: 'Replace RTD-04 sensor, recalibrate oven, and re-test batch stability.' },
      { name: 'responsible', label: 'المسؤول عن التنفيذ', labelEn: 'Responsible Person', type: 'text', required: true, default: 'Eng. Khalid Omar' },
    ],
    markdownContent: `# CAPA (Corrective and Preventive Actions) Template
## قالب الإجراءات التصحيحية والوقائية

---

### معلومات الانحراف
**رقم الانحراف:** __________________________  
**تاريخ الاكتشاف:** __________________________  
**مكتشف بواسطة:** __________________________  
**القسم/المنطقة:** __________________________  
**نوع الانحراف:** [ ] جودة [ ] سلامة [ ] توثيق [ ] أخرى  

---

### وصف الانحراف
**وصف مفصل للانحراف:**
_________________________________________________________________________

**المنتج المتأثر:** __________________________  
**رقم الدفعة:** __________________________  
**الكمية المتأثرة:** __________________________  

---

### التصنيف الأولي
**شدة الانحراف:**
- [ ] حرج - يؤثر على جودة المنتج/سلامة المريض
- [ ] متوسط - يؤثر على الامتثال/الإنتاجية
- [ ] بسيط - تأثير محدود

---

### تحليل السبب الجذري (Root Cause Analysis - 5 Whys)
1. لماذا حدث الانحراف؟ ________________________________________________
2. لماذا حدث ذلك؟ ________________________________________________
3. لماذا حدث ذلك؟ ________________________________________________
4. لماذا حدث ذلك؟ ________________________________________________
5. لماذا حدث ذلك؟ ________________________________________________

#### السبب الجذري المحدد:
_________________________________________________________________________

---

### الإجراءات التصحيحية والوقائية (CAPA)
| الإجراء | المسؤول | تاريخ البدء | تاريخ الإنجاز المتوقع | الحالة |
|---------|---------|-------------|---------------------|--------|
|         |         |             |                     |        |
|         |         |             |                     |        |

---

### التوثيق والموافقة
**توقيع مسؤول الانحراف:** __________________________  
**توقيع ضبط الجودة:** __________________________  
**التاريخ:** __________________________  

**ملاحظة:** هذا القالب متوافق مع ICH Q10 و FDA CAPA Guidelines`
  },
  {
    id: 'iq-oq-pq',
    title: 'Equipment & Process Qualification (IQ/OQ/PQ)',
    titleAr: 'نموذج بروتوكول التأهيل والتحقق (IQ / OQ / PQ)',
    category: 'Validation',
    icon: '🔬',
    badge: 'Validation',
    description: 'Installation, Operational, and Performance Qualification protocol for pharmaceutical equipment.',
    descriptionAr: 'بروتوكول التحقق والتثبيت المعتمد لمعدات وأجهزة التصنيع وفق معايير FDA & GAMP 5.',
    fields: [
      { name: 'equipmentName', label: 'اسم المعدة / الجهاز', labelEn: 'Equipment Name', type: 'text', required: true, default: 'High Shear Mixer Granulator' },
      { name: 'equipmentID', label: 'رقم التعريف (ID)', labelEn: 'Equipment ID', type: 'text', required: true, default: 'EQ-MIX-004' },
      { name: 'validationType', label: 'نوع المرحلة', labelEn: 'Qualification Phase', type: 'select', options: ['IQ (Installation)', 'OQ (Operational)', 'PQ (Performance)', 'Combined (IQ/OQ/PQ)'], required: true, default: 'Combined (IQ/OQ/PQ)' },
      { name: 'location', label: 'مكان التثبيت', labelEn: 'Location / Room', type: 'text', required: true, default: 'Solid Dosage Processing Room 102' },
      { name: 'acceptanceCriteria', label: 'معايير القبول', labelEn: 'Acceptance Criteria', type: 'textarea', required: true, default: 'Impeller speed accuracy ±1 RPM, Seal integrity holding at 2.5 bar for 30 mins.' },
      { name: 'results', label: 'نتائج الاختبارات', labelEn: 'Testing Results Summary', type: 'textarea', required: true, default: 'All parameters met acceptance criteria. 3 consecutive batches passed PQ.' },
      { name: 'conclusion', label: 'القرار النهائي', labelEn: 'Conclusion', type: 'select', options: ['مقبول ومطابق (Approved)', 'معلق - إجراءات مطلوبة (Conditional)', 'مرفوض (Rejected)'], required: true, default: 'مقبول ومطابق (Approved)' },
    ],
    markdownContent: `# IQ/OQ/PQ Validation Template
## قالب التحقق والتثبيت (Validation & Qualification)

---

### معلومات المشروع
**اسم المعدات/العملية:** __________________________  
**رقم المشروع:** __________________________  
**الموقع:** __________________________  
**التاريخ:** __________________________  
**المسؤول:** __________________________  

---

### IQ - Installation Qualification (تثبيت المعدات)
- [ ] التحقق من المواصفات الفنية
- [ ] التحقق من التثبيت الكهربائي والميكانيكي
- [ ] التحقق من دليل التشغيل والمعايرة

---

### OQ - Operational Qualification (التشغيل التشغيلي)
| الوظيفة | المعيار | النتيجة | الحالة |
|---------|--------|---------|--------|
| سرعة المحرك | 50-300 RPM | | |
| نظام السلامة | إيقاف فوري | | |

---

### PQ - Performance Qualification (الأداء)
- [ ] 3 دفعات متتالية ضمن المواصفات
- [ ] نتائج متسقة واستقرار العملية

---

### القبول النهائي والموافقات
**المهندس:** __________________________  
**ضبط الجودة:** __________________________  
**التاريخ:** __________________________  

**ملاحظة:** هذا القالب متوافق مع FDA Guidance for Process Validation و GAMP 5`
  },
  {
    id: 'oot-oos',
    title: 'OOT / OOS Investigation Protocol',
    titleAr: 'نموذج تحقيق النتائج خارج المواصفات والاتجاه (OOT/OOS)',
    category: 'Lab Quality',
    icon: '🔍',
    badge: 'QC Lab',
    description: 'Laboratory Phase I and Phase II investigation checklist for out-of-specification test results.',
    descriptionAr: 'بروتوكول التحقيق المخبري في نتائج الفحوصات غير المطابقة للمواصفات وفق متطلبات FDA OOS Guidance.',
    fields: [
      { name: 'testNumber', label: 'رقم الفحص / التقرير', labelEn: 'Test Ref No.', type: 'text', required: true, default: 'QC-OOS-2026-015' },
      { name: 'productName', label: 'المنتج / العينة', labelEn: 'Sample / Product', type: 'text', required: true, default: 'Amoxicillin 250mg Suspension' },
      { name: 'batchNumber', label: 'رقم الدفعة', labelEn: 'Batch No.', type: 'text', required: true, default: 'AMX-26-104' },
      { name: 'type', label: 'تصنيف النتيجة', labelEn: 'Result Classification', type: 'select', options: ['OOS (Out of Specification)', 'OOT (Out of Trend)'], required: true, default: 'OOS (Out of Specification)' },
      { name: 'specLimit', label: 'المواصفة المعتمدة', labelEn: 'Spec Limit', type: 'text', required: true, default: 'Assay: 95.0% - 105.0%' },
      { name: 'actualResult', label: 'النتيجة الفعلية', labelEn: 'Actual Result', type: 'text', required: true, default: '91.4% (Out of specification)' },
      { name: 'analystName', label: 'اسم المحلل المخبري', labelEn: 'Analyst Name', type: 'text', required: true, default: 'Mona Ibrahim' },
      { name: 'phase1Conclusion', label: 'استنتاج المرحلة الأولى (Lab Check)', labelEn: 'Phase 1 Finding', type: 'textarea', required: true, default: 'No lab error identified in calculation, instrument calibration, or volumetric glassware.' },
    ],
    markdownContent: `# OOT/OOS Template
## قالب نتائج خارج الاتجاه / خارج المواصفات

---

### معلومات الاختبار
**رقم الاختبار:** __________________________  
**التاريخ:** __________________________  
**المحلل:** __________________________  
**المنتج / الدفعة:** __________________________  

---

### نوع النتيجة
- [ ] OOT (Out of Trend) - خارج الاتجاه المتوقع
- [ ] OOS (Out of Specification) - خارج المواصفات المحددة

---

### التحقيق الأولي (Phase I Laboratory Investigation)
- [ ] التحقق من حسابات المحلل
- [ ] المعايرة وصلاحية الكواشف
- [ ] إعادة الفحص بواسطة محلل ثانٍ

---

### القرار النهائي
- [ ] الدفعة مقبولة
- [ ] الدفعة مرفوضة
- [ ] إعادة تصنيع / تجميع

**توقيع مدير QC:** __________________________  
**التاريخ:** __________________________`
  },
  {
    id: 'quality-policy',
    title: 'Pharmaceutical Quality Policy & Manual',
    titleAr: 'دليل وسياسة الجودة الصيدلانية الشاملة',
    category: 'QMS',
    icon: '📝',
    badge: 'QMS ISO 9001',
    description: 'Corporate Quality Policy framework aligned with ISO 9001:2015 and ICH Q10.',
    descriptionAr: 'صياغة ودليل سياسة الجودة، أهداف الجودة المترابطة، والالتزام التنظيمي للمؤسسة الصيدلانية.',
    fields: [
      { name: 'companyName', label: 'اسم الشركة / المنظمة', labelEn: 'Organization Name', type: 'text', required: true, default: 'Sudan Quality Pharma Care' },
      { name: 'issueDate', label: 'تاريخ الإصدار', labelEn: 'Issue Date', type: 'date', required: true, default: '2026-01-01' },
      { name: 'revisionNo', label: 'رقم المراجعة', labelEn: 'Revision Number', type: 'text', required: true, default: 'Rev. 04' },
      { name: 'qualityGoal1', label: 'هدف الجودة الأول', labelEn: 'Quality Objective 1', type: 'text', required: true, default: 'Achieve > 98% first-time-right batch release rate.' },
      { name: 'qualityGoal2', label: 'هدف الجودة الثاني', labelEn: 'Quality Objective 2', type: 'text', required: true, default: 'Zero critical regulatory non-conformances.' },
      { name: 'approvedBy', label: 'معتمد من (المدير العام)', labelEn: 'Approved By (General Manager)', type: 'text', required: true, default: 'Dr. Daoud Tajeldeinn' },
    ],
    markdownContent: `# Quality Policy Template
## قالب سياسة الجودة

---

### معلومات المنظمة
**اسم المنظمة:** __________________________  
**تاريخ الإصدار:** __________________________  
**رقم المراجعة:** __________________________  

---

### سياسة الجودة
"تلتزم المنظمة بتوفير منتجات صيدلانية عالية الجودة والفاعلية تلبي وتتجاوز تطلعات المرضى والهيئات التنظيمية وفق معايير ISO 9001 و GMP."

---

### أهداف الجودة الرئيسية
1. الامتثال التام لمعايير التصنيع الجيد GMP.
2. التحسين المستمر لعمليات الإنتاج والتحليل.
3. التقييم والتدريب المستمر للكادر البشري.`
  },
  {
    id: 'internal-audit',
    title: 'Internal GMP Audit Checklist & Report',
    titleAr: 'قائمة وقالب التقرير للتدقيق الداخلي للجودة',
    category: 'QMS',
    icon: '🏢',
    badge: 'Audit',
    description: 'Internal quality audit checklist covering premises, sanitation, documentation, and HVAC.',
    descriptionAr: 'قائمة فحص وتقييم جاهزية المنشأة والتفتيش الداخلي الدوري للالتزام بمعايير GMP و ISO 17025.',
    fields: [
      { name: 'auditNumber', label: 'رقم التدقيق', labelEn: 'Audit ID', type: 'text', required: true, default: 'AUD-2026-Q3' },
      { name: 'auditDate', label: 'تاريخ التدقيق', labelEn: 'Audit Date', type: 'date', required: true, default: '2026-07-25' },
      { name: 'department', label: 'القسم المدقق', labelEn: 'Audited Dept', type: 'text', required: true, default: 'Packaging & Warehousing' },
      { name: 'auditorName', label: 'المدقق الرئيسي', labelEn: 'Lead Auditor', type: 'text', required: true, default: 'Dr. Amna Hassan' },
      { name: 'complianceScore', label: 'درجة الامتثال التقديرية', labelEn: 'Compliance Score', type: 'select', options: ['ممتاز (95-100%)', 'جيد جداً (85-94%)', 'مقبول (75-84%)', 'يحتاج تحسين (<75%)'], required: true, default: 'ممتاز (95-100%)' },
      { name: 'observations', label: 'أبرز الملاحظات والفرص', labelEn: 'Observations & Opportunities', type: 'textarea', required: true, default: 'Logbooks were cleanly maintained; secondary gowning area pressure differential display requires recalibration.' },
    ],
    markdownContent: `# Internal Audit Template
## قالب التدقيق الداخلي

---

### معلومات التدقيق
**رقم التدقيق:** __________________________  
**تاريخ التدقيق:** __________________________  
**المدققون:** __________________________  
**القسم/المنطقة المدققة:** __________________________  

---

### خطة ونطاق التدقيق
- [ ] المباني والمرافق والنظافة
- [ ] التوثيق وسجلات التشغيل
- [ ] ضبط الجودة والمختبرات

---

### النتيجة العامة والتوصيات
**النتيجة:** [ ] ممتاز [ ] جيد [ ] يحتاج تحسين  
**توقيع المدقق الرئيسي:** __________________________`
  }
];
