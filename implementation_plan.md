# 🗺️ خطة التنفيذ — منصة السودان للجودة
> **للمساعد الذكاء الاصطناعي:** اقرأ هذا الملف كاملاً قبل أي إجراء. يحتوي على كل ما تحتاجه للبدء فوراً دون الحاجة لمراجعة باقي الملفات.
> آخر تحديث: يونيو 2026

---

## 1. هوية المشروع

| البند | القيمة |
|-------|--------|
| **المشروع** | Sudan Quality Platform — منصة تدريب دوائي تفاعلية |
| **المسار المحلي الصحيح** | `C:\Users\daoud\OneDrive\Desktop\منصة السودان للجودة` |
| **Frontend** | React + Vite → مستضاف على Firebase Hosting |
| **Backend** | Node.js + Express → مستضاف على Vercel (serverless) |
| **DB** | MongoDB Atlas (Mongoose) |
| **Auth** | Firebase Auth (Google popup) + JWT |
| **GitHub** | `https://github.com/daoudtajeldeinn-png/sudan-quality-platform` |

---

## 2. الملفات الحرجة للمعرفة

```
src/data/content_new.js        ← كل المحتوى التعليمي (الشرائح + أسئلة الاختبار)
src/pages/Dashboard.jsx        ← الداشبورد الرئيسي + منطق الشهادات
src/components/LectureView.jsx ← عارض الشرائح
src/components/Quiz.jsx        ← منطق الاختبار
src/LanguageContext.jsx        ← نظام الترجمة AR/EN
```

---

## 3. بنية content_new.js (مرجع سريع)

الملف يُصدِّر كائناً واحداً:

```js
export const educationalContent = {
  units: {
    'unit-id': {
      title: { ar: '...', en: '...' },
      slides: [
        {
          id: 'unique_slide_id',
          type: 'learning' | 'casestudy' | 'discussion',
          regulatoryRef: { code: 'Annex 15', body: 'PIC/S' }, // اختياري
          ar: { title: '...', text: '...' },
          en: { title: '...', text: '...' }
        }
      ],
      examQuestionPool: ['q_id_1', 'q_id_2', ...]
    }
  },
  questions: {
    'q_id_1': {
      type: 'mcq',
      questionText: { ar: '...', en: '...' },
      options: { ar: ['أ','ب','ج','د'], en: ['A','B','C','D'] },
      correctAnswer: 0  // رقم الإجابة الصحيحة (0-indexed)
    },
    'q_id_2': {
      type: 'tf',
      questionText: { ar: '...', en: '...' },
      correctAnswer: true | false
    },
    'q_id_3': {
      type: 'fill',
      questionText: { ar: '...', en: '...' },
      correctAnswer: { ar: '...', en: '...' }
    }
  }
}
```

**قواعد IDs:** استخدم prefix مختصر للوحدة + رقم. مثال:
- وحدة `process-validation` → slides: `pv_s1`, `pv_s2` ... questions: `pv_q1`, `pv_tf1`, `pv_fill1`
- وحدة `equipment-qualification` → slides: `eq_s1` ... questions: `eq_q1`, `eq_tf1`
- وحدة `method-validation` → slides: `mv_s1` ... questions: `mv_q1`, `mv_tf1`
- وحدة `hold-time-stability` → slides: `ht_s1` ... questions: `ht_q1`, `ht_tf1`

---

## 4. الوحدات الموجودة حالياً في content_new.js

| معرف الوحدة | الحالة | ملاحظات |
|-------------|--------|---------|
| `cleaning-validation` | ⚠️ ناقصة | 6 شرائح فقط — تحتاج 4+ شرائح إضافية وأسئلة أكثر |
| `nmpb-reg` | ✅ مكتملة | 10 شرائح |
| `gmp-intro` | ✅ مكتملة | 14 شريحة + 21 سؤال |
| `glp-basics` | ✅ مكتملة | 9 شرائح |
| `iso-17025` | ✅ مكتملة | 13 شريحة |
| `ich-guidelines` | ✅ مكتملة | 9 شرائح |
| `ich-q10` | ✅ مكتملة | |
| `validation-qualification` | ✅ مكتملة | |
| `data-integrity` | ✅ مكتملة | |
| `qrm-basics` | ✅ مكتملة | |
| `gdp-basics` | ✅ مكتملة | |
| `sterile-annex1` | ✅ مكتملة | |
| `gamp5-basics` | ✅ مكتملة | |
| `batch-records` | ✅ مكتملة | |
| `adv-gmp` | ✅ مكتملة | |
| `adv-glp` | ✅ مكتملة | |
| `adv-iso-17025` | ✅ مكتملة | |
| `adv-validation` | ✅ مكتملة | |
| `adv-qrm` | ✅ مكتملة | |
| `adv-gdp` | ✅ مكتملة | |
| `process-validation` | ❌ **مفقودة** | يجب إنشاؤها |
| `hold-time-stability` | ❌ **مفقودة** | يجب إنشاؤها |
| `method-validation` | ❌ **مفقودة** | يجب إنشاؤها |
| `equipment-qualification` | ❌ **مفقودة** | يجب إنشاؤها |

---

## 5. تسلسل التنفيذ المقترح (حسب الأولوية والحجم)

### 🟢 المرحلة 1 — جلسة واحدة (الأقل تكلفة)

