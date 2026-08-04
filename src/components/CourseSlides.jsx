
import React, { useState } from 'react';

const COURSE_SLIDES = {
  'capa': {
    title: 'إدارة الانحرافات والـ CAPA الفعّالة',
    icon: '🔧', color: '#e11d48',
    units: [
      { title: 'الوحدة 1: تحديد الانحرافات', slides: [
        { title: 'ما هو الانحراف؟', icon: '⚠️', points: ['الانحراف هو أي خروج غير مخطط عن الإجراءات أو المواصفات المعتمدة','يشمل: انحرافات الإنتاج، المختبر، التوثيق','التصنيف: حرج (Critical) — كبير (Major) — ثانوي (Minor)','كل انحراف يجب توثيقه رسمياً بغض النظر عن حجمه'] },
        { title: 'إبلاغ والتحقيق الأولي', icon: '🔍', points: ['الإبلاغ الفوري عن الانحراف لوحدة الجودة (QA)','تحديد نطاق الانحراف: هل أثّر على المنتج؟','عزل الدفعة المتأثرة فوراً (Quarantine)','توثيق الانحراف في نموذج رسمي مع الوقت والتاريخ'] },
        { title: 'التوثيق والإبلاغ التنظيمي', icon: '📋', points: ['ملء نموذج الانحراف (Deviation Report) كاملاً','تحديد المنتجات والدفعات المتأثرة','الإبلاغ للجهات الرقابية عند الانحرافات الحرجة','الحفاظ على سجل مفتوح حتى الإغلاق النهائي'] },
      ]},
      { title: 'الوحدة 2: تحليل السبب الجذري (RCA)', slides: [
        { title: '5 Whys و Fishbone Diagram', icon: '🐟', points: ['5 Whys: اسأل "لماذا؟" 5 مرات للوصول للسبب الحقيقي','Fishbone: يُحدد 6 محاور (Man, Machine, Material, Method, Measurement, Environment)','الهدف: الوصول للسبب الجذري وليس مجرد الأعراض','التطبيق العملي: ابدأ بالحدث ثم اسأل لماذا حدث بشكل متسلسل'] },
        { title: 'FMEA و Pareto Analysis', icon: '📊', points: ['FMEA: RPN = Severity × Occurrence × Detection','Pareto (80/20): 80% من المشاكل تنتج عن 20% من الأسباب','ابدأ بمعالجة الأسباب الأعلى تأثيراً أولاً','استخدم البيانات التاريخية لتحديد الأنماط المتكررة'] },
        { title: 'التحقق من السبب الجذري', icon: '✅', points: ['التحقق بالدليل: هل يفسر السبب الجذري المشكلة كاملاً؟','اختبار الافتراض: لو أزلنا هذا السبب، هل تختفي المشكلة؟','مراجعة فريق متعدد التخصصات (QA، الإنتاج، المختبر)','توثيق السبب الجذري المؤكد في تقرير التحقيق'] },
      ]},
      { title: 'الوحدة 3: الإجراءات التصحيحية (CA)', slides: [
        { title: 'تطوير الإجراءات التصحيحية', icon: '🔧', points: ['الإجراء التصحيحي يعالج السبب الجذري المؤكد مباشرة','يجب أن يكون محدداً وقابلاً للقياس وله جدول زمني','أمثلة: تعديل SOP، إعادة تدريب الموظفين، استبدال معدة','تحديد المسؤول عن التنفيذ والموعد النهائي'] },
        { title: 'تقييم الفعالية والتنفيذ', icon: '📈', points: ['تنفيذ الإجراء في الموعد المحدد مع التوثيق الكامل','التحقق من الفعالية: هل اختفت المشكلة فعلاً؟','فترة المراقبة: مراقبة العملية بعد التصحيح لفترة كافية','تحديث الـ SOP والوثائق ذات الصلة'] },
        { title: 'التوثيق وإغلاق الانحراف', icon: '🔒', points: ['إغلاق CAPA يتطلب دليلاً موثقاً على تنفيذ الإجراء وفعاليته','موافقة وحدة الجودة (QA) قبل الإغلاق الرسمي','أرشفة جميع الوثائق المرتبطة بالانحراف','مشاركة الدروس المستفادة مع الفريق لمنع التكرار'] },
      ]},
      { title: 'الوحدة 4: الإجراءات الوقائية (PA)', slides: [
        { title: 'تحديد المخاطر المحتملة', icon: '🛡️', points: ['الإجراء الوقائي يمنع مشكلة لم تحدث بعد','مصادر تحديد المخاطر: مراجعات الاتجاه، بيانات OOS، ملاحظات التدقيق','تحليل المخاطر باستخدام QRM (ICH Q9)','الأولوية للمخاطر ذات التأثير العالي على المريض'] },
        { title: 'تطوير ومراقبة الإجراءات الوقائية', icon: '🔐', points: ['تصميم الإجراء الوقائي ليتناسب مع مستوى الخطر','تشمل: تحسين الإجراءات، تقوية الضوابط، تعزيز التدريب','وضع KPIs لتتبع فعالية الإجراء الوقائي','مراجعة دورية للتأكد من استمرار الفعالية'] },
      ]},
      { title: 'الوحدة 5: التكامل مع نظام الجودة', slides: [
        { title: 'إدارة دورة حياة CAPA', icon: '🔄', points: ['دورة CAPA: تحديد → تحقيق → تحليل → تصحيح/وقاية → تحقق → إغلاق','نظام CAPA الفعّال يدعم التحسين المستمر وفق ICH Q10','نظام لتتبع جميع الـ CAPAs المفتوحة والمغلقة','مراجعة دورية لأعداد وأنواع الـ CAPAs كمؤشر صحة نظام الجودة'] },
        { title: 'التحسين المستمر ودورة حياة المنتج', icon: '🌱', points: ['CAPA الفعّال يُقلل تكرار الانحرافات مع الوقت','تحليل الاتجاهات (Trend Analysis) يكشف عن مشاكل منهجية','مشاركة الدروس المستفادة تعزز ثقافة الجودة في المنظمة','التحسين المستمر هو جوهر GMP وICH Q10 معاً'] },
      ]},
    ]
  },
  'iso-9001': {
    title: 'نظام إدارة الجودة ISO 9001:2015',
    icon: '📋', color: '#0ea5e9',
    units: [
      { title: 'الوحدة 1: مبادئ ISO 9001:2015', slides: [
        { title: 'ما هو ISO 9001؟', icon: '🏛️', points: ['ISO 9001 هو المعيار الدولي لنظام إدارة الجودة (QMS)','الإصدار الأحدث: ISO 9001:2015 — أضاف مفهوم التفكير المبني على المخاطر','يُطبَّق في جميع الصناعات بما فيها صناعة الأدوية','الحصول على الشهادة يتطلب تدقيقاً خارجياً من جهة اعتماد'] },
        { title: 'التفكير المبني على المخاطر', icon: '⚖️', points: ['المبدأ الجديد في 2015: تحديد المخاطر والفرص ومعالجتها','المخاطر الداخلية: كفاءة الموظفين، جودة المعدات، الإجراءات','المخاطر الخارجية: متطلبات السوق، التغييرات التنظيمية، الموردين','معالجة المخاطر لا تعني إلغاءها بل إدارتها بشكل منهجي'] },
        { title: 'سياق المنظمة والقيادة', icon: '🌐', points: ['فهم العوامل الداخلية والخارجية المؤثرة على المنظمة','تحديد الأطراف المعنية واحتياجاتهم وتوقعاتهم','الإدارة العليا مسؤولة كاملاً عن فعالية نظام الجودة','مراجعة الإدارة: اجتماع دوري لتقييم أداء النظام'] },
      ]},
      { title: 'الوحدة 2: الدعم والتشغيل', slides: [
        { title: 'الموارد والوعي والتوثيق', icon: '💡', points: ['توفير البنية التحتية والبيئة المناسبة للعمل','الوعي: كل موظف يفهم دوره في تحقيق أهداف الجودة','ISO 9001:2015 مرن في متطلبات التوثيق — حسب حجم وتعقيد المنظمة','التحكم في الوثائق: الإصدار، المراجعة، التوزيع، الأرشفة'] },
        { title: 'إدارة الموردين الخارجيين', icon: '🤝', points: ['تقييم واختيار الموردين بناءً على قدرتهم على تلبية متطلبات الجودة','مراقبة أداء الموردين بشكل مستمر','تحديد نوع ومدى السيطرة على العمليات الخارجية','الاتفاق الواضح على المتطلبات مع الموردين في العقود'] },
      ]},
      { title: 'الوحدة 3: التقييم والتحسين', slides: [
        { title: 'التدقيق الداخلي', icon: '🔎', points: ['فحص منهجي مستقل للتحقق من أن نظام الجودة يُنفَّذ بفعالية','المدققون يجب أن يكونوا مستقلين عن النشاط الذي يُدققونه','نتائج التدقيق تُغذي برنامج CAPA وتحسين النظام','وثائق التدقيق: خطة، نتائج، تقرير، إجراءات تصحيحية'] },
        { title: 'التحسين المستمر', icon: '🌱', points: ['ISO 9001 يُلزم بالتحسين المستمر لفعالية نظام الجودة','مصادر التحسين: شكاوى العملاء، بيانات الأداء، نتائج التدقيق','دورة PDCA: Plan → Do → Check → Act','التحسين يشمل المنتجات والعمليات والنظام ككل'] },
      ]},
    ]
  },
  'qc-lab': {
    title: 'مختبر ضبط الجودة وISO 17025',
    icon: '🧫', color: '#10b981',
    units: [
      { title: 'الوحدة 1: أساسيات مختبر QC', slides: [
        { title: 'دور مختبر QC في الصناعة الدوائية', icon: '🔬', points: ['التحقق من مطابقة المواد الخام والمنتج النهائي للمواصفات','اختبارات الهوية والنقاء والفعالية والأمان','دعم قرار إطلاق الدفعة (Batch Release)','الاستجابة لنتائج OOS وOOT وفتح التحقيقات'] },
        { title: 'سلامة البيانات في المختبر', icon: '🔐', points: ['تطبيق مبادئ ALCOA+ في كل عملية تحليلية','دفتر المختبر الرسمي: توثيق فوري لكل قراءة ونتيجة','Audit Trail إلزامي في جميع الأنظمة الإلكترونية','التعديل على البيانات: يجب توثيق السبب والتاريخ وتوقيع المعدِّل'] },
        { title: 'معايرة الأجهزة (Calibration)', icon: '⚙️', points: ['المعايرة تُثبت أن الجهاز يُعطي قراءات دقيقة ومتتبعة لمراجع دولية','جدول معايرة دوري محدد لكل جهاز','تسجيل نتائج المعايرة في شهادة معايرة رسمية','الجهاز غير المعاير: لا يُستخدم ونتائجه غير معتمدة'] },
      ]},
      { title: 'الوحدة 2: نتائج OOS وOOT', slides: [
        { title: 'Out of Specification (OOS)', icon: '🚨', points: ['OOS: نتيجة تتجاوز الحدود المواصفاتية المعتمدة','المرحلة I: تحقيق في خطأ مختبري','المرحلة II: تحقيق موسع يشمل الإنتاج والمواد الخام','لا يُسمح بـ "تكرار الاختبار حتى النجاح" دون تبرير موثق'] },
        { title: 'Out of Trend (OOT) وعينة الاحتفاظ', icon: '📉', points: ['OOT: نتيجة داخل المواصفات لكنها تُظهر اتجاهاً غير معتاد','الكشف عن OOT يتطلب مراقبة منتظمة بمخططات التحكم','عينة الاحتفاظ (Retained Sample): تُحفظ لإعادة الاختبار عند الحاجة','يجب تخزين عينة الاحتفاظ في نفس ظروف المنتج'] },
      ]},
      { title: 'الوحدة 3: ISO/IEC 17025:2017', slides: [
        { title: 'متطلبات ISO 17025', icon: '📜', points: ['المعيار الدولي لكفاءة المختبرات واعتمادها','يشمل: الهيكل التنظيمي، الكفاءة، النزاهة، التشغيل المتسق','النزاهة (Impartiality): الحياد التام من أي ضغوط خارجية','قابلية التتبع القياسية: ربط نتائج القياس بمراجع دولية'] },
        { title: 'اختبارات الكفاءة والاعتماد', icon: '🏅', points: ['Proficiency Testing: مقارنة نتائج المختبر مع مختبرات أخرى','Z-score: |Z| ≤ 2 مقبول — |Z| > 3 يتطلب تحقيقاً','Verification: إثبات أن طريقة موحدة تعمل في مختبرك','الاعتماد يُمنح من جهة اعتماد وطنية بعد تدقيق ميداني'] },
      ]},
    ]
  },
  'ipqc': {
    title: 'رقابة الجودة أثناء العملية IPQC',
    icon: '🏭', color: '#f59e0b',
    units: [
      { title: 'الوحدة 1: مبادئ IPQC', slides: [
        { title: 'ما هو IPQC؟', icon: '⚙️', points: ['رقابة الجودة أثناء العملية الإنتاجية للكشف المبكر عن الانحرافات','الهدف: منع إنتاج دفعة كاملة معيبة بالكشف المبكر','يختلف عن فحص الإفراج النهائي: IPQC خلال الإنتاج — Release Testing بعده','جزء أساسي من دفتر تصنيع الدفعة (BMR)'] },
        { title: 'اختبارات IPQC للأقراص', icon: '💊', points: ['الوزن: كل 15-30 دقيقة — انحراف الوزن = انحراف الجرعة','الصلابة (Hardness): تؤثر على معدل الذوبان والتفتت','الهشاشة (Friability): يجب أن تكون < 1%','وقت التفتت (Disintegration): حسب مواصفات الدستور الدوائي'] },
        { title: 'اختبارات IPQC للكبسولات والسوائل', icon: '💉', points: ['الكبسولات: وزن المحتوى، سمك القشرة، ختم الكبسولة','السوائل: الحجم، pH، الكثافة، التعكر، سلامة الإغلاق','Seal Integrity: حرج للأشكال السائلة والمعقمة','فحص التعبئة: دقة الملء وسلامة الختم قبل التغليف'] },
      ]},
      { title: 'الوحدة 2: خطط أخذ العينات والحدود', slides: [
        { title: 'مبادئ أخذ عينات IPQC', icon: '📐', points: ['العينة يجب أن تكون تمثيلية لكامل الدفعة','التكرار: يُحدد بناءً على طول الدفعة وسرعة الإنتاج','أخذ عينات من بداية ووسط ونهاية الدفعة','توثيق توقيت ونتائج كل عملية أخذ عينة في BMR'] },
        { title: 'حدود التنبيه والعمل', icon: '🚦', points: ['حد التنبيه (Alert Limit): يستدعي المراقبة المكثفة','حد العمل (Action Limit): يستدعي إيقاف الإنتاج والتحقيق','المواصفة (Specification): الحد النهائي للقبول','التصرف الفوري عند تجاوز حد العمل وتوثيق الانحراف'] },
      ]},
      { title: 'الوحدة 3: شهادة التحليل (CoA)', slides: [
        { title: 'ما هي شهادة التحليل؟', icon: '📜', points: ['CoA: وثيقة رسمية تُدرج نتائج اختبارات المنتج مقابل مواصفاتها','تُصدر مع كل دفعة كجزء من وثائق الإفراج','تحتوي على: رقم الدفعة، تاريخ الإنتاج والانتهاء، نتائج الاختبارات، توقيع مسؤول الجودة','تُرسل للعميل كضمان لجودة المنتج المسلّم'] },
        { title: 'قرار الإفراج والتحسين المستمر', icon: '📈', points: ['قرار الإفراج: وحدة الجودة (QA) مسؤولة وحدها','الدفعة تبقى قيد الحجز (Quarantine) حتى الإفراج الرسمي','بيانات IPQC تُستخدم في مراجعة الجودة السنوية (PQR)','تحليل الاتجاهات يكشف عن مشاكل منهجية في العملية'] },
      ]},
    ]
  }
};

