const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'content.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add GDP unit after qrm-basics in units section
const gdpUnit = `,
    'gdp-basics': {
      title: { ar: 'ممارسات التوزيع الجيد', en: 'GDP Basics' },
      description: { ar: 'مبادئ GDP لضمان جودة سلسلة التوريد الدوائية', en: 'GDP principles for pharmaceutical supply chain quality' },
      learningObjectives: [
        { ar: 'فهم مبادئ GDP الاساسية', en: 'Understand basic GDP principles' },
        { ar: 'ادارة سلسلة التبريد والتخزين', en: 'Manage cold chain and storage' },
        { ar: 'ضمان سلامة المنتجات اثناء التوزيع', en: 'Ensure product safety during distribution' }
      ],
      slides: [
        { id: 'gdp_s1', type: 'learning', ar: { title: 'مقدمة في ممارسات التوزيع الجيد', text: 'GDP = Good Distribution Practice\n\nالتعريف: نظام يضمن جودة المنتجات الدوائية طوال سلسلة التوريد\n\nاهمية GDP:\n- حماية المريض\n- ضمان فعالية الادوية\n- منع التزوير\n- الامتثال التنظيمي\n\nالنطاق:\n- التخزين\n- النقل\n- التوزيع\n- التتبع' }, en: { title: 'Introduction to GDP', text: 'GDP = Good Distribution Practice\n\nDefinition: System ensuring pharmaceutical product quality throughout the supply chain\n\nImportance of GDP:\n- Protect patient\n- Ensure drug efficacy\n- Prevent counterfeiting\n- Regulatory compliance\n\nScope:\n- Storage\n- Transport\n- Distribution\n- Traceability' } },
        { id: 'gdp_s2', type: 'learning', ar: { title: 'متطلبات التخزين', text: 'متطلبات التخزين الدوائي:\n\n1. درجة الحرارة:\n- Room temperature: 15-25C\n- Refrigerated: 2-8C\n- Frozen: -20C او اقل\n\n2. الرطوبة: 45-65%\n\n3. التهوية: جيدة\n\n4. الاضاءة: بعيد عن اشعة الشمس\n\n5. التنظيم: FIFO\n\n6. المراقبة: نظام مراقبة مستمر' }, en: { title: 'Storage Requirements', text: 'Pharmaceutical Storage Requirements:\n\n1. Temperature:\n- Room temperature: 15-25C\n- Refrigerated: 2-8C\n- Frozen: -20C or below\n\n2. Humidity: 45-65%\n\n3. Ventilation: Good\n\n4. Lighting: Away from sunlight\n\n5. Organization: FIFO\n\n6. Monitoring: Continuous monitoring system' } },
        { id: 'gdp_s3', type: 'learning', ar: { title: 'سلسلة التبريد', text: 'سلسلة التبريد = Cold Chain\n\nاهمية:\n- الادوية الحساسة للحرارة\n- الحفاظ على الفعالية\n- الامتثال للمعايير\n\nمكونات سلسلة التبريد:\n1. التعبئة المبردة\n2. حاويات مبردة\n3. مراقبة درجة الحرارة\n4. تسجيل البيانات\n5. التدريب' }, en: { title: 'Cold Chain Management', text: 'Cold Chain\n\nImportance:\n- Temperature-sensitive drugs\n- Maintain efficacy\n- Compliance with standards\n\nCold Chain Components:\n1. Insulated packaging\n2. Refrigerated containers\n3. Temperature monitoring\n4. Data logging\n5. Training' } },
        { id: 'gdp_s4', type: 'learning', ar: { title: 'النقل الدوائي', text: 'متطلبات النقل الدوائي:\n\n1. المركبات:\n- نظيفة وجافة\n- درجة حرارة مراقبة\n- مناسبة لتخزين المنتج\n\n2. التخطيط للمسار:\n- تجنب الحرارة الشديدة\n- تقليل وقت الشحن\n\n3. التوثيق:\n- بوليصة الشحن\n- سجل درجة الحرارة\n- قائمة التعبئة' }, en: { title: 'Pharmaceutical Transport', text: 'Pharmaceutical Transport Requirements:\n\n1. Vehicles:\n- Clean and dry\n- Temperature controlled\n- Suitable for product storage\n\n2. Route Planning:\n- Avoid extreme heat\n- Minimize transit time\n\n3. Documentation:\n- Bill of lading\n- Temperature record\n- Packing list' } },
        { id: 'gdp_s5', type: 'learning', ar: { title: 'التتبع', text: 'التتبع = Traceability\n\nاهداف:\n- تتبع المنتج من المصنع للمريض\n- تحديد المشاكل بسرعة\n- منع المنتجات المزورة\n\nنظام التتبع:\n1. رقم الدفعة\n2. تاريخ الانتهاء\n3. نقطة المنشأ\n4. مسار التوزيع\n5. المستلم' }, en: { title: 'Traceability System', text: 'Traceability\n\nObjectives:\n- Track product from manufacturer to patient\n- Identify problems quickly\n- Prevent counterfeit products\n\nTraceability System:\n1. Batch Number\n2. Expiry Date\n3. Origin point\n4. Distribution path\n5. Recipient' } },
        { id: 'gdp_discussion', type: 'discussion', ar: { title: 'نقاش: تطبيق GDP', text: 'اسئلة النقاش:\n\n1. ما التحديات الرئيسية في سلسلة التبريد في منطقتك؟\n\n2. كيف تضمنون التتبع الصحيح للادوية؟\n\n3. ما الاجراءات المتبعة عند اكتشاف دواء مزور؟' }, en: { title: 'Discussion: GDP Application', text: 'Discussion Questions:\n\n1. What are the main challenges in cold chain in your region?\n\n2. How do you ensure proper drug traceability?\n\n3. What procedures are followed when discovering counterfeit drugs?' } }
      ],
      examQuestionPool: ['gdp_q1', 'gdp_q2', 'gdp_q3', 'gdp_q4', 'gdp_q5']
    }`;

// Find the position of qrm-basics examQuestionPool
const searchStr = "examQuestionPool: ['qrm_q1', 'qrm_q2', 'qrm_q3', 'qrm_q4', 'qrm_q5']";
const insertPoint = content.indexOf(searchStr);

if (insertPoint === -1) {
  console.log('Could not find qrm-basics examQuestionPool');
  process.exit(1);
}

console.log('Found qrm-basics examQuestionPool at position:', insertPoint);

// Find the closing brace of qrm-basics unit (after the examQuestionPool)
let braceCount = 0;
let startBrace = -1;
for (let i = insertPoint; i < content.length; i++) {
  if (content[i] === '{') {
    braceCount++;
    if (startBrace === -1) startBrace = i;
  } else if (content[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      // Found the closing brace of qrm-basics
      const afterBrace = i + 1;
      const newContent = content.slice(0, afterBrace) + gdpUnit + content.slice(afterBrace);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('GDP unit added to units section!');
      break;
    }
  }
}