#### [1-A] إكمال وحدة `cleaning-validation` (الموجودة جزئياً)
**الهدف:** الرفع من 6 شرائح إلى 10+ شرائح، ورفع بنك الأسئلة إلى 15+ سؤال.

**الشرائح المطلوب إضافتها** (أضفها داخل `slides: [...]` للوحدة بعد الشريحة `cv_discussion`):
```js
{ id: 'cv_s6', type: 'learning', regulatoryRef: { code: 'EMA Guideline on Cleaning Validation', body: 'EMA' },
  ar: { title: 'التحقق من التنظيف للأدوية عالية الخطورة (Highly Active / Toxic)', text: 'تتطلب الأدوية Highly Active (مثل الهرمونات والسرطانية) حدوداً أشد صرامة. معيار PDE/ADE هو الأساس التنظيمي وفق EMA 2014 Guideline. لا يقبل معيار الـ 10 ppm لهذه الفئة كحد أقصى.' },
  en: { title: 'Cleaning Validation for Highly Active/Toxic Products', text: 'Highly active drugs (hormones, oncologics) require far stricter limits. The PDE/ADE criterion is the regulatory basis per EMA 2014 Guideline. The 10 ppm limit is NOT acceptable for this category.' } },

{ id: 'cv_s7', type: 'learning', regulatoryRef: { code: 'EU GMP Annex 15 §10.6', body: 'EU GMP' },
  ar: { title: 'طرق تحليل التحقق (Analytical Methods in CV)', text: 'الطرق المستخدمة:\n1. TOC (Total Organic Carbon) — للبقيا العضوية — حساسة وغير محددة (non-specific).\n2. HPLC — للبقيا المحددة للدواء — حساسة ومحددة.\n3. الفحص البصري — شرط أساسي لكنه غير كافٍ.\nيجب التحقق من صحة طريقة التحليل المستخدمة (Method Validation).' },
  en: { title: 'Analytical Methods in Cleaning Validation', text: 'Methods used:\n1. TOC (Total Organic Carbon) — for organic residues — sensitive but non-specific.\n2. HPLC — drug-specific residue — sensitive and specific.\n3. Visual inspection — prerequisite but insufficient.\nThe analytical method itself must be validated (Method Validation).' } },

{ id: 'cv_s8', type: 'learning', regulatoryRef: { code: 'PIC/S Annex 15 §10.8', body: 'PIC/S' },
  ar: { title: 'أنواع أخذ العينات (Swab vs Rinse)', text: 'Swab Sampling: يُفضَّل للأسطح غير الملساء وصعبة الوصول. الاسترداد (Recovery) يجب أن يُثبَّت.\nRinse Sampling: للسطح الكامل — لكنه قد يُمرر بقايا للمرحلة التالية.\nالجمع بين الطريقتين هو الممارسة المثلى.' },
  en: { title: 'Sampling Types: Swab vs Rinse', text: 'Swab Sampling: Preferred for uneven surfaces/hard-to-reach areas. Recovery % must be established.\nRinse Sampling: Covers full surface area — but may carry residue forward.\nCombining both is best practice.' } },

{ id: 'cv_s9', type: 'learning', regulatoryRef: { code: 'FDA Guidance on Cleaning Validation 2024', body: 'FDA' },
  ar: { title: 'التوثيق الكامل لخطة التحقق من التنظيف', text: 'يجب أن تشمل Cleaning Validation Protocol:\n- نطاق الدراسة (Equipment List)\n- معادلات وحدود الـ MACO\n- خطة أخذ العينات\n- معايير القبول والرفض\n- المنتجات الأسوأ حالاً المختارة (Worst-case justification)\n- طرق التحليل الموثقة' },
  en: { title: 'Complete Cleaning Validation Protocol Documentation', text: 'A CV Protocol must include:\n- Study scope (Equipment List)\n- MACO calculations and limits\n- Sampling plan\n- Acceptance/rejection criteria\n- Worst-case product selection justification\n- Validated analytical methods' } },

{ id: 'cv_s10', type: 'casestudy', regulatoryRef: { code: 'FDA Warning Letter 2023', body: 'FDA' },
  ar: { title: 'دراسة حالة: فشل التحقق في مصنع مشترك', text: 'في 2023، رصد مفتش FDA في مصنع يُنتج مضادات حيوية وهرمونات في نفس الخط المشترك بعد "تنظيف" غير محقق. النتيجة: بقايا هرمون في دفعة مضاد حيوي أدت لضرر مرضى.\n\nالسبب الجذري: غياب Cleaning Validation لمصفوفة المنتجات المشتركة.\n\nالإجراء التصحيحي: فصل خطوط الإنتاج + Cleaning Validation كامل + CAPA موثق.' },
  en: { title: 'Case Study: Cleaning Validation Failure in a Shared Facility', text: 'In 2023, FDA inspector found a facility producing antibiotics and hormones on the same line without validated cleaning. Result: Hormone residues detected in an antibiotic batch, causing patient harm.\n\nRoot Cause: No Cleaning Validation for shared product matrix.\n\nCorrective Action: Line segregation + full Cleaning Validation + documented CAPA.' } }
```

