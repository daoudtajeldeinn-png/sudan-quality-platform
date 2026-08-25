import React, { useState } from 'react';

const COURSE_SLIDES = {
  'capa': {
    title: 'إدارة الانحرافات والـ CAPA الفعّالة',
    titleEn: 'CAPA Management',
    icon: '🔧', color: '#e11d48', colorLight: '#fff1f2', colorMid: '#fecdd3',
    instructor: 'Dr. Daoud Tajeldeinn',
    course: 'GMP / ICH Q10',
    units: [
      {
        title: 'تحديد الانحرافات',
        number: '01',
        slides: [
          {
            title: 'ما هو الانحراف؟',
            subtitle: 'Deviation Definition & Classification',
            sections: [
              {
                type: 'definition',
                label: 'التعريف',
                text: 'أي خروج غير مخطط عن الإجراءات أو المواصفات المعتمدة خلال دورة حياة المنتج'
              },
              {
                type: 'points',
                label: 'أنواع الانحرافات',
                items: [
                  { text: 'انحرافات الإنتاج — Production Deviations', good: true },
                  { text: 'انحرافات المختبر — Laboratory Deviations', good: true },
                  { text: 'انحرافات التوثيق — Documentation Deviations', good: true },
                ]
              },
              {
                type: 'classify',
                label: 'التصنيف',
                items: [
                  { label: 'حرج Critical', color: '#ef4444', desc: 'يؤثر على سلامة المريض' },
                  { label: 'كبير Major', color: '#f97316', desc: 'يؤثر على جودة المنتج' },
                  { label: 'ثانوي Minor', color: '#eab308', desc: 'انحراف إجرائي بسيط' },
                ]
              },
              {
                type: 'quote',
                text: 'كل انحراف يجب توثيقه رسمياً — بغض النظر عن حجمه'
              }
            ]
          },
          {
            title: 'إبلاغ والتحقيق الأولي',
            subtitle: 'Reporting & Initial Investigation',
            sections: [
              {
                type: 'steps',
                label: 'خطوات الإبلاغ',
                items: [
                  'الإبلاغ الفوري لوحدة الجودة (QA)',
                  'تحديد نطاق الانحراف وأثره على المنتج',
                  'عزل الدفعة المتأثرة فوراً (Quarantine)',
                  'توثيق الانحراف مع الوقت والتاريخ والموقع',
                ]
              },
              {
                type: 'compare',
                label: 'صحيح vs خاطئ',
                good: ['الإبلاغ فوري ومباشر', 'التوثيق مكتمل ودقيق', 'العزل قبل التحقيق'],
                bad: ['التأخر في الإبلاغ', 'الإبلاغ الشفهي فقط', 'الاستمرار في الإنتاج'],
              },
              {
                type: 'quote',
                text: '"If it isn\'t documented, it didn\'t happen"'
              }
            ]
          },
          {
            title: 'التوثيق والإبلاغ التنظيمي',
            subtitle: 'Documentation & Regulatory Reporting',
            sections: [
              {
                type: 'points',
                label: 'محتوى تقرير الانحراف',
                items: [
                  { text: 'رقم الدفعة والمنتج المتأثر', good: true },
                  { text: 'وصف الانحراف بدقة', good: true },
                  { text: 'التأثير المحتمل على الجودة', good: true },
                  { text: 'الإجراء الفوري المتخذ', good: true },
                ]
              },
              {
                type: 'classify',
                label: 'متى تُبلّغ الجهات الرقابية؟',
                items: [
                  { label: 'فوري', color: '#ef4444', desc: 'انحرافات تمس سلامة المريض' },
                  { label: '15 يوم', color: '#f97316', desc: 'سحب المنتج من السوق' },
                  { label: 'تقرير دوري', color: '#3b82f6', desc: 'الانحرافات الثانوية' },
                ]
              },
              {
                type: 'quote',
                text: 'السجل المفتوح يبقى حتى الإغلاق الرسمي الموثق'
              }
            ]
          }
        ]
      },
      {
        title: 'تحليل السبب الجذري',
        number: '02',
        slides: [
          {
            title: '5 Whys و Fishbone Diagram',
            subtitle: 'Root Cause Analysis Tools',
            sections: [
              {
                type: 'definition',
                label: '5 Whys',
                text: 'اسأل "لماذا؟" 5 مرات متتالية للوصول للسبب الحقيقي وليس مجرد الأعراض'
              },
              {
                type: 'steps',
                label: 'محاور Fishbone (Ishikawa)',
                items: ['Man — الإنسان', 'Machine — المعدة', 'Material — المادة', 'Method — الطريقة', 'Measurement — القياس', 'Environment — البيئة']
              },
              {
                type: 'quote',
                text: 'الهدف: الوصول للسبب الجذري وليس معالجة الأعراض فقط'
              }
            ]
          },
          {
            title: 'FMEA و Pareto Analysis',
            subtitle: 'Advanced RCA Tools',
            sections: [
              {
                type: 'classify',
                label: 'FMEA — Risk Priority Number',
                items: [
                  { label: 'Severity', color: '#ef4444', desc: 'شدة التأثير (1-10)' },
                  { label: 'Occurrence', color: '#f97316', desc: 'احتمال الحدوث (1-10)' },
                  { label: 'Detection', color: '#3b82f6', desc: 'إمكانية الكشف (1-10)' },
                ]
              },
              {
                type: 'definition',
                label: 'RPN = S × O × D',
                text: 'كلما ارتفع الـ RPN، كلما كانت الأولوية أعلى في المعالجة'
              },
              {
                type: 'points',
                label: 'Pareto (80/20)',
                items: [
                  { text: '80% من المشاكل تنتج عن 20% من الأسباب', good: true },
                  { text: 'ابدأ بمعالجة الأسباب الأعلى تأثيراً', good: true },
                  { text: 'استخدم البيانات التاريخية لتحديد الأنماط', good: true },
                ]
              }
            ]
          },
          {
            title: 'التحقق من السبب الجذري',
            subtitle: 'Root Cause Verification',
            sections: [
              {
                type: 'compare',
                label: 'اختبار صحة السبب الجذري',
                good: ['يُفسّر المشكلة كاملاً', 'إزالته تُزيل المشكلة', 'مدعوم بالأدلة والبيانات'],
                bad: ['يُفسّر جزءاً فقط', 'تكرار المشكلة بعد العلاج', 'افتراض بدون دليل'],
              },
              {
                type: 'points',
                label: 'إجراءات التحقق',
                items: [
                  { text: 'مراجعة فريق متعدد التخصصات (QA، إنتاج، مختبر)', good: true },
                  { text: 'توثيق السبب الجذري المؤكد رسمياً', good: true },
                  { text: 'الحصول على موافقة وحدة الجودة', good: true },
                ]
              },
              {
                type: 'quote',
                text: 'السبب الجذري الصحيح: لو أُزيل، اختفت المشكلة نهائياً'
              }
            ]
          }
        ]
      },
      {
        title: 'الإجراءات التصحيحية والوقائية',
        number: '03',
        slides: [
          {
            title: 'تطوير الإجراءات التصحيحية (CA)',
            subtitle: 'Corrective Actions Development',
            sections: [
              {
                type: 'definition',
                label: 'CA — Corrective Action',
                text: 'إجراء يعالج السبب الجذري المؤكد مباشرة لمنع تكرار الانحراف'
              },
              {
                type: 'points',
                label: 'خصائص الـ CA الفعّال',
                items: [
                  { text: 'محدد وواضح — Specific', good: true },
                  { text: 'قابل للقياس — Measurable', good: true },
                  { text: 'له مسؤول وموعد نهائي', good: true },
                  { text: 'موثق ومعتمد من QA', good: true },
                ]
              },
              {
                type: 'steps',
                label: 'أمثلة على الـ CA',
                items: ['تعديل SOP وإعادة تدريب الفريق', 'استبدال المعدة أو إصلاحها', 'تغيير مورد المادة الخام', 'تعزيز ضوابط العملية الإنتاجية']
              }
            ]
          },
          {
            title: 'الإجراءات الوقائية (PA) وإغلاق CAPA',
            subtitle: 'Preventive Actions & CAPA Closure',
            sections: [
              {
                type: 'compare',
                label: 'CA vs PA',
                good: ['CA: يعالج مشكلة حدثت', 'PA: يمنع مشكلة محتملة', 'كلاهما يتطلب التحقق من الفعالية'],
                bad: ['CA بدون تحقق = غير مكتمل', 'PA بدون تحديد المخاطر = عشوائي', 'إغلاق قبل إثبات الفعالية'],
              },
              {
                type: 'steps',
                label: 'شروط إغلاق CAPA',
                items: ['تنفيذ الإجراء في الموعد المحدد', 'التحقق الموثق من الفعالية', 'موافقة وحدة الجودة (QA)', 'أرشفة جميع الوثائق']
              },
              {
                type: 'quote',
                text: 'CAPA مغلق بدون تحقق من الفعالية = CAPA فاشل'
              }
            ]
          }
        ]
      },
      {
        title: 'التكامل مع نظام الجودة',
        number: '04',
        slides: [
          {
            title: 'دورة حياة CAPA وICH Q10',
            subtitle: 'CAPA Lifecycle & Quality System Integration',
            sections: [
              {
                type: 'steps',
                label: 'دورة CAPA الكاملة',
                items: ['① تحديد الانحراف أو المخاطرة', '② التحقيق وتحليل السبب الجذري', '③ تطوير CA/PA وتعيين المسؤوليات', '④ تنفيذ الإجراءات في الموعد', '⑤ التحقق من الفعالية', '⑥ الإغلاق الرسمي والأرشفة']
              },
              {
                type: 'classify',
                label: 'CAPA كـ KPI لصحة نظام الجودة',
                items: [
                  { label: '< 30 يوم', color: '#10b981', desc: 'إغلاق الانحرافات الثانوية' },
                  { label: '< 60 يوم', color: '#f97316', desc: 'إغلاق الانحرافات الكبيرة' },
                  { label: 'صفر CAPAs متأخرة', color: '#3b82f6', desc: 'مؤشر إدارة ممتاز' },
                ]
              },
              {
                type: 'quote',
                text: 'CAPA الفعّال = تقليل الانحرافات + تعزيز ثقافة الجودة'
              }
            ]
          }
        ]
      },
    ]
  },
  'iso-9001': {
    title: 'نظام إدارة الجودة ISO 9001:2015',
    titleEn: 'ISO 9001 QMS',
    icon: '📋', color: '#0ea5e9', colorLight: '#f0f9ff', colorMid: '#bae6fd',
    instructor: 'Dr. Daoud Tajeldeinn',
    course: 'Quality Management',
    units: [
      {
        title: 'مبادئ ISO 9001:2015',
        number: '01',
        slides: [
          {
            title: 'ما هو ISO 9001؟',
            subtitle: 'Quality Management System Standard',
            sections: [
              { type: 'definition', label: 'التعريف', text: 'المعيار الدولي لنظام إدارة الجودة — يُطبَّق في جميع الصناعات ويضمن الاتساق في تقديم المنتجات والخدمات' },
              { type: 'classify', label: 'المستجدات في إصدار 2015', items: [
                { label: 'Risk-Based Thinking', color: '#0ea5e9', desc: 'التفكير المبني على المخاطر' },
                { label: 'Context', color: '#8b5cf6', desc: 'سياق المنظمة والأطراف المعنية' },
                { label: 'Leadership', color: '#10b981', desc: 'مسؤولية الإدارة العليا المباشرة' },
              ]},
              { type: 'quote', text: '"Quality is not an act, it is a habit" — Aristotle' }
            ]
          },
          {
            title: 'التفكير المبني على المخاطر',
            subtitle: 'Risk-Based Thinking',
            sections: [
              { type: 'definition', label: 'المفهوم', text: 'تحديد المخاطر والفرص المؤثرة على أهداف الجودة ومعالجتها بشكل منهجي قبل حدوث المشاكل' },
              { type: 'compare', label: 'المخاطر الداخلية vs الخارجية',
                good: ['كفاءة الموظفين', 'جودة المعدات والبنية التحتية', 'فعالية الإجراءات والعمليات'],
                bad: ['متطلبات السوق والعملاء', 'التغييرات التنظيمية', 'أداء الموردين الخارجيين'],
              },
              { type: 'quote', text: 'معالجة المخاطر لا تعني إلغاءها — بل إدارتها بذكاء' }
            ]
          }
        ]
      },
      {
        title: 'التشغيل والتقييم',
        number: '02',
        slides: [
          {
            title: 'الموارد والتوثيق وإدارة الموردين',
            subtitle: 'Support & Operation',
            sections: [
              { type: 'points', label: 'متطلبات الدعم', items: [
                { text: 'الموارد: بنية تحتية وبيئة عمل مناسبة', good: true },
                { text: 'الوعي: كل موظف يفهم دوره في الجودة', good: true },
                { text: 'التوثيق: مرن حسب حجم المنظمة', good: true },
              ]},
              { type: 'steps', label: 'إدارة الموردين الخارجيين', items: ['تقييم واختيار الموردين بمعايير جودة محددة', 'مراقبة الأداء بشكل مستمر', 'تحديد مدى السيطرة على العمليات الخارجية', 'توثيق المتطلبات في العقود']},
              { type: 'quote', text: 'الجودة تبدأ من اختيار المورد الصحيح' }
            ]
          },
          {
            title: 'التدقيق الداخلي والتحسين المستمر',
            subtitle: 'Internal Audit & Continual Improvement',
            sections: [
              { type: 'definition', label: 'التدقيق الداخلي', text: 'فحص منهجي مستقل للتحقق من تطبيق نظام الجودة بفعالية ومطابقته للمتطلبات' },
              { type: 'steps', label: 'دورة PDCA للتحسين', items: ['Plan — تحديد الأهداف والإجراءات', 'Do — تنفيذ الخطة', 'Check — قياس النتائج وتحليلها', 'Act — اتخاذ إجراءات التحسين'] },
              { type: 'quote', text: 'التحسين المستمر ليس خياراً في ISO 9001 — إنه إلزامي' }
            ]
          }
        ]
      }
    ]
  },
  'qc-lab': {
    title: 'مختبر ضبط الجودة وISO 17025',
    titleEn: 'QC Laboratory',
    icon: '🧫', color: '#10b981', colorLight: '#f0fdf4', colorMid: '#bbf7d0',
    instructor: 'Dr. Daoud Tajeldeinn',
    course: 'QC / ISO 17025',
    units: [
      {
        title: 'أساسيات مختبر QC',
        number: '01',
        slides: [
          {
            title: 'دور مختبر QC وسلامة البيانات',
            subtitle: 'QC Lab Role & Data Integrity',
            sections: [
              { type: 'points', label: 'مهام مختبر QC', items: [
                { text: 'اختبار المواد الخام قبل الاستخدام', good: true },
                { text: 'رقابة الجودة أثناء الإنتاج (IPQC)', good: true },
                { text: 'فحص المنتج النهائي قبل الإفراج', good: true },
                { text: 'دعم قرار الإفراج (Batch Release)', good: true },
              ]},
              { type: 'classify', label: 'ALCOA+ لسلامة البيانات', items: [
                { label: 'Attributable', color: '#10b981', desc: 'قابلة للإسناد لمن أنشأها' },
                { label: 'Contemporaneous', color: '#0ea5e9', desc: 'تُسجَّل فور الحدوث' },
                { label: 'Original & Accurate', color: '#8b5cf6', desc: 'أصلية ودقيقة' },
              ]},
              { type: 'quote', text: '"If it isn\'t documented, it didn\'t happen" — GMP Principle' }
            ]
          },
          {
            title: 'OOS وOOT والتحقيق',
            subtitle: 'Out of Specification & Out of Trend',
            sections: [
              { type: 'compare', label: 'OOS vs OOT',
                good: ['OOS: تجاوز الحدود المواصفاتية — تحقيق إلزامي', 'OOT: داخل المواصفات لكن اتجاه غير معتاد', 'OOT: إنذار مبكر قبل حدوث OOS'],
                bad: ['تكرار الاختبار بدون توثيق', 'تجاهل OOT لأن النتيجة مقبولة', 'إغلاق التحقيق بدون سبب جذري'],
              },
              { type: 'steps', label: 'مراحل تحقيق OOS', items: ['المرحلة I: تحقيق في خطأ مختبري', 'المرحلة II: مراجعة الإنتاج والمواد', 'القرار: قبول أو رفض الدفعة', 'الإبلاغ والتوثيق الكامل'] },
              { type: 'quote', text: 'OOT اليوم = OOS غداً — لا تتجاهله' }
            ]
          }
        ]
      },
      {
        title: 'ISO 17025 والاعتماد',
        number: '02',
        slides: [
          {
            title: 'متطلبات ISO 17025:2017',
            subtitle: 'Laboratory Accreditation Requirements',
            sections: [
              { type: 'definition', label: 'ISO 17025', text: 'المعيار الدولي لكفاءة المختبرات — يُثبت الكفاءة والنزاهة وقابلية التتبع القياسية' },
              { type: 'classify', label: 'ركائز الاعتماد', items: [
                { label: 'Impartiality', color: '#10b981', desc: 'الحياد التام من الضغوط الخارجية' },
                { label: 'Traceability', color: '#0ea5e9', desc: 'ربط القياسات بمراجع دولية' },
                { label: 'Proficiency', color: '#8b5cf6', desc: 'إثبات الكفاءة بـ PT' },
              ]},
              { type: 'compare', label: 'Verification vs Validation',
                good: ['Verification: طريقة موحدة في مختبرك', 'Validation: طريقة جديدة للتحقق من صلاحيتها', 'كلاهما ضروري لضمان دقة النتائج'],
                bad: ['تطبيق طريقة جديدة بدون validation', 'نقل طريقة لمختبر آخر بدون verification', 'الاعتماد على نتائج PT فقط'],
              }
            ]
          }
        ]
      }
    ]
  },
  'ipqc': {
    title: 'رقابة الجودة أثناء العملية IPQC',
    titleEn: 'In-Process Quality Control',
    icon: '🏭', color: '#f59e0b', colorLight: '#fffbeb', colorMid: '#fde68a',
    instructor: 'Dr. Daoud Tajeldeinn',
    course: 'GMP / Production',
    units: [
      {
        title: 'مبادئ وفحوصات IPQC',
        number: '01',
        slides: [
          {
            title: 'ما هو IPQC وأهميته؟',
            subtitle: 'In-Process Quality Control Fundamentals',
            sections: [
              { type: 'definition', label: 'IPQC', text: 'رقابة الجودة أثناء العملية الإنتاجية — الكشف المبكر عن الانحرافات قبل اكتمال الدفعة لتوفير الوقت والمواد' },
              { type: 'compare', label: 'IPQC vs Release Testing',
                good: ['IPQC: أثناء الإنتاج — كشف مبكر', 'يسمح بالتصحيح الفوري', 'يُقلل الخسائر في المواد والوقت'],
                bad: ['Release Testing: بعد اكتمال الدفعة', 'رفض الدفعة كاملة عند الفشل', 'خسارة إنتاج كامل'],
              },
              { type: 'quote', text: 'الجودة تُبنى داخل المنتج — لا تُفحص في النهاية فقط' }
            ]
          },
          {
            title: 'فحوصات IPQC للأشكال الصيدلانية',
            subtitle: 'IPQC Tests by Dosage Form',
            sections: [
              { type: 'classify', label: 'أقراص — Tablets', items: [
                { label: 'الوزن', color: '#f59e0b', desc: 'كل 15-30 دقيقة — انحراف الوزن = انحراف الجرعة' },
                { label: 'الصلابة', color: '#ef4444', desc: 'Hardness — تؤثر على الذوبان' },
                { label: 'الهشاشة', color: '#8b5cf6', desc: 'Friability < 1%' },
              ]},
              { type: 'points', label: 'فحوصات إضافية للأقراص', items: [
                { text: 'وقت التفتت (Disintegration) — حسب الدستور', good: true },
                { text: 'السماكة والقطر — للتحقق من اتساق الضغط', good: true },
                { text: 'Seal Integrity للسوائل والكبسولات', good: true },
              ]},
              { type: 'quote', text: 'انحراف الوزن = انحراف الجرعة = خطر على المريض' }
            ]
          }
        ]
      },
      {
        title: 'خطط أخذ العينات وشهادة التحليل',
        number: '02',
        slides: [
          {
            title: 'حدود التنبيه والعمل وشهادة التحليل',
            subtitle: 'Alert/Action Limits & Certificate of Analysis',
            sections: [
              { type: 'classify', label: 'مستويات الاستجابة', items: [
                { label: 'Alert Limit', color: '#eab308', desc: 'مراقبة مكثفة — لا إيقاف للإنتاج' },
                { label: 'Action Limit', color: '#f97316', desc: 'إيقاف الإنتاج فوراً + تحقيق' },
                { label: 'Specification', color: '#ef4444', desc: 'الحد النهائي للقبول' },
              ]},
              { type: 'definition', label: 'شهادة التحليل (CoA)', text: 'وثيقة رسمية تُدرج نتائج اختبارات الدفعة مقابل مواصفاتها وتُصدر مع كل دفعة للعميل' },
              { type: 'points', label: 'محتوى CoA الأساسي', items: [
                { text: 'رقم الدفعة وتاريخ الإنتاج والانتهاء', good: true },
                { text: 'نتائج جميع الاختبارات مقابل المواصفات', good: true },
                { text: 'توقيع مسؤول الجودة المفوّض', good: true },
              ]},
              { type: 'quote', text: 'لا إفراج بدون CoA مكتملة وموقعة — هذا شرط GMP غير قابل للتفاوض' }
            ]
          }
        ]
      }
    ]
  }
};

