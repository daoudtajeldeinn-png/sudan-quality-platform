// Node script to insert sample questions into Supabase
// Usage:
//   SUPABASE_URL=https://... SUPABASE_ANON_KEY=anon... node scripts/seed-method-validation.js

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in the environment.');
  process.exit(1);
}

const supabase = createClient(url, key);

const rows = [
  {
    unitId: 'method-validation',
    question: 'ما هو هدف التحقق من الطريقة التحليلية (Method Validation)؟',
    options: ['التأكد من أن الطريقة مناسبة للغرض المطلوب','زيادة سرعة التحليل','تقليل تكاليف المختبر','استبدال الكواشف'],
    correctAnswer: '0',
    type: 'mcq',
    explanation: 'التحقق يثبت أن الطريقة المناسبة تنتج نتائج صحيحة ودقيقة ومتكررة للغرض المقصود.'
  },
  {
    unitId: 'method-validation',
    question: 'أي من العناصر التالية يُعد جزءًا من عملية التحقق من الطريقة؟',
    options: ['دقة (Accuracy)','لون العينة','اسم المشغل','نوع القمقم'],
    correctAnswer: '0',
    type: 'mcq',
    explanation: 'عناصر التحقق الشائعة: الدقة، الدقة الداخلية (precision)، مدى القياس، الحساسية، محددية.'
  },
  {
    unitId: 'method-validation',
    question: 'ما المقصود بمصطلح LOD (Limit of Detection)؟',
    options: ['أدنى حد يمكن الكشف عنه','أعلى تركيز يمكن قياسه','زمن التحليل','نوع العينة'],
    correctAnswer: '0',
    type: 'mcq',
    explanation: 'LOD هو أدنى تركيز للمادة يمكن تمييزه عن الضجيج.'
  },
  {
    unitId: 'method-validation',
    question: 'عند اختبار الدقة (accuracy) باستخدام معيار مرجعي، ما الذي تبحث عنه؟',
    options: ['قرب القيمة المقاسة من القيمة الحقيقية','سرعة الاختبار','تكلفة الاختبار','سهولة التنفيذ'],
    correctAnswer: '0',
    type: 'mcq',
    explanation: 'الدقة تقيس مدى اقتراب نتائج التحليل من القيمة الحقيقية للمادة المرجعية.'
  },
  {
    unitId: 'method-validation',
    question: 'اختر العبارة الصحيحة عن "الشروط الخطية" (Linearity) في التحقق:',
    options: ['علاقة خطية بين الإشارة وتركيز المحلول ضمن نطاق معين','العينة يجب أن تكون شفافة','يجب استخدام عمود مختلف','تتعلق بالحرارة فقط'],
    correctAnswer: '0',
    type: 'mcq',
    explanation: 'الخطية تقيم ما إذا كانت الإشارة الناتجة تتناسب خطياً مع التركيز عبر نطاق القياس.'
  },
  {
    unitId: 'method-validation',
    question: 'ما نوع الدليل الذي قد تستخدمه لإثبات تكرارية (repeatability) الطريقة؟',
    options: ['عدة تحليلات متكررة على نفس العينة ونفس الشروط','تقديرات إدارية','تغيير المشغل','تغيير المركب'],
    correctAnswer: '0',
    type: 'mcq',
    explanation: 'التكرارية تُقاس بتكرار التحليل لنفس العينة تحت نفس الشروط ومقارنة التباين.'
  }
];

async function seed() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert(rows);

    if (error) {
      console.error('Insert error:', error);
      process.exit(1);
    }
    console.log('Inserted rows:', data.length || data);
    process.exit(0);
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

seed();