**الأسئلة المطلوب إضافتها** (أضفها في `questions: {...}` مع الأسئلة الأخرى):
```js
'cleaning_val_q1': { type: 'mcq', questionText: { ar: 'ما هو الاختصار الكامل لـ MACO؟', en: 'What does MACO stand for?' }, options: { ar: ['أقصى انتقال مسموح', 'الحد الأدنى للتنظيف', 'متوسط التلوث الكيميائي', 'مستوى القبول الأدنى'], en: ['Maximum Allowable Carryover', 'Minimum Allowed Cleaning Output', 'Mean Analytic Control Option', 'Maximum Analytic Carry Order'] }, correctAnswer: 0 },
'cleaning_val_q2': { type: 'mcq', questionText: { ar: 'أي من الطرق التالية أكثر تحديداً لبقايا الدواء (Drug-specific)?', en: 'Which method is most drug-specific for residue detection?' }, options: { ar: ['TOC', 'HPLC', 'الفحص البصري', 'قياس الـ pH'], en: ['TOC', 'HPLC', 'Visual Inspection', 'pH measurement'] }, correctAnswer: 1 },
'cleaning_val_q3': { type: 'mcq', questionText: { ar: 'ما هو الفرق بين DHT و CHT؟', en: 'What is the difference between DHT and CHT?' }, options: { ar: ['DHT = وقت الإنتاج ، CHT = وقت التعقيم', 'DHT = وقت بقاء المعدات متسخة ، CHT = وقت بقاءها نظيفة', 'كلاهما نفس الشيء', 'DHT للغسيل اليدوي فقط'], en: ['DHT = production time, CHT = sterilization time', 'DHT = dirty hold time, CHT = clean hold time', 'They are the same', 'DHT is only for manual washing'] }, correctAnswer: 1 },
'cleaning_val_q4': { type: 'mcq', questionText: { ar: 'لماذا لا يُقبل معيار 10 ppm لأدوية الأورام (Oncologics)?', en: 'Why is the 10 ppm limit unacceptable for oncologic drugs?' }, options: { ar: ['لأنها غالية الثمن', 'لأنها شديدة السمية وتستلزم حدود PDE أصغر بكثير', 'لأن الـ HPLC لا تقيسها', 'لا يوجد قيد خاص بها'], en: ['Because they are expensive', 'Because they are highly toxic and require far lower PDE-based limits', 'Because HPLC cannot detect them', 'There is no special restriction'] }, correctAnswer: 1 },
'cleaning_val_q5': { type: 'mcq', questionText: { ar: 'ما هو الهدف الرئيسي من Cleaning Validation؟', en: 'What is the primary objective of Cleaning Validation?' }, options: { ar: ['توفير المياه', 'إثبات قدرة عملية التنظيف على إزالة البقيا', 'تسريع عملية الإنتاج', 'تقليل تكاليف المنظفات'], en: ['Save water', 'Prove the cleaning process removes residues adequately', 'Speed up production', 'Reduce detergent costs'] }, correctAnswer: 1 },
'cleaning_val_q6': { type: 'mcq', questionText: { ar: 'ما معنى "Worst-case Product" في التحقق من التنظيف؟', en: 'What does "Worst-case Product" mean in Cleaning Validation?' }, options: { ar: ['الدواء الأغلى في الإنتاج', 'الدواء الذي يُنتج بأكبر كمية', 'الدواء الأصعب تنظيفاً بناءً على الذائبية والسمية', 'الدواء الأقدم تاريخ انتهاء صلاحية'], en: ['The most expensive drug', 'The drug produced in largest quantity', 'The hardest to clean based on solubility and toxicity', 'The drug with oldest expiry date'] }, correctAnswer: 2 },
'cleaning_val_q7': { type: 'mcq', questionText: { ar: 'أي طريقة أخذ عينات تغطي المساحة الكاملة للسطح؟', en: 'Which sampling method covers the full equipment surface area?' }, options: { ar: ['Swab', 'Rinse', 'Visual', 'TOC فقط'], en: ['Swab', 'Rinse', 'Visual', 'TOC only'] }, correctAnswer: 1 },
'cleaning_val_q8': { type: 'mcq', questionText: { ar: 'وفق EMA 2014، ما هو المعيار المعتمد لحساب حدود بقايا المنتجات عالية الخطورة؟', en: 'Per EMA 2014, which criterion is used to set limits for highly active products?' }, options: { ar: ['10 ppm', 'PDE/ADE', 'MACO فقط', '0.1% من الجرعة'], en: ['10 ppm', 'PDE/ADE', 'MACO only', '0.1% of dose'] }, correctAnswer: 1 },
'cleaning_val_q9': { type: 'tf', questionText: { ar: 'الفحص البصري للمعدات وحده كافٍ كدليل على نظافتها في التحقق الرسمي.', en: 'Visual inspection alone is sufficient as evidence of cleanliness in formal Cleaning Validation.' }, correctAnswer: false },
'cleaning_val_q10': { type: 'tf', questionText: { ar: 'يجب أن تخضع طرق التحليل المستخدمة في Cleaning Validation هي نفسها للتحقق (Method Validation).', en: 'Analytical methods used in Cleaning Validation must themselves be validated.' }, correctAnswer: true },
'cleaning_val_q11': { type: 'tf', questionText: { ar: 'تُطبَّق حدود DHT و CHT فقط على معدات الإنتاج الكبيرة وليس على الخراطيم والفلاتر.', en: 'DHT and CHT limits apply only to large production vessels, not hoses and filters.' }, correctAnswer: false },
'cleaning_val_q12': { type: 'mcq', questionText: { ar: 'ما هو Dead Leg في سياق التحقق من التنظيف؟', en: 'What is a Dead Leg in the context of Cleaning Validation?' }, options: { ar: ['أنبوب مسدود لا تصله السوائل بشكل صحيح', 'عامل تنظيف منتهي الصلاحية', 'خطأ في البرنامج الزمني للتنظيف', 'منطقة يغسلها الماء أكثر من اللازم'], en: ['A blind pipe segment where fluid circulation is inadequate', 'An expired cleaning agent', 'An error in the cleaning schedule', 'An area over-exposed to rinse water'] }, correctAnswer: 0 },
'cleaning_val_q13': { type: 'mcq', questionText: { ar: 'ما هو الحد الأساسي الأول المعتمد تقليدياً في حسابات MACO؟', en: 'What is the first traditionally accepted criterion in MACO calculations?' }, options: { ar: ['PDE/ADE', 'LD50 للحيوانات', '1/1000 من الحد الأدنى للجرعة العلاجية اليومية', '10% من الإنتاج'], en: ['PDE/ADE', 'Animal LD50', '1/1000th of minimum daily therapeutic dose', '10% of batch size'] }, correctAnswer: 2 },
'cleaning_val_q14': { type: 'tf', questionText: { ar: 'يجب أن تكون خطة أخذ العينات (Sampling Plan) محددة في بروتوكول التحقق قبل بدء الدراسة.', en: 'The sampling plan must be defined in the validation protocol before starting the study.' }, correctAnswer: true },
'cleaning_val_q15': { type: 'mcq', questionText: { ar: 'في Swab sampling، ما الذي يجب إثباته قبل اعتماد نتائج المسحة؟', en: 'In Swab sampling, what must be established before accepting swab results?' }, options: { ar: ['لون المسحة', 'وزن المسحة', 'نسبة الاسترداد (Recovery %)', 'درجة حرارة تخزين المسحة'], en: ['Swab color', 'Swab weight', 'Recovery percentage', 'Swab storage temperature'] }, correctAnswer: 2 }
```

