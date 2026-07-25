// Full set of questions for Demo Mode, matching the Intermediate expansion.
// These are extracted from content_new.js and categorized by unitId.

const demoQuestions = {
    // --- NMPB ---
    'nmpb-reg': [
        { _id: 'nmpb_q1', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'ما هو الدور الأساسي للمجلس القومي للأدوية والسموم (NMPB)؟', en: 'What is t[...]' },
        { _id: 'nmpb_q2', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'أي من الوثائق التالية تُعد مطلباً أساسياً لتسجيل ملف منتج (Dossier) �[...]' },
        { _id: 'nmpb_q3', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'ماذا يختصر مصطلح SMF الذي يقدمه المصنع للمجلس؟', en: 'What does the acronym SMF s[...]' },
        { _id: 'nmpb_q4', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'تفتيش الـ GMP الذي يقوم به المجلس يهدف إلى:', en: 'The GMP inspection conducted by NM[...]' },
        { _id: 'nmpb_q5', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'حسب لوائح السودان، ما هي الجهة المسؤولة عن تسعير الأدوية؟', en: 'Acc[...]' },
        { _id: 'nmpb_q6', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'ما هو الملف الفني المطلوب تقديمه لتسجيل الدواء وفق المعايير الع[...]' },
        { _id: 'nmpb_q7', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'ماذا يعني مصطلح "الأدوية الأساسية" (Essential Medicines) في السياسة الدوا�[...]' },
        { _id: 'nmpb_q8', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'اليقظة الصيدلانية (Pharmacovigilance) في المجلس تهدف إلى:', en: 'Pharmacovigilance at[...]' },
        { _id: 'nmpb_q9', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'أي مما يلي مسموح للمجلس القيام به في حال ثبت وجود خلل جودة في تشغ[...]' },
        { _id: 'nmpb_q10', unitId: 'nmpb-reg', type: 'mcq', questionText: { ar: 'ما هي متطلبات بطاقة البيان (Labeling) للأدوية في السودان؟', en: 'What are th[...]' },
        { _id: 'nmpb_tf1', unitId: 'nmpb-reg', type: 'tf', questionText: { ar: 'هل يتولى المجلس القومي للأدوية والسموم مسؤولية تسجيل الأدوية ا�[...]' },
        { _id: 'nmpb_tf2', unitId: 'nmpb-reg', type: 'tf', questionText: { ar: 'يمكن استيراد الأدوية للسودان دون الحصول على إذن استيراد من المج[...]' },
        { _id: 'nmpb_tf3', unitId: 'nmpb-reg', type: 'tf', questionText: { ar: 'تعتبر شهادة الـ Free Sale Certificate مطلباً إضافياً يثبت تداول المنتج في[...]' },
        { _id: 'nmpb_fill1', unitId: 'nmpb-reg', type: 'fill', questionText: { ar: 'الاختصار للهيئة الرقابية السودانية للأدوية هو الـ [____].', en: 'The [...]' },
        { _id: 'nmpb_fill2', unitId: 'nmpb-reg', type: 'fill', questionText: { ar: 'الملف الفني الموحد الذي يقدمه المصنع لتسجيل الدواء يسمى [___].', [...]' },
    ],
    // --- BASIC UNITS ---
    'gmp-intro': [
        { _id: 'gmp_q1', unitId: 'gmp-intro', type: 'mcq', questionText: { ar: 'من المسؤول عن ضمان الجودة (QA) في المصنع؟', en: 'Who is responsible for QA in the fact[...]' },
        { _id: 'gmp_tf1', unitId: 'gmp-intro', type: 'tf', questionText: { ar: 'هل ضمان الجودة (QA) هو جزء من مراقبة الجودة (QC)؟', en: 'Is Quality Assurance (QA) a[...]' },
    ],
    'glp-basics': [
        { _id: 'glp_q1', unitId: 'glp-basics', type: 'mcq', questionText: { ar: 'من هو الشخص المسؤول بالكامل عن السيطرة الفنية للدراسة في الـ GLP�[...]' },
    ],
    'iso-17025': [
        { _id: 'iso_q1', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'ما هو التركيز الرئيسي للإصدار الحديث ISO 17025:2017 مقارنة بالإصدارات[...]' },
        { _id: 'iso_q2', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'حسب البند 4 (Clause 4)، ما هي المبادئ الأساسية التي تحكم عمل المختبر؟[...]' },
        { _id: 'iso_q3', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'التسلسل المترولوجي (Metrological Traceability) يعني أن نتائج القياس يجب أن ت[...]' },
        { _id: 'iso_q4', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'قاعدة القرار (Decision Rule) المتبعة في تقديم بيانات المطابقة (Pass/Fail) ت�[...]' },
        { _id: 'iso_q5', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'ما هو الغرض من مراجعة الإدارة (Management Review) في مختبرات الجودة؟', en: 'What [...]' },
        { _id: 'iso_q6', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'أي بند يغطي متطلبات التحقق من صحة الطرق (Method Validation) والتعامل مع ع[...]' },
        { _id: 'iso_q7', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'عند وجود حالة عدم مطابقة (Non-Conformances)، ما هو الإجراء الأكثر أهمية �[...]' },
        { _id: 'iso_q8', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'ما هو الهدف من التفتيش الخارجي (External Audit) لمرافق المختبر؟', en: 'What i[...]' },
        { _id: 'iso_audit_q1', unitId: 'iso-17025', type: 'mcq', questionText: { ar: 'أثناء التدقيق، إذا سأل المقيم الموظف: "كيف تضمن أنك تستخدم أح[...]' },
        { _id: 'iso_tf1', unitId: 'iso-17025', type: 'tf', questionText: { ar: 'يسمح نظام ISO 17025 للمختبر بمنح شهادات الاعتماد لمختبرات أخرى.', en: '[...]' },
        { _id: 'iso_tf2', unitId: 'iso-17025', type: 'tf', questionText: { ar: 'حسب البند 8، يمكن للمختبر الذي يحمل شهادة ISO 9001 كقاعدة أن يفي بمت[...]' },
        { _id: 'iso_tf3', unitId: 'iso-17025', type: 'tf', questionText: { ar: 'الحيادية تعني أن يتم اتخاذ قرارات الاختبار بناءً على الأدلة الع[... ]' },
        { _id: 'iso_fill1', unitId: 'iso-17025', type: 'fill', questionText: { ar: 'العملية التي تضمن أن نتيجة القياس مرتبطة بالنظام الدولي (SI) تُ[...]' },
        { _id: 'iso_fill2', unitId: 'iso-17025', type: 'fill', questionText: { ar: 'التحقيق في الأسباب الجذرية لمنع تكرار الخطأ يندرج تحت نظام ال[...]' },
    ],
    'ich-guidelines': [
        { _id: 'ich_q1', unitId: 'ich-guidelines', type: 'mcq', questionText: { ar: 'أي قسم في ICH يركز على اختبارات الثبات والشوائب؟', en: 'Which ICH section [...]' },
    ],
    'validation-qualification': [
        { _id: 'vq_q1', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'ما هو المفهوم الأساسي للتحقق (Validation) في الصناعة الدوائية[...]' },
        { _id: 'vq_q2', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'ماذا يعني تأهيل التصميم (DQ)?', en: 'What does Design Qualification (DQ) mean?' },
        { _id: 'vq_q3', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'ما هي المرحلة التي تتأكد من أن المعدة قد تم توريدها وترك[...]' },
        { _id: 'vq_q4', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'أثناء تأهيل التشغيل (OQ)، يتم التحقق من:', en: 'During Operational Qualif[...]' },
        { _id: 'vq_q5', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'تأهيل الأداء (PQ) يختلف عن (OQ) بأنه:', en: 'Performance Qualification (PQ) diff[...]' },
        { _id: 'vq_q6', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'ما هو الهدف الرئيسي من "التحقق من التنظيف" (Cleaning Validation)?' },
        { _id: 'vq_q7', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'في التحقق من التنظيف، ماذا يعني مصطلح (Worst-Case Scenario)?', en: 'In[...]' },
        { _id: 'vq_q8', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'من هو المسؤول الأساسي في المصنع عن الموافقة على خطة التح[...]' },
        { _id: 'vq_q9', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'كيف يمكننا التحقق من أن طريقة التحليل المخبري (Analytical Method[...]' },
        { _id: 'vq_q10', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'التأهيل الرجعي (Retrospective Validation) يعني:', en: 'Retrospective Validation mean[...]' },
        { _id: 'vq_cs_1', unitId: 'validation-qualification', type: 'mcq', questionText: { ar: 'بناءً على دراسة الحالة لماكينة الـ Blister، لماذا فشلت الم[...]' },
        { _id: 'vq_tf1', unitId: 'validation-qualification', type: 'tf', questionText: { ar: 'هل يمكن الاستغناء عن الـ IQ إذا قمنا للتو بشراء معدة حديث[...]' },
        { _id: 'vq_tf2', unitId: 'validation-qualification', type: 'tf', questionText: { ar: 'يعتبر التحقق المستمر من العمليات (CPV) منهجاً حديثاً يضمن [...]' },
        { _id: 'vq_fill1', unitId: 'validation-qualification', type: 'fill', questionText: { ar: 'الوثيقة الرئيسية التي تصف استراتيجية التحقق لكامل ال[...]' },
        { _id: 'vq_fill2', unitId: 'validation-qualification', type: 'fill', questionText: { ar: 'التأهيل الذي يثبت أن المعدة تم تركيبها بشكل صحيح وفق ا[...]' },
    ],
    // --- INTERMEDIATE UNITS ---
    'adv-gmp': [
        { _id: 'adv_gmp_q1', unitId: 'adv-gmp', type: 'mcq', questionText: { ar: 'ما هو الفرق الجوهري بين ضمان الجودة (QA) ونظام الجودة الصيدلاني ([...]' },
        { _id: 'adv_gmp_q3', unitId: 'adv-gmp', type: 'mcq', questionText: { ar: 'ماذا يعني مصطلح "Data Integrity" (نزاهة البيانات) حسب معيار ALCOA+؟', en: 'What[...]' },
    ],
    'adv-glp': [
        { _id: 'adv_glp_q1', unitId: 'adv-glp', type: 'mcq', questionText: { ar: 'في حال فشل العينة (OOS)، ما هو الإجراء الصحيح في المرحلة الأولى م�[...]' },
    ],
    'adv-validation': [
        { _id: 'adv_val_q1', unitId: 'adv-validation', type: 'mcq', questionText: { ar: 'حسب إرشادات 2011، التحقق من العملية (Process Validation) أصبح يتكون من[...]' },
    ],
    'adv-qrm': [
        { _id: 'adv_qrm_q1', unitId: 'adv-qrm', type: 'mcq', questionText: { ar: 'في تحليل المخاطر (FMEA)، ما هي العناصر الثلاثة المستخدمة لحساب رق[...]' },
    ],
    'adv-gdp': [
        { _id: 'adv_gdp_q1', unitId: 'adv-gdp', type: 'mcq', questionText: { ar: 'ما هو المبدأ الأساسي لشحن أدوية "Cold Chain" (سلسلة التبريد)؟', en: 'What i[...]' },
    ],
    'data-integrity': [
        { _id: 'di_q1', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'ماذا يعنى اختصار ALCOA في سياق سلامة البيانات؟', en: 'What does the acronym AL[...]' },
        { _id: 'di_q2', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'أي من مبادئ ALCOA يضمن أننا نعرف "من" قام بالعملية؟', en: 'Which ALCOA princi[...]' },
        { _id: 'di_q3', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'التوثيق "المعاصر" (Contemporaneous) يعني:', en: 'Contemporaneous documentation means:' }, opti[...]' },
        { _id: 'di_q4', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'ما هو "سجل المراجعة" (Audit Trail)؟', en: 'What is an "Audit Trail"?' },
        { _id: 'di_q5', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'حسب مبدأ ALCOA++، ماذا تعني كلمة Complete (كامل)؟', en: 'According to ALCOA++, what doe[...]' },
        { _id: 'di_q6', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'لماذا يُمنع استخدام حسابات مستخدمين مشتركة (Shared Accounts) في الأن�[...]' },
        { _id: 'di_q7', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'ماذا نفعل في حال أخطأنا في كتابة معلومة في سجل ورقي حسب قواعد �[...]' },
        { _id: 'di_q8', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'في نظام حوكمة البيانات، من المسؤول عن سلامة البيانات في المصن[...]' },
        { _id: 'di_q9', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'ما هو الفرق بين النسخ الاحتياطي (Backup) والأرشفة (Archiving)؟', en: 'What is[...]' },
        { _id: 'di_q10', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'حسب مبدأ ALCOA++، ماذا تعني كلمة Complete (كامل)؟', en: 'According to ALCOA++, what doe[...]' },
        { _id: 'di_cs_1', unitId: 'data-integrity', type: 'mcq', questionText: { ar: 'بناءً على دراسة حالة تزوير الـ HPLC، ما هو الخرق الأساسي الذي ا[...]' },
        { _id: 'di_tf1', unitId: 'data-integrity', type: 'tf', questionText: { ar: 'هل يسمح مبدأ الـ original باستخدام النسخ المصورة بدلاً من السجلات[... ]' },
        { _id: 'di_tf2', unitId: 'data-integrity', type: 'tf', questionText: { ar: 'يعتبر "التوثيق المسبق" (Pre-dating) للمهام قبل تنفيذها ممارسة مقبول[...]' },
        { _id: 'di_fill1', unitId: 'data-integrity', type: 'fill', questionText: { ar: 'مبدأ الـ [____] في ALCOA يعني أن البيانات يجب أن تكون مقروءة وواض[...]' },
        { _id: 'di_fill2', unitId: 'data-integrity', type: 'fill', questionText: { ar: 'سجل المراجعة الإلكتروني الذي يمنع المسح أو التعديل الخفي ي�[...]' },
    ],
    'qrm-basics': [
        { _id: 'qr_q1', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'ما هو المبدأ الأول لإدارة مخاطر الجودة (QRM) حسب ICH Q9؟', en: 'What is the fir[...]' },
        { _id: 'qr_q2', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'في أداة FMEA، ماذا يمثل الـ RPN؟', en: 'In FMEA, what does RPN stand for?' }, options: { ar: ['�[...]' },
        { _id: 'qr_q3', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'كيف يتم حساب الـ RPN؟', en: 'How is RPN calculated?' },
        { _id: 'qr_q4', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'أي عنصر في RPN يقيس مدى سهولة اكتشاف الخلل قبل وصوله للمريض؟', en: 'W[...]' },
        { _id: 'qr_q5', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'ما هو الغرض من "مصفوفة المخاطر" (Risk Matrix)؟', en: 'What is the purpose of a Risk Matrix[...]' },
        { _id: 'qr_q6', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'تقليل المخاطر (Risk Reduction) يهدف إلى:', en: 'Risk Reduction aims to:' }, options: { ar: ['ت�[...]' },
        { _id: 'qr_q7', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'متى يجب إجراء "مراجعة المخاطر" (Risk Review)؟', en: 'When should a Risk Review be conducte[...]' },
        { _id: 'qr_q8', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'أي من الأدوات التالية تستخدم لتحويل البيانات النوعية إلى أرقام[... ]' },
        { _id: 'qr_q9', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'ما هو الغرض من التحليل؟', en: 'What is the purpose of analysis[...]' },
        { _id: 'qr_q10', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'من هم الأشخاص الذين يشاركون عادة في فريق تقييم المخاطر (QRM Team)?', en: 'W[...]' },
        { _id: 'qr_cs_1', unitId: 'qrm-basics', type: 'mcq', questionText: { ar: 'في دراسة حالة التلوث المتبادل، لماذا كان الـ RPN مرتفعاً في الب�[...]' },
        { _id: 'qr_tf1', unitId: 'qrm-basics', type: 'tf', questionText: { ar: 'هل يجدر تطبيق تدابير اضافية؟', en: 'Is it necessary to apply additional measures?' },
        { _id: 'qr_tf2', unitId: 'qrm-basics', type: 'tf', questionText: { ar: 'يجب أن يكون الجهد والتوثيق في عملية إدارة المخاطر متناسباً مع م[...]' },
        { _id: 'qr_fill1', unitId: 'qrm-basics', type: 'fill', questionText: { ar: 'الأداة التي تستخدم لتحديد نقاط التحكم الحرجة في الصناعة تسمى[... ]' },
        { _id: 'qr_fill2', unitId: 'qrm-basics', type: 'fill', questionText: { ar: 'المبدأ الأساسي في QRM هو أن حماية الـ [_____] هي الأولوية القصوى.' },
    ],
    'gdp-basics': [
        { _id: 'gdp_q1', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'ما هو المبدأ الأساسي لشحن أدوية "Cold Chain" (سلسلة التبريد)؟', en: 'What i[...]' },
        { _id: 'gdp_q2', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'ماذا تعني "ممارسات التوزيع الجيد" (GDP)؟', en: 'What does Good Distribution Practice ([...]' },
        { _id: 'gdp_q3', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'ما هي درجة الحرارة المعتادة لتخزين "الأدوية المبردة"؟', en: 'What is t[...]' },
        { _id: 'gdp_q4', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'ما هو دور الـ Data Logger في الشحنات الدوائية المبردة؟', en: 'What is the role [...]' },
        { _id: 'gdp_q5', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'أي مما يلي يعتبر علامة محتملة على "تزوير الدواء"؟', en: 'Which of the follo[...]' },
        { _id: 'gdp_q6', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'مبدأ FIFO في المستودعات يعني:', en: 'The FIFO principle in warehouses means:' }, options: { ar[...]' },
        { _id: 'gdp_q7', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'يُعرّف "التتبع" (Traceability) في الـ GDP بأنه:', en: 'Traceability in GDP is defined as:' },[...]' },
        { _id: 'gdp_q8', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'ما هو الإجراء الصحيح عند اكتشاف دواء مشبوه بأنه مزور؟', en: 'What is t[...]' },
        { _id: 'gdp_q9', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'خريطة التوزيع الحراري للمستودع (Temperature Mapping) تهدف إلى:', en: 'Warehouse [...]' },
        { _id: 'gdp_q10', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'لماذا يُعتبر النقل الجوي والبري أحياناً خطراً على سلسلة التبر[... ]' },
        { _id: 'gdp_cs_1', unitId: 'gdp-basics', type: 'mcq', questionText: { ar: 'في دراسة حالة الأنسولين، لماذا تقرر إتلاف الشحنة رغم أنها قضت[...]' },
        { _id: 'gdp_tf1', unitId: 'gdp-basics', type: 'tf', questionText: { ar: 'يسمح بتخزين الأدوية مع المواد الغذائية في نفس الثلاجة إذا كانت[... ]' },
        { _id: 'gdp_tf2', unitId: 'gdp-basics', type: 'tf', questionText: { ar: 'يجب أن يكون لدى جميع الموزعين نظام للجرد يضمن عدم انتهاء صلاحي�[...]' },
        { _id: 'gdp_fill1', unitId: 'gdp-basics', type: 'fill', questionText: { ar: 'اختصار المبدأ الذي يضمن خروج الأدوية الأقرب للانتهاء أولاً �[...]' },
        { _id: 'gdp_fill2', unitId: 'gdp-basics', type: 'fill', questionText: { ar: 'درجة حرارة الغرفة الخاضعة للرقابة (Controlled Room Temp) هي [___] درجة مئ[...]' },
    ],
    'cleaning-validation': [
        { _id: 'cv_q1', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: 'ما هو المبدأ الأساسي للتحقق من التنظيف؟', en: 'What is the primary princi[...]' },
        { _id: 'cv_q2', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: 'ماذا يعني مصطلح "Worst-Case Scenario" في التحقق من التنظيف؟', en: 'What doe[...]' },
        { _id: 'cv_q3', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: 'أي من طرق أخذ العينات تعتبر الأكثر دقة للوصول للمناطق الصع[...]' },
        { _id: 'cv4', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_q5', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: 'ما هو الهدف من طريقة "Visually Clean"؟', en: 'What is the goal of the "Visually Clean" c[...]' },
        { _id: 'cv_q6', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_q7', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_q8', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_q9', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_q10', unitId: 'cleaning-validation', type: 'mcq', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_tf1', unitId: 'cleaning-validation', type: 'tf', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_tf2', unitId: 'cleaning-validation', type: 'tf', questionText: { ar: '...', en: '...' } },
        { _id: 'cv_fill1', unitId: 'cleaning-validation', type: 'fill', questionText: { ar: '...', en: '...' } },
    ]
};

// Add alias so demos and frontend requests for "method-validation" return useful demo data
// This maps 'method-validation' to the existing 'validation-qualification' demo set.
// Placing this before flattening ensures method-validation questions are included in flatQuestions.
demoQuestions['method-validation'] = demoQuestions['validation-qualification'];

// Flatten all categories into a single array for easier lookup by _id if needed
const flatQuestions = Object.values(demoQuestions).flat();

// In-memory storage for demo mode
const demoUsers = new Map();

const DemoDB = {
  users: demoUsers,
  
  async findUserById(id) {
    let user = demoUsers.get(id);
    if (!user && id) {
      user = {
        userId: id,
        email: 'demo@sudan-quality.com',
        displayName: 'Quality Member (Demo)',
        xp: 0,
        level: 1,
        badges: [],
        stats: { totalQuizzes: 0, perfectScores: 0 },
        progress: { unitScores: {}, unitStates: {}, certificates: [], completedUnits: [] },
        createdAt: new Date()
      };
      demoUsers.set(id, user);
    }
    return user;
  },

  async findUserByEmail(email) {
    for (let user of demoUsers.values()) {
      if (user.email === email) return user;
    }
    return null;
  },

  async createUser(userData) {
    const id = userData.userId || 'demo_' + Date.now();
    const user = { 
      ...userData, 
      _id: id,
      xp: 0,
      level: 1,
      badges: [],
      stats: { totalQuizzes: 0, perfectScores: 0 },
      progress: { unitScores: {}, unitStates: {}, certificates: [], completedUnits: [] },
      createdAt: new Date()
    };
    demoUsers.set(id, user);
    return user;
  },

  async updateUser(id, data) {
    const user = await this.findUserById(id);
    if (!user) return null;
    Object.assign(user, data);
    demoUsers.set(id, user);
    return user;
  },

  async awardCertificate(id, certData) {
    const user = await this.findUserById(id);
    if (!user) return null;
    const cert = { _id: 'cert_' + Date.now(), ...certData, issueDate: new Date() };
    if (!user.progress.certificates) user.progress.certificates = [];
    user.progress.certificates.push(cert);
    demoUsers.set(id, user);
    return cert;
  },

  async getRandomQuestions(unitId, count = 10) {
    const questions = demoQuestions[unitId] || [];
    return [...questions].sort(() => 0.5 - Math.random()).slice(0, count);
  },

  async getRotatedQuestions(unitId, count = 10, excludeIds = []) {
    const questions = demoQuestions[unitId] || [];
    let available = questions.filter(q => !excludeIds.includes(q._id));
    if (available.length < count) return [...questions].sort(() => 0.5 - Math.random()).slice(0, count);
    return available.sort(() => 0.5 - Math.random()).slice(0, count);
  }
};

module.exports = {
  demoQuestions: flatQuestions,
  DemoDB,
  getQuestionsByUnit: (unitId, count = 10, excludeIds = []) => {
    const questions = demoQuestions[unitId] || [];
    let available = questions.filter(q => !excludeIds.includes(q._id));
    
    if (available.length < count) {
      if (questions.length <= count) {
        return [...questions].sort(() => Math.random() - 0.5);
      }
      return [...questions].sort(() => Math.random() - 0.5).slice(0, count);
    }
    
    return available.sort(() => Math.random() - 0.5).slice(0, count);
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
