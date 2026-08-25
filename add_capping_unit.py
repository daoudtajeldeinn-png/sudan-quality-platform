import re

# ========== 1. LectureView.jsx ==========
with open('src/components/LectureView.jsx', 'r', encoding='utf-8') as f:
    lv = f.read()

lv = lv.replace(
    "'adv-gdp': '#ea580c'",
    "'adv-gdp': '#ea580c',\n  'capping-lamination': '#7c3aed'"
)
lv = lv.replace(
    "const SPECIAL_COURSE_UNITS = ['capa', 'iso-9001', 'qc-lab', 'ipqc'];",
    "const SPECIAL_COURSE_UNITS = ['capa', 'iso-9001', 'qc-lab', 'ipqc', 'capping-lamination'];"
)
with open('src/components/LectureView.jsx', 'w', encoding='utf-8') as f:
    f.write(lv)
print("✅ LectureView.jsx updated")

# ========== 2. StudentShell.jsx ==========
with open('src/pages/StudentShell.jsx', 'r', encoding='utf-8') as f:
    ss = f.read()

ss = ss.replace(
    "'ipqc':'🏭',",
    "'ipqc':'🏭','capping-lamination':'💊',"
)
ss = ss.replace(
    "'ipqc':'#f59e0b',",
    "'ipqc':'#f59e0b','capping-lamination':'#7c3aed',"
)
ss = ss.replace(
    "'ipqc':'IPQC',",
    "'ipqc':'IPQC','capping-lamination':'Capping & Lamination',"
)
with open('src/pages/StudentShell.jsx', 'w', encoding='utf-8') as f:
    f.write(ss)
print("✅ StudentShell.jsx updated")