---

#### [1-B] إنشاء وحدة `equipment-qualification` (جديدة)

**موقع الإضافة في content_new.js:** أضف بعد وحدة `cleaning-validation` (مباشرة) داخل `units: { ... }`.

```js
'equipment-qualification': {
  title: { ar: 'تأهيل الأجهزة والمرافق', en: 'Equipment Qualification' },
  slides: [
    { id: 'eq_s1', type: 'learning', regulatoryRef: { code: 'EU GMP Annex 15 §6', body: 'EU GMP' },
      ar: { title: 'مفهوم التأهيل وأنواعه', text: 'التأهيل (Qualification) هو عملية التحقق الموثق من أن المعدات/المرافق مثبتة بصورة صحيحة، وتعمل وفق المواصفات، وتؤدي وظيفتها بثبات. المراحل الأربع: DQ → IQ → OQ → PQ.' },
      en: { title: 'Concept and Types of Qualification', text: 'Qualification is the documented verification that equipment/utilities are correctly installed, operating to specifications, and consistently performing their function. The four stages: DQ → IQ → OQ → PQ.' } },

    { id: 'eq_s2', type: 'learning', regulatoryRef: { code: 'ISPE Baseline Guide Vol. 5', body: 'ISPE' },
      ar: { title: 'مواصفات متطلبات المستخدم (URS)', text: 'قبل أي مرحلة أخرى، يجب إعداد URS (User Requirement Specification):\n- ماذا يجب أن يفعل الجهاز؟\n- ما هي حدود الأداء؟\n- ما متطلبات السلامة والمطابقة؟\nURS هو عقد مكتوب بين المستخدم والمورد.' },
      en: { title: 'User Requirement Specification (URS)', text: 'Before any stage, a URS must be prepared:\n- What must the equipment do?\n- What are performance limits?\n- What are safety and compliance requirements?\nThe URS is a written contract between user and vendor.' } },

    { id: 'eq_s3', type: 'learning', regulatoryRef: { code: 'EU GMP Annex 15 §6.2', body: 'EU GMP' },
      ar: { title: 'تأهيل التصميم (DQ — Design Qualification)', text: 'DQ يثبت أن التصميم المقترح للجهاز أو المرفق يلبي متطلبات الـ URS وإرشادات GMP.\n\nيُراجَع فيه:\n- مخططات الجهاز (P&IDs)\n- المواد المستخدمة (متوافقة مع المنتج؟)\n- أنظمة التحكم المقترحة\n\nيُجرى: قبل الشراء أو التصنيع.' },
      en: { title: 'Design Qualification (DQ)', text: 'DQ proves that the proposed design of the equipment/facility meets URS requirements and GMP guidelines.\n\nReviewed items:\n- Equipment drawings (P&IDs)\n- Materials of construction (product compatible?)\n- Proposed control systems\n\nPerformed: Before purchase or manufacturing.' } },

    { id: 'eq_s4', type: 'learning', regulatoryRef: { code: 'GAMP 5 2nd Ed.', body: 'ISPE' },
      ar: { title: 'FAT و SAT (اختبارات القبول في المصنع والموقع)', text: 'FAT (Factory Acceptance Test): يُجرى في مصنع المورد قبل الشحن للتحقق من المواصفات.\n\nSAT (Site Acceptance Test): يُجرى بعد التركيب في الموقع للتحقق من سلامة الشحن والتركيب.\n\nتوفير FAT/SAT ناجحَين يُقلل من جهد IQ/OQ لاحقاً.' },
      en: { title: 'FAT and SAT (Factory and Site Acceptance Tests)', text: 'FAT (Factory Acceptance Test): Performed at vendor site before shipment to verify specifications.\n\nSAT (Site Acceptance Test): Performed after installation on-site to verify shipping and installation integrity.\n\nSuccessful FAT/SAT reduces subsequent IQ/OQ effort.' } },

    { id: 'eq_s5', type: 'learning', regulatoryRef: { code: 'EU GMP Annex 15 §6.4', body: 'EU GMP' },
      ar: { title: 'تأهيل التركيب (IQ — Installation Qualification)', text: 'IQ يثبت أن الجهاز ركِّب وفق مواصفات الشركة المصنعة و GMP.\n\nما يتضمنه IQ:\n✔ رقم الموديل، Serial Number، مكونات الجهاز\n✔ مراجعة الرسومات والمخططات\n✔ قائمة الأدوات والمواد المثبتة\n✔ توثيق التوصيلات الكهربائية، الغازات، المياه\n✔ قائمة جميع الـ SOPs المرتبطة' },
      en: { title: 'Installation Qualification (IQ)', text: 'IQ proves the equipment was installed according to manufacturer specs and GMP requirements.\n\nIQ includes:\n✔ Model number, Serial Number, components list\n✔ Drawing and schematic review\n✔ List of installed materials/utilities\n✔ Documentation of electrical, gas, water connections\n✔ List of all related SOPs' } },

    { id: 'eq_s6', type: 'learning', regulatoryRef: { code: 'EU GMP Annex 15 §6.5', body: 'EU GMP' },
      ar: { title: 'تأهيل التشغيل (OQ — Operational Qualification)', text: 'OQ يثبت أن الجهاز يعمل في حدود التشغيل المحددة في جميع ظروف التشغيل.\n\nاختبارات OQ الشائعة:\n✔ اختبار Worst-case (أقصى وأدنى حدود)\n✔ اختبار دقة الميزان / درجة الحرارة / الضغط\n✔ اختبار أنظمة الإنذار (Alarms)\n✔ اختبار أداء المعدة بدون منتج (Empty runs)' },
      en: { title: 'Operational Qualification (OQ)', text: 'OQ proves the equipment operates within specified operating limits across all operating conditions.\n\nCommon OQ tests:\n✔ Worst-case testing (upper and lower limits)\n✔ Accuracy testing: balance/temperature/pressure\n✔ Alarm systems testing\n✔ Empty equipment performance runs' } },

    { id: 'eq_s7', type: 'learning', regulatoryRef: { code: 'EU GMP Annex 15 §6.6', body: 'EU GMP' },
      ar: { title: 'تأهيل الأداء (PQ — Performance Qualification)', text: 'PQ يثبت أن الجهاز يؤدي أداءً ثابتاً في ظروف التشغيل الحقيقية ومع المنتج الفعلي.\n\nمميزاته:\n✔ يستخدم مواد/منتجات حقيقية\n✔ يُجرى بحضور Worst-case\n✔ يُشكّل أساس التحقق من العملية (Process Validation)\n\nملاحظة: لا يمكن البدء بـ PQ قبل إكمال IQ + OQ بنجاح.' },
      en: { title: 'Performance Qualification (PQ)', text: 'PQ proves consistent equipment performance under actual operating conditions with real product.\n\nCharacteristics:\n✔ Uses real materials/products\n✔ Performed under worst-case conditions\n✔ Forms the basis for Process Validation\n\nNote: PQ cannot begin before successful IQ + OQ.' } },

    { id: 'eq_s8', type: 'learning', regulatoryRef: { code: 'ISO 10012', body: 'ISO' },
      ar: { title: 'المعايرة (Calibration) ودورها في التأهيل', text: 'المعايرة هي مقارنة قياسات الجهاز بمرجع موثوق (Reference Standard).\n\nبرنامج المعايرة يشمل:\n- تحديد أجهزة القياس الحرجة (الحرارة، الضغط، الوزن)\n- تحديد دورية المعايرة\n- الارتباط المتسلسل بمعايير SI الدولية (Metrological Traceability)\n\nلا تأهيل صحيح بدون معايرة موثقة.' },
      en: { title: 'Calibration and Its Role in Qualification', text: 'Calibration compares instrument measurements to a trusted reference standard.\n\nCalibration program includes:\n- Identifying critical measurement instruments (temperature, pressure, weight)\n- Defining calibration intervals\n- Metrological traceability to SI standards\n\nNo valid qualification without documented calibration.' } },

    { id: 'eq_s9', type: 'learning', regulatoryRef: { code: 'FDA 21 CFR 211.68', body: 'FDA' },
      ar: { title: 'دورة التأهيل — الإعادة الدورية (Re-qualification)', text: 'التأهيل ليس حدثاً لمرة واحدة. يجب إعادته دورياً أو عند:\n1. أي تعديل أو إصلاح للجهاز (Change Control)\n2. نقل الجهاز لموقع آخر\n3. نتيجة تفتيش أو انحراف\n4. انقضاء مدة التأهيل المحددة في الـ SOP\n\nكل تغيير = مراجعة الأثر الاحتمالي (Impact Assessment).' },
      en: { title: 'Qualification Lifecycle — Periodic Re-qualification', text: 'Qualification is not a one-time event. It must be repeated periodically or when:\n1. Any equipment modification or repair (Change Control)\n2. Equipment relocation\n3. Triggered by inspection or deviation\n4. Expiry of the qualification period defined in SOP\n\nEvery change = potential Impact Assessment.' } },

    { id: 'eq_s10', type: 'casestudy', regulatoryRef: { code: 'FDA 483 Observation 2022', body: 'FDA' },
      ar: { title: 'دراسة حالة: ملاحظة FDA 483 — غياب OQ لمجفف التجميد', text: 'في تفتيش 2022، وجد مفتش FDA مجفف تجميد (Lyophilizer) يستخدم في الإنتاج الفعلي دون إكمال OQ.\n\nالسبب: اعتقد الفريق أن FAT الناجحة تُغني عن OQ الموقع.\n\nالنتيجة: ملاحظة 483 رسمية، تجميد الإنتاج، إعادة التأهيل الكامل، خسارة 3 دفعات.\n\nالدرس: FAT لا تُغني عن IQ/OQ/PQ في الموقع.' },
      en: { title: 'Case Study: FDA 483 — Missing OQ for Lyophilizer', text: 'In a 2022 inspection, FDA found a lyophilizer in active production use without completed OQ.\n\nReason: Team believed successful FAT eliminated the need for site OQ.\n\nOutcome: Formal 483 observation, production freeze, full re-qualification, 3 batch losses.\n\nLesson: FAT does not replace IQ/OQ/PQ at site.' } },

    { id: 'eq_discussion', type: 'discussion',
      ar: { title: 'نقاش: متى نُقرر إعادة التأهيل الكامل؟', text: 'جهاز HPLC أُصلح بتغيير مضخة الضخ (Pump). هل يستلزم ذلك إعادة IQ+OQ+PQ كاملة؟ أم يكفي Impact Assessment + اختبار OQ جزئي للمضخة فقط؟ ناقش معايير القرار.' },
      en: { title: 'Discussion: When to Perform Full Re-qualification?', text: 'An HPLC instrument had its pump replaced. Does this require a full IQ+OQ+PQ? Or is an Impact Assessment + partial OQ for the pump sufficient? Discuss the decision criteria.' } }
  ],
  examQuestionPool: ['eq_q1','eq_q2','eq_q3','eq_q4','eq_q5','eq_q6','eq_q7','eq_q8','eq_q9','eq_q10','eq_q11','eq_q12','eq_tf1','eq_tf2','eq_tf3','eq_tf4','eq_fill1']
}
```