export default function CourseSlides({ unitId, onStartQuiz, onBack }) {
  const course = COURSE_SLIDES[unitId];
  const [currentUnit, setCurrentUnit] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!course) return null;

  const unit = course.units[currentUnit];
  const slide = unit?.slides[currentSlide];
  const totalSlides = course.units.reduce((a, u) => a + u.slides.length, 0);
  const completedSlides = course.units.slice(0, currentUnit).reduce((a, u) => a + u.slides.length, 0) + currentSlide;
  const progress = Math.round(((completedSlides + 1) / totalSlides) * 100);
  const isLastSlide = currentUnit === course.units.length - 1 && currentSlide === unit.slides.length - 1;

  const goNext = () => {
    if (currentSlide < unit.slides.length - 1) setCurrentSlide(s => s + 1);
    else if (currentUnit < course.units.length - 1) { setCurrentUnit(u => u + 1); setCurrentSlide(0); }
  };

  const goPrev = () => {
    if (currentSlide > 0) setCurrentSlide(s => s - 1);
    else if (currentUnit > 0) { setCurrentUnit(u => u - 1); setCurrentSlide(course.units[currentUnit - 1].slides.length - 1); }
  };

  const isFirst = currentUnit === 0 && currentSlide === 0;

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif", maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button onClick={onBack} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 16px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 'bold' }}>← رجوع</button>
        <div>
          <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{course.icon} {course.title}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{unit.title}</div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>التقدم</span><span>{progress}% — {completedSlides + 1} من {totalSlides}</span>
        </div>
        <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: course.color, borderRadius: '4px', transition: 'width 0.4s' }} />
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', border: `2px solid ${course.color}44`, borderRadius: '24px', padding: '36px', minHeight: '320px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{slide?.icon}</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: course.color, marginBottom: '20px' }}>{slide?.title}</h2>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {slide?.points.map((point, i) => (
            <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: `${course.color}22`, border: `2px solid ${course.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', color: course.color, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '16px 0', justifyContent: 'center' }}>
        {course.units.map((u, i) => (
          <button key={i} onClick={() => { setCurrentUnit(i); setCurrentSlide(0); }}
            style={{ padding: '5px 12px', borderRadius: '20px', border: `2px solid ${i === currentUnit ? course.color : 'var(--border-color)'}`, background: i === currentUnit ? `${course.color}22` : 'transparent', color: i === currentUnit ? course.color : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: i === currentUnit ? '700' : '400' }}>
            {i + 1}. {u.title.replace(/الوحدة \d+: /, '')}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={goPrev} disabled={isFirst}
          style={{ padding: '11px 24px', borderRadius: '12px', border: '2px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', cursor: isFirst ? 'not-allowed' : 'pointer', opacity: isFirst ? 0.4 : 1, fontWeight: '600' }}>
          → السابق
        </button>
        <div style={{ display: 'flex', gap: '6px' }}>
          {unit?.slides.map((_, i) => (
            <div key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? '22px' : '8px', height: '8px', borderRadius: '4px', background: i === currentSlide ? course.color : 'var(--border-color)', transition: 'all 0.3s', cursor: 'pointer' }} />
          ))}
        </div>
        {isLastSlide ? (
          <button onClick={onStartQuiz} style={{ padding: '11px 24px', borderRadius: '12px', border: 'none', background: course.color, color: 'white', cursor: 'pointer', fontWeight: '700' }}>🎯 ابدأ الاختبار</button>
        ) : (
          <button onClick={goNext} style={{ padding: '11px 24px', borderRadius: '12px', border: 'none', background: course.color, color: 'white', cursor: 'pointer', fontWeight: '700' }}>التالي ←</button>
        )}
      </div>
    </div>
  );
}