# ========== 3. CourseSlides.jsx — إضافة الكورس الجديد ==========
NEW_COURSE = """
  'capping-lamination': {
    title: 'الكابينج واللامينيشن — استكشاف الأخطاء',
    titleEn: 'Capping & Lamination Troubleshooting',
    icon: '💊', color: '#7c3aed', colorLight: '#f5f3ff', colorMid: '#ddd6fe',
    instructor: 'Dr. Daoud Tajeldeinn',
    course: 'Pharmaceutical Manufacturing / GMP',
    units: [
      {
        title: 'التعريف والتمييز',
        number: '01',
        slides: [
          {
            title: 'ما هو الكابينج واللامينيشن؟',
            subtitle: 'Capping & Lamination — Definition',
            sections: [
              { type: 'definition', label: 'الكابينج — Capping', text: 'انفصال الجزء العلوي أو السفلي من القرص (التاج) عن جسم القرص — يحدث عادةً أثناء الطرد أو المناولة اللاحقة' },
              { type: 'definition', label: 'اللامينيشن — Lamination', text: 'انقسام القرص إلى طبقتين أو أكثر متميزتين — قد يحدث أثناء الطرد أو بعد الضغط' },
              { type: 'quote', text: 'نفس عملية الضغط — خللان مختلفان تماماً' }
            ]
          },
          {
            title: 'الفرق الجوهري بينهما',
            subtitle: 'Capping vs Lamination — Key Differences',
            sections: [
              {
                type: 'compare', label: 'الكابينج vs اللامينيشن',
                good: ['الكابينج: انفصال التاج العلوي/السفلي', 'يحدث في منطقة واحدة', 'يُرى غالباً فور الطرد من الماكينة'],
                bad: ['اللامينيشن: انقسام إلى طبقات أفقية متعددة', 'يحدث في عدة مناطق من القرص', 'قد يظهر بعد الضغط بفترة']
              },
              {
                type: 'points', label: 'أهمية التمييز',
                items: [
                  { text: 'كل خلل له أسباب وحلول مختلفة', good: true },
                  { text: 'التشخيص الخاطئ يؤدي لحلول خاطئة', good: false },
                  { text: 'صنّف الخلل أولاً — ثم ابحث عن السبب', good: true },
                ]
              },
              { type: 'quote', text: 'Classify the failure before changing the process' }
            ]
          },
          {
            title: 'تحديد نوع الخلل',
            subtitle: 'Failure Classification',
            sections: [
              {
                type: 'classify', label: 'تصنيف حسب موضع الانفصال',
                items: [
                  { label: 'كابينج', color: '#ef4444', desc: 'انفصال التاج — fracture interface عند الأعلى أو الأسفل' },
                  { label: 'لامينيشن', color: '#f97316', desc: 'طبقات متعددة — fracture interfaces أفقية متوازية' },
                  { label: 'مزدوج', color: '#8b5cf6', desc: 'كابينج ولامينيشن معاً — أسباب متعددة' },
                ]
              },
              {
                type: 'steps', label: 'خطوات التصنيف',
                items: [
                  'افحص القرص بصرياً فور الطرد',
                  'حدد موضع وعدد خطوط الانفصال',
                  'سجّل متى يظهر الخلل — أثناء الطرد أم بعده',
                  'راقب هل يتبع ماكينة معينة أم عشوائي',
                ]
              }
            ]
          }
        ]
      },
      {
        title: 'الأسباب الأربعة',
        number: '02',
        slides: [
          {
            title: 'احتجاز الهواء وضعف إزالته',
            subtitle: '01 | Air Entrapment / Inadequate Deaeration',
            sections: [
              { type: 'definition', label: 'الآلية', text: 'أثناء الضغط يحتجز الهواء بين الجسيمات. عند الطرد يتمدد الهواء المحتجز ويسبب إجهاداً داخلياً يؤدي للانفصال' },
              {
                type: 'points', label: 'عوامل التفتيش — HIGH PRIORITY',
                items: [
                  { text: 'سرعة الضغط — Compression Speed', good: true },
                  { text: 'الضغط المسبق — Pre-compression', good: true },
                  { text: 'سرعة الـ Turret', good: true },
                  { text: 'مسامية الحبيبات — Granule Porosity', good: true },
                  { text: 'خصائص تدفق المسحوق — Powder Flow', good: true },
                ]
              },
              { type: 'quote', text: 'حسّن إزالة الهواء وضبط ملف الضغط قبل رفع قوة الضغط الرئيسية' }
            ]
          },
          {
            title: 'الانتعاش المرن الزائد',
            subtitle: '02 | Excessive Elastic Recovery',
            sections: [
              { type: 'definition', label: 'الآلية', text: 'بعد رفع قوة الضغط يعود القرص لحجمه الأصلي جزئياً. الانتعاش الزائد يولّد إجهاداً داخلياً يتجاوز قدرة الترابط ويسبب الانفصال' },
              {
                type: 'classify', label: 'عوامل التأثير',
                items: [
                  { label: 'المادة', color: '#ef4444', desc: 'سلوك التشوه وخصائص المادة الخام' },
                  { label: 'الماكينة', color: '#f97316', desc: 'Dwell time • سرعة الضغط • Pre-compression' },
                  { label: 'التزليق', color: '#3b82f6', desc: 'مستوى Lubrication ونوع المواد المزلقة' },
                ]
              },
              {
                type: 'compare', label: 'تنبيه مهم',
                good: ['ضبط التركيبة والمعلمات أولاً', 'تحسين الـ Lubrication', 'ضبط Pre-compression'],
                bad: ['رفع قوة الضغط الرئيسية مباشرة', 'تجاهل خصائص المادة', 'تغيير متعدد المعلمات دفعة واحدة']
              }
            ]
          },
          {
            title: 'ضعف ترابط الحبيبات والمسحوق',
            subtitle: '03 | Poor Granule / Powder Bonding',
            sections: [
              { type: 'definition', label: 'الآلية', text: 'ضعف الجسور الصلبة بين الجسيمات عند نقاط التلامس — يؤدي إلى فراغات زائدة وواجهات هشة عرضة للانفصال' },
              {
                type: 'steps', label: 'سلسلة الفحص بالترتيب',
                items: [
                  'PSD — توزيع حجم الجسيمات',
                  'LOD — محتوى الرطوبة (فورمولا ومعالجة محددة)',
                  'Granulation — طريقة وظروف التحبيب',
                  'Lubrication — نوع ومستوى المواد المزلقة',
                  'Compression Behavior — سلوك الضغط الفعلي',
                ]
              },
              { type: 'quote', text: 'لا تعامل قيمة LOD واحدة كسبب عالمي — LOD مرتبط بالفورمولا والعملية' }
            ]
          },
          {
            title: 'ظروف الضغط والأدوات',
            subtitle: '04 | Compression & Tooling Conditions',
            sections: [
              {
                type: 'points', label: 'معلمات الماكينة',
                items: [
                  { text: 'Turret Speed — سرعة الدوران', good: true },
                  { text: 'Pre-compression Force — قوة الضغط المسبق', good: true },
                  { text: 'Main Compression Force — قوة الضغط الرئيسية', good: true },
                  { text: 'Dwell Time — زمن البقاء تحت الضغط', good: true },
                  { text: 'Ejection Conditions — ظروف الطرد', good: true },
                ]
              },
              {
                type: 'classify', label: 'فحص الأدوات — Tooling',
                items: [
                  { label: 'Punch', color: '#ef4444', desc: 'التآكل — الشق — profile والتوافق' },
                  { label: 'Die', color: '#f97316', desc: 'التآكل — التسجيل — النظافة والتراكم' },
                  { label: 'Alignment', color: '#3b82f6', desc: 'محاذاة الـ Punch والـ Die' },
                ]
              },
              { type: 'quote', text: 'لا تعدّل معلمات الماكينة قبل التأكد من حالة الأدوات والمواد' }
            ]
          }
        ]
      },
      {
        title: 'التشخيص والحل',
        number: '03',
        slides: [
          {
            title: 'استخدم الدليل قبل تحديد السبب الجذري',
            subtitle: 'Evidence-Based Root Cause',
            sections: [
              {
                type: 'points', label: 'الملاحظة → الفحص الأول',
                items: [
                  { text: 'الخلل يزداد بزيادة سرعة الـ Turret → Dwell time وDeaeration', good: true },
                  { text: 'الخلل يظهر بعد تغيير التركيبة → Granulation وPSD وLubrication', good: true },
                  { text: 'الخلل يتبع محطة Tooling معينة → حالة Punch/Die والمحاذاة', good: true },
                  { text: 'الخلل أثناء الطرد فقط → Ejection force وLubrication وElastic recovery', good: true },
                  { text: 'الخلل يتغير مع Pre-compression → سلوك إزالة الهواء', good: true },
                ]
              },
              { type: 'quote', text: 'استخدم دليل العملية قبل تحديد السبب الجذري — لا تخمّن' }
            ]
          },
          {
            title: 'من الخلل إلى السبب الجذري',
            subtitle: 'From Defect to Root Cause — 8 Steps',
            sections: [
              {
                type: 'steps', label: 'منهجية التشخيص',
                items: [
                  'تأكيد الخلل — Confirm the defect',
                  'تمييز الكابينج عن اللامينيشن',
                  'تحديد محطات الـ Tooling المتأثرة',
                  'مراجعة معلمات الضغط الحالية',
                  'فحص خصائص الحبيبات والتركيبة',
                  'فحص الأدوات — Punch & Die',
                  'تشغيل تجربة متحكمة — تغيير واحد فقط',
                  'تأكيد الفعالية وإغلاق التحقيق',
                ]
              },
              { type: 'quote', text: 'ONE CHANGE AT A TIME — غيّر متغيراً واحداً فقط في كل تجربة' }
            ]
          },
          {
            title: 'لا تطارد قوة الضغط أولاً',
            subtitle: 'Do Not Chase Compression Force First',
            sections: [
              { type: 'definition', label: 'المبدأ الأساسي', text: 'الكابينج واللامينيشن غالباً مشاكل متعددة الأسباب — زيادة قوة الضغط الرئيسية لا تحل المشكلة تلقائياً بل قد تزيدها سوءاً' },
              {
                type: 'classify', label: 'ثلاثة مناطق تحقيق',
                items: [
                  { label: 'المادة', color: '#10b981', desc: 'Granulation • PSD • LOD • Lubrication • Bonding' },
                  { label: 'الماكينة', color: '#3b82f6', desc: 'Speed • Pre-compression • Main compression • Dwell time' },
                  { label: 'الأدوات', color: '#8b5cf6', desc: 'Punch • Die • Wear • Alignment • Condition' },
                ]
              },
              { type: 'quote', text: 'Find the mechanism. Then change the parameter.' }
            ]
          }
        ]
      }
    ]
  },
"""