**أسئلة equipment-qualification** (أضفها في `questions: {...}`):
```js
'eq_q1': { type: 'mcq', questionText: { ar: 'ما الترتيب الصحيح لمراحل التأهيل؟', en: 'What is the correct sequence of qualification stages?' }, options: { ar: ['IQ→OQ→DQ→PQ', 'DQ→IQ→OQ→PQ', 'OQ→IQ→DQ→PQ', 'PQ→OQ→IQ→DQ'], en: ['IQ→OQ→DQ→PQ', 'DQ→IQ→OQ→PQ', 'OQ→IQ→DQ→PQ', 'PQ→OQ→IQ→DQ'] }, correctAnswer: 1 },
'eq_q2': { type: 'mcq', questionText: { ar: 'ما الهدف من URS في التأهيل؟', en: 'What is the purpose of URS in qualification?' }, options: { ar: ['إعداد ميزانية الجهاز', 'تحديد ماذا يجب أن يفعل الجهاز وفق متطلبات المستخدم', 'تدريب الموظفين', 'اختبار البرمجيات فقط'], en: ['Prepare equipment budget', 'Define what the equipment must do per user needs', 'Train personnel', 'Test software only'] }, correctAnswer: 1 },
'eq_q3': { type: 'mcq', questionText: { ar: 'في أي مرحلة يُستخدَم المنتج الفعلي لأول مرة؟', en: 'At which stage is the actual product first used?' }, options: { ar: ['DQ', 'IQ', 'OQ', 'PQ'], en: ['DQ', 'IQ', 'OQ', 'PQ'] }, correctAnswer: 3 },
'eq_q4': { type: 'mcq', questionText: { ar: 'ما الفرق الرئيسي بين FAT و SAT؟', en: 'What is the key difference between FAT and SAT?' }, options: { ar: ['FAT يُجرى في الموقع والـ SAT في المصنع', 'FAT يُجرى في مصنع المورد والـ SAT بعد التركيب في الموقع', 'كلاهما نفس الاختبار لكن في أوقات مختلفة', 'SAT اختياري دائماً'], en: ['FAT at site, SAT at factory', 'FAT at vendor factory, SAT after installation at site', 'Same test at different times', 'SAT is always optional'] }, correctAnswer: 1 },
'eq_q5': { type: 'mcq', questionText: { ar: 'ما الذي يثبته IQ تحديداً؟', en: 'What specifically does IQ verify?' }, options: { ar: ['أن الجهاز يعمل بشكل صحيح', 'أن الجهاز تم تركيبه وفق المواصفات', 'أن الجهاز ينتج منتجاً مطابقاً', 'أن التصميم ملائم للـ GMP'], en: ['That the equipment operates correctly', 'That the equipment was installed per specifications', 'That the equipment produces a compliant product', 'That the design is GMP-suitable'] }, correctAnswer: 1 },
'eq_q6': { type: 'mcq', questionText: { ar: 'متى يجب مراجعة التأهيل مجدداً؟', en: 'When must qualification be reviewed/repeated?' }, options: { ar: ['كل 10 سنوات فقط', 'عند أي تعديل أو إصلاح جوهري (Change Control)', 'فقط عند طلب المفتش', 'لا يُعاد أبداً إذا نجح أول مرة'], en: ['Every 10 years only', 'Upon any significant modification or repair (Change Control)', 'Only when inspector requests', 'Never if initially successful'] }, correctAnswer: 1 },
'eq_q7': { type: 'mcq', questionText: { ar: 'ما الهدف من OQ؟', en: 'What is the objective of OQ?' }, options: { ar: ['التحقق من التركيب', 'التحقق من الأداء مع المنتج الفعلي', 'التحقق من عمل الجهاز في حدود التشغيل المحددة', 'مراجعة التصميم'], en: ['Verify installation', 'Verify performance with actual product', 'Verify the equipment operates within specified operating limits', 'Review design'] }, correctAnswer: 2 },
'eq_q8': { type: 'mcq', questionText: { ar: 'ما الذي يعنيه الارتباط المتسلسل (Metrological Traceability) في المعايرة؟', en: 'What does Metrological Traceability mean in calibration?' }, options: { ar: ['استخدام معايرة يدوية فقط', 'ربط القياسات بمعايير SI الدولية عبر سلسلة موثقة غير منقطعة', 'إجراء المعايرة مرة واحدة فقط', 'استخدام أجهزة من نفس المورد'], en: ['Use only manual calibration', 'Linking measurements to SI standards via an unbroken documented chain', 'Calibrate only once', 'Use instruments from same vendor'] }, correctAnswer: 1 },
'eq_q9': { type: 'mcq', questionText: { ar: 'ما هو Impact Assessment في سياق التأهيل؟', en: 'What is an Impact Assessment in the context of qualification?' }, options: { ar: ['دراسة الأثر البيئي', 'مراجعة الأثر المحتمل لتغيير ما على صحة التأهيل القائم', 'تقييم أثر الدواء على المريض', 'تقرير مالي'], en: ['Environmental impact study', 'Review of potential effect of a change on existing qualification validity', 'Assessment of drug effect on patient', 'Financial report'] }, correctAnswer: 1 },
'eq_q10': { type: 'mcq', questionText: { ar: 'أي الوثائق التالية يجب مراجعتها في IQ؟', en: 'Which document must be reviewed during IQ?' }, options: { ar: ['سجلات المبيعات', 'مخططات P&ID والرسومات التقنية', 'قوائم الأسعار', 'نتائج الاختبارات السريرية'], en: ['Sales records', 'P&ID diagrams and technical drawings', 'Price lists', 'Clinical trial results'] }, correctAnswer: 1 },
'eq_q11': { type: 'mcq', questionText: { ar: 'ما هو الفرق الجوهري بين التأهيل والتحقق (Qualification vs Validation)؟', en: 'What is the fundamental difference between Qualification and Validation?' }, options: { ar: ['لا فرق بينهما', 'التأهيل للمعدات والمرافق، والتحقق للعمليات والطرق', 'التأهيل للعمليات، والتحقق للمعدات', 'التحقق أسهل من التأهيل'], en: ['No difference', 'Qualification is for equipment/utilities; Validation is for processes/methods', 'Qualification is for processes; Validation is for equipment', 'Validation is easier than qualification'] }, correctAnswer: 1 },
'eq_q12': { type: 'mcq', questionText: { ar: 'ما هو السبب الرئيسي لإجراء اختبار Worst-case في OQ؟', en: 'What is the main reason for Worst-case testing in OQ?' }, options: { ar: ['لاختبار تحمل الجهاز للكسر', 'لإثبات أن الجهاز يعمل بشكل صحيح في أصعب الظروف', 'لتوفير الوقت', 'لتقليل عدد الاختبارات'], en: ['To test equipment breakage resistance', 'To prove the equipment works correctly under the most challenging conditions', 'To save time', 'To reduce number of tests'] }, correctAnswer: 1 },
'eq_tf1': { type: 'tf', questionText: { ar: 'نجاح FAT في مصنع المورد يُغني عن IQ و OQ بعد التركيب في الموقع.', en: 'A successful FAT at the vendor factory eliminates the need for IQ and OQ at the installation site.' }, correctAnswer: false },
'eq_tf2': { type: 'tf', questionText: { ar: 'يمكن البدء بـ PQ قبل إكمال OQ بنجاح.', en: 'PQ can begin before OQ is successfully completed.' }, correctAnswer: false },
'eq_tf3': { type: 'tf', questionText: { ar: 'المعايرة الدورية جزء أساسي من برنامج الحفاظ على صلاحية التأهيل.', en: 'Periodic calibration is an essential part of maintaining qualification validity.' }, correctAnswer: true },
'eq_tf4': { type: 'tf', questionText: { ar: 'DQ يُجرى فقط بعد شراء الجهاز وتركيبه.', en: 'DQ is performed only after equipment purchase and installation.' }, correctAnswer: false },
'eq_fill1': { type: 'fill', questionText: { ar: 'المرحلة التي تثبت أن الجهاز يعمل ضمن حدود التشغيل المحددة تُسمى ___', en: 'The stage that proves equipment operates within specified operating limits is called ___' }, correctAnswer: { ar: 'تأهيل التشغيل (OQ)', en: 'Operational Qualification (OQ)' } }
```

