
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

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