// ═══════════════════════════════════════════
// Poster-Style Slide Renderer
// ═══════════════════════════════════════════

const PosterSlide = ({ slide, course, unitNumber, slideIndex, total }) => {
  const c = course.color;
  const cl = course.colorLight;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      fontFamily: "'Cairo', 'Inter', sans-serif",
      direction: 'rtl',
      border: `2px solid ${c}22`,
      minHeight: '500px',
    }}>
      {/* Header Strip */}
      <div style={{
        background: `linear-gradient(135deg, ${c}, ${c}cc)`,
        padding: '18px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginBottom: '4px' }}>
            UNIT {unitNumber} — SLIDE {slideIndex + 1}/{total}
          </div>
          <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '800', margin: 0, lineHeight: 1.3 }}>
            {slide.title}
          </h2>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginTop: '4px' }}>
            {slide.subtitle}
          </div>
        </div>
        <div style={{ textAlign: 'left', fontSize: '0.65rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, whiteSpace: 'nowrap' }}>
          <div>★ Course: {course.course}</div>
          <div>★ Instructor: {course.instructor}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {slide.sections.map((section, i) => (
          <SectionBlock key={i} section={section} color={c} colorLight={cl} index={i} />
        ))}
      </div>
    </div>
  );
};

const SectionBlock = ({ section, color, colorLight, index }) => {
  const circleNum = ['①','②','③','④','⑤','⑥'][index] || '•';

  if (section.type === 'definition') return (
    <div style={{ background: colorLight, borderRadius: '12px', padding: '14px 18px', borderRight: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.1rem' }}>{circleNum}</span>
        <span style={{ fontWeight: '700', color: color, fontSize: '0.9rem' }}>{section.label}</span>
      </div>
      <p style={{ margin: 0, color: '#1e293b', lineHeight: 1.7, fontSize: '0.9rem' }}>{section.text}</p>
    </div>
  );

  if (section.type === 'points') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.1rem' }}>{circleNum}</span>
        <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', textDecoration: 'underline', textDecorationColor: color }}>{section.label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '24px' }}>
        {section.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ color: item.good ? '#10b981' : '#ef4444', fontWeight: '700', fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>
              {item.good ? '✓' : '✗'}
            </span>
            <span style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === 'steps') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.1rem' }}>{circleNum}</span>
        <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', textDecoration: 'underline', textDecorationColor: color }}>{section.label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '24px' }}>
        {section.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{
              minWidth: '22px', height: '22px', borderRadius: '50%',
              background: color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.65rem', fontWeight: '800', flexShrink: 0, marginTop: '2px'
            }}>{i + 1}</span>
            <span style={{ color: '#334155', fontSize: '0.875rem', lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === 'compare') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.1rem' }}>{circleNum}</span>
        <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', textDecoration: 'underline', textDecorationColor: color }}>{section.label}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingRight: '8px' }}>
        <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '10px 12px', border: '1px solid #bbf7d0' }}>
          <div style={{ color: '#10b981', fontWeight: '700', fontSize: '0.78rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>👍</span> صحيح
          </div>
          {section.good.map((g, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
              <span style={{ color: '#166534', fontSize: '0.8rem', lineHeight: 1.5 }}>{g}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fef2f2', borderRadius: '10px', padding: '10px 12px', border: '1px solid #fecaca' }}>
          <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '0.78rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>👎</span> خاطئ
          </div>
          {section.bad.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
              <span style={{ color: '#ef4444', fontWeight: '700' }}>✗</span>
              <span style={{ color: '#991b1b', fontSize: '0.8rem', lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (section.type === 'classify') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.1rem' }}>{circleNum}</span>
        <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', textDecoration: 'underline', textDecorationColor: color }}>{section.label}</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingRight: '8px' }}>
        {section.items.map((item, i) => (
          <div key={i} style={{
            flex: '1', minWidth: '100px',
            background: `${item.color}11`,
            border: `2px solid ${item.color}44`,
            borderRadius: '10px', padding: '10px',
            textAlign: 'center',
          }}>
            <div style={{ color: item.color, fontWeight: '800', fontSize: '0.8rem', marginBottom: '4px' }}>{item.label}</div>
            <div style={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.4 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (section.type === 'quote') return (
    <div style={{
      background: `linear-gradient(135deg, ${color}11, ${color}05)`,
      border: `1px dashed ${color}66`,
      borderRadius: '10px', padding: '12px 16px',
      marginTop: '4px',
    }}>
      <div style={{ color: color, fontWeight: '700', fontSize: '0.78rem', marginBottom: '4px' }}>💡 Key Takeaway</div>
      <p style={{ margin: 0, color: '#1e293b', fontWeight: '600', fontSize: '0.875rem', lineHeight: 1.6, fontStyle: 'italic' }}>
        {section.text}
      </p>
    </div>
  );

  return null;
};

// ═══════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════

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
  const isFirst = currentUnit === 0 && currentSlide === 0;

  const goNext = () => {
    if (currentSlide < unit.slides.length - 1) setCurrentSlide(s => s + 1);
    else if (currentUnit < course.units.length - 1) { setCurrentUnit(u => u + 1); setCurrentSlide(0); }
  };

  const goPrev = () => {
    if (currentSlide > 0) setCurrentSlide(s => s - 1);
    else if (currentUnit > 0) { setCurrentUnit(u => u - 1); setCurrentSlide(course.units[currentUnit - 1].slides.length - 1); }
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Cairo', 'Inter', sans-serif", maxWidth: '860px', margin: '0 auto', padding: '16px' }}>

      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button onClick={onBack} style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)',
          borderRadius: '10px', padding: '8px 16px', cursor: 'pointer',
          color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.9rem',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>← رجوع</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1rem' }}>
            {course.icon} {course.title}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {unit.title}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>التقدم في الكورس</span>
          <span style={{ fontWeight: '700', color: course.color }}>{progress}%</span>
        </div>
        <div style={{ height: '5px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${course.color}, ${course.color}aa)`, borderRadius: '4px', transition: 'width 0.4s' }} />
        </div>
      </div>

      {/* Poster Slide */}
      <PosterSlide
        slide={slide}
        course={course}
        unitNumber={unit.number}
        slideIndex={currentSlide}
        total={unit.slides.length}
      />

      {/* Unit Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '14px 0', justifyContent: 'center' }}>
        {course.units.map((u, i) => (
          <button key={i} onClick={() => { setCurrentUnit(i); setCurrentSlide(0); }}
            style={{
              padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer',
              border: `2px solid ${i === currentUnit ? course.color : 'var(--border-color)'}`,
              background: i === currentUnit ? `${course.color}22` : 'transparent',
              color: i === currentUnit ? course.color : 'var(--text-secondary)',
              fontWeight: i === currentUnit ? '700' : '400', transition: 'all 0.2s',
            }}>
            {u.number}. {u.title}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <button onClick={goPrev} disabled={isFirst} style={{
          padding: '11px 24px', borderRadius: '12px',
          border: '2px solid var(--border-color)', background: 'var(--bg-card)',
          color: 'var(--text-primary)', cursor: isFirst ? 'not-allowed' : 'pointer',
          opacity: isFirst ? 0.4 : 1, fontWeight: '600', fontSize: '0.9rem',
        }}>→ السابق</button>

        <div style={{ display: 'flex', gap: '5px' }}>
          {unit?.slides.map((_, i) => (
            <div key={i} onClick={() => setCurrentSlide(i)} style={{
              width: i === currentSlide ? '20px' : '7px', height: '7px',
              borderRadius: '4px', cursor: 'pointer',
              background: i === currentSlide ? course.color : 'var(--border-color)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {isLastSlide ? (
          <button onClick={onStartQuiz} style={{
            padding: '11px 24px', borderRadius: '12px', border: 'none',
            background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
            color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
            boxShadow: `0 4px 15px ${course.color}44`,
          }}>🎯 ابدأ الاختبار</button>
        ) : (
          <button onClick={goNext} style={{
            padding: '11px 24px', borderRadius: '12px', border: 'none',
            background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)`,
            color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
          }}>التالي ←</button>
        )}
      </div>
    </div>
  );
}