---

### 🟡 المرحلة 2 — الجلسة التالية

#### [2-A] إنشاء وحدة `method-validation` (التحقق من طرق التحليل — ICH Q2)

**المحاور الرئيسية للشرائح (10+ شرائح):**
1. مقدمة: ICH Q2(R2) والهدف من Method Validation
2. الدقة (Accuracy) — Recovery %
3. الدقة الإجرائية (Precision) — Repeatability, Intermediate, Reproducibility
4. التحديد (Specificity/Selectivity)
5. الخطية (Linearity) — معادلة الخط + R²
6. حد الكشف (LOD) و حد التحديد الكمي (LOQ)
7. المدى (Range)
8. المتانة (Robustness/Ruggedness)
9. ثبات المحلول (Solution Stability)
10. دراسة حالة: تحقق HPLC لتحديد دواء في المستحضر
11. نقاش: كيف تختار طريقة التحقق المناسبة؟

**Prefix أسئلة:** `mv_q1` إلى `mv_q15`, `mv_tf1` إلى `mv_tf4`, `mv_fill1`

---

### 🔴 المرحلة 3 — جلسات لاحقة (الأثقل)

#### [3-A] إنشاء وحدة `process-validation`
**المحاور:** Stage 1 (Design), Stage 2 (Qualification), Stage 3 (CPV), CQAs, CPPs
**Prefix:** `pv_q1`...