with open('src/components/CourseSlides.jsx', 'r', encoding='utf-8') as f:
    cs = f.read()

# أضف الكورس الجديد قبل آخر }; في COURSE_SLIDES
cs = cs.replace(
    "const COURSE_SLIDES = {",
    "const COURSE_SLIDES = {" + NEW_COURSE
)

with open('src/components/CourseSlides.jsx', 'w', encoding='utf-8') as f:
    f.write(cs)
print("✅ CourseSlides.jsx updated")

# ========== 4. Seed Questions ==========
seed = """
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const questions = [
  { unit_id: 'capping-lamination', question_text: 'ما الفرق الرئيسي بين الكابينج واللامينيشن؟', options: JSON.stringify(['الكابينج انفصال طبقات أفقية واللامينيشن انفصال التاج','الكابينج انفصال التاج واللامينيشن انفصال طبقات أفقية','كلاهما نفس الخلل','الكابينج يحدث أثناء التخزين فقط']), correct_answer: 1, explanation: 'الكابينج = انفصال التاج. اللامينيشن = انقسام لطبقات أفقية', difficulty: 'easy' },
  { unit_id: 'capping-lamination', question_text: 'ما أول خطوة عند اكتشاف خلل ضغط الأقراص؟', options: JSON.stringify(['رفع قوة الضغط الرئيسية','تصنيف الخلل — كابينج أم لامينيشن','تغيير التركيبة فوراً','إيقاف الإنتاج وانتظار الصيانة']), correct_answer: 1, explanation: 'يجب تصنيف الخلل أولاً قبل أي إجراء', difficulty: 'easy' },
  { unit_id: 'capping-lamination', question_text: 'ما السبب الأول ذو الأولوية العالية (HIGH PRIORITY) في الكابينج واللامينيشن؟', options: JSON.stringify(['ضعف الترابط','احتجاز الهواء وضعف إزالته','ظروف الأدوات','ضعف قوة الضغط']), correct_answer: 1, explanation: 'Air Entrapment هو أعلى أولوية للفحص', difficulty: 'medium' },
  { unit_id: 'capping-lamination', question_text: 'ما الآلية التي يسبب فيها الانتعاش المرن الزائد مشكلة؟', options: JSON.stringify(['يقلل من صلابة القرص','يولّد إجهاداً داخلياً يتجاوز قدرة الترابط','يزيد من وقت التفكك','يرفع معدل الذوبان']), correct_answer: 1, explanation: 'Elastic recovery الزائد يولّد internal stress يتجاوز bond strength', difficulty: 'medium' },
  { unit_id: 'capping-lamination', question_text: 'ما الترتيب الصحيح لسلسلة فحص ضعف الترابط؟', options: JSON.stringify(['LOD ثم PSD ثم Granulation','PSD ثم LOD ثم Granulation ثم Lubrication','Lubrication ثم Granulation ثم PSD','Granulation مباشرة بدون فحوصات أخرى']), correct_answer: 1, explanation: 'الترتيب: PSD → LOD → Granulation → Lubrication → Compression Behavior', difficulty: 'hard' },
  { unit_id: 'capping-lamination', question_text: 'إذا ظهر الكابينج فقط عند زيادة سرعة الـ Turret، ما أول ما تفحص؟', options: JSON.stringify(['تركيبة المادة الخام','Dwell time وDeaeration وCompression profile','حالة الـ Punch والـ Die','مستوى الـ Lubrication']), correct_answer: 1, explanation: 'زيادة سرعة الـ Turret تقلل Dwell time وتزيد احتجاز الهواء', difficulty: 'hard' },
  { unit_id: 'capping-lamination', question_text: 'ما مبدأ ONE CHANGE AT A TIME في التشخيص؟', options: JSON.stringify(['تغيير جميع المعلمات دفعة واحدة لتوفير الوقت','تغيير متغير واحد فقط في كل تجربة لتحديد السبب بدقة','استبدال الأدوات والتركيبة معاً','إيقاف الإنتاج حتى حل جميع المشكلات']), correct_answer: 1, explanation: 'تغيير متغير واحد يضمن تحديد تأثيره بشكل مستقل', difficulty: 'easy' },
  { unit_id: 'capping-lamination', question_text: 'لماذا لا نرفع قوة الضغط الرئيسية كحل أول للكابينج؟', options: JSON.stringify(['لأن الماكينة لا تتحمل ذلك','لأن الكابينج واللامينيشن غالباً متعددة الأسباب ورفع القوة قد يزيدها','لأن ذلك مكلف جداً','لأن القوة لا تؤثر على الكابينج']), correct_answer: 1, explanation: 'المشكلة متعددة الأسباب — يجب تحديد الآلية أولاً قبل تغيير المعلمات', difficulty: 'medium' },
  { unit_id: 'capping-lamination', question_text: 'ما عدد خطوات منهجية التشخيص من الخلل إلى السبب الجذري؟', options: JSON.stringify(['4 خطوات','6 خطوات','8 خطوات','10 خطوات']), correct_answer: 2, explanation: 'المنهجية تتكون من 8 خطوات من تأكيد الخلل حتى تأكيد الفعالية', difficulty: 'easy' },
  { unit_id: 'capping-lamination', question_text: 'ما الفحص المطلوب عند ظهور الخلل في محطة Tooling محددة فقط؟', options: JSON.stringify(['زيادة الـ Pre-compression','فحص التركيبة والـ LOD','فحص حالة Punch/Die والمحاذاة','تغيير سرعة الـ Turret']), correct_answer: 2, explanation: 'الخلل المحدد بمحطة tooling يشير لمشكلة في Punch أو Die أو alignment', difficulty: 'medium' },
  { unit_id: 'capping-lamination', question_text: 'ما ثلاثة مناطق التحقيق الرئيسية في الكابينج واللامينيشن؟', options: JSON.stringify(['المادة والماكينة والأدوات','المختبر والإنتاج والجودة','التخزين والنقل والتعبئة','التصميم والتطوير والإنتاج']), correct_answer: 0, explanation: 'Material + Machine + Tooling هي المناطق الثلاثة الرئيسية', difficulty: 'easy' },
  { unit_id: 'capping-lamination', question_text: 'متى يُعتبر LOD سبباً في ضعف الترابط؟', options: JSON.stringify(['دائماً عند ارتفاع الرطوبة','عند انخفاض الرطوبة فقط','عندما يتجاوز المدى المحدد للفورمولا والعملية المحددة','LOD ليس له علاقة بالترابط']), correct_answer: 2, explanation: 'LOD مرتبط بالفورمولا والعملية — لا يوجد قيمة عالمية واحدة', difficulty: 'hard' },
  { unit_id: 'capping-lamination', question_text: 'ما خطوة التحقق النهائية في منهجية التشخيص؟', options: JSON.stringify(['إيقاف الإنتاج','تغيير التركيبة','تأكيد الفعالية وإغلاق التحقيق','رفع تقرير للإدارة فقط']), correct_answer: 2, explanation: 'الخطوة 8: Confirm effectiveness — التأكد من اختفاء الخلل واستقرار العملية', difficulty: 'easy' },
  { unit_id: 'capping-lamination', question_text: 'أي من التالي من عوامل التأثير في Excessive Elastic Recovery؟', options: JSON.stringify(['درجة حرارة التخزين','Dwell Time وسرعة الضغط والـ Lubrication','حجم الحبيبات فقط','نوع القالب فقط']), correct_answer: 1, explanation: 'Dwell time وCompression speed وLubrication كلها تؤثر على Elastic Recovery', difficulty: 'medium' },
  { unit_id: 'capping-lamination', question_text: 'ما المقصود بـ Fracture Interface في سياق الكابينج؟', options: JSON.stringify(['منطقة الضغط الرئيسية','خط الانفصال بين التاج وجسم القرص','سطح Die','منطقة Pre-compression']), correct_answer: 1, explanation: 'Fracture Interface هي خط الكسر حيث ينفصل التاج عن جسم القرص في الكابينج', difficulty: 'medium' },
];

async function seed() {
  const { error } = await supabase.from('questions').insert(questions);
  if (error) { console.error('❌ Error:', error.message); process.exit(1); }
  console.log('✅ 15 questions seeded for capping-lamination');
  process.exit(0);
}

seed();
"""

with open('src/data/seed_capping_questions.cjs', 'w', encoding='utf-8') as f:
    f.write(seed)
print("✅ seed_capping_questions.cjs created")
print()
print("🎉 All done! Now run:")
print("   node src/data/seed_capping_questions.cjs")