#### [3-B] إنشاء وحدة `hold-time-stability`
**المحاور:** Bulk hold time, Intermediate stability, Microbiological considerations, WHO Zone IVb
**Prefix:** `ht_q1`...

---

### 🎖️ المرحلة 4 — تحسينات UI (بعد اكتمال المحتوى)

**في Dashboard.jsx** إضافة شارات التخصص:
```js
// في دالة handleQuizComplete، بعد الحصول على 90% في الوحدات التالية:
// cleaning-validation → badge 'Cleaning Expert 🧼'
// equipment-qualification → badge 'Qualification Master ⚙️'
// method-validation → badge 'Analytical Expert 🧪'
// process-validation + hold-time-stability → badge 'Validation Expert 🔄'
```

---

## 6. كيفية إضافة محتوى جديد إلى content_new.js (تعليمات للـ AI)

> [!IMPORTANT]
> **لا تستبدل الملف كاملاً** — الملف 237 KB. استخدم أدوات التحرير الجزئية فقط.

**لإضافة وحدة جديدة في units:**
1. ابحث عن: `'cleaning-validation': {` في الملف
2. أضف الوحدة الجديدة بعد نهاية كائن `cleaning-validation` (بعد `},` المقابل)

**لإضافة أسئلة في questions:**
1. ابحث عن آخر سؤال في الملف: `'adv_gmp_tf3': {`
2. أضف الأسئلة الجديدة بعده مباشرة (قبل `}` النهائي لـ `questions`)

**السطور المرجعية في content_new.js (حالياً):**
- السطر 1: `export const educationalContent = {`
- السطر 3: `'cleaning-validation': {` — أول وحدة
- السطر 562: `}` — نهاية `questions`
- السطر 563: `};` — نهاية الكائن الكلي

---

## 7. حالة المشروع الكلية

| المجال | الحالة |
|--------|--------|
| Frontend (Firebase) | ✅ Live |
| Backend (Vercel) | ✅ Live |
| Google Auth | ✅ Working |
| Bilingual AR/EN | ✅ Complete |
| Dashboard UI للوحدات الخمس | ✅ جاهز (TRACKS + UNIT_ICONS موجود) |
| cleaning-validation (محتوى) | ⚠️ ناقص (6/10+ شرائح) |
| equipment-qualification (محتوى) | ❌ مفقود |
| method-validation (محتوى) | ❌ مفقود |
| process-validation (محتوى) | ❌ مفقود |
| hold-time-stability (محتوى) | ❌ مفقود |
| شارات التخصص | ❌ مخططة لاحقاً |

---

## 8. ملاحظات تقنية مهمة

- **لا تعدل Dashboard.jsx** — بنية الوحدات الخمس موجودة فيه بالفعل ✅
- **لا تعدل LanguageContext.jsx** — نظام الترجمة مكتمل ✅
- **المهمة الوحيدة المتبقية:** إضافة محتوى إلى `content_new.js` فقط
- **بعد كل إضافة:** شغّل `npm run dev` وتحقق من أن الوحدة تظهر وتعمل
- **القاعدة الذهبية:** كل ID فريد — لا تكرار في slide IDs أو question IDs

---

*📌 للمساعد: ابدأ دائماً بالمرحلة 1-A (إكمال cleaning-validation) ثم 1-B (equipment-qualification). هذا الترتيب يضمن أقل استهلاك ممكن للحصة مع أعلى قيمة.*
