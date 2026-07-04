-- Insert missing new unit questions into Supabase
-- Run this in the Supabase SQL Editor

-- cleaning-validation questions
INSERT INTO questions ("unitId", question, options, "correctAnswer", "correctAnswers", type, explanation) VALUES
('cleaning-validation', 'ما هو الاختصار الكامل لـ MACO؟', '["أقصى انتقال مسموح (Maximum Allowable Carryover)","الحد الأدنى لتنظيف الأجهزة","متوسط التلوث الكيميائي","مستوى القبول الأدنى"]', '0', NULL, 'multiple', NULL),
('cleaning-validation', 'أي من طرق التحليل التالية أكثر تحديداً (Specific) للدواء المستهدف في التحقق من التنظيف؟', '["TOC","HPLC","الفحص البصري","قياس الـ pH"]', '1', NULL, 'multiple', NULL),
('cleaning-validation', 'ما الفرق الجوهري بين DHT و CHT؟', '["DHT = وقت الإنتاج / CHT = وقت التعقيم","DHT = أقصى وقت لبقاء المعدة متسخة / CHT = أقصى وقت لبقاءها نظيفة","كلاهما متطابقان","DHT للغسيل اليدوي فقط"]', '1', NULL, 'multiple', NULL),
('cleaning-validation', 'لماذا لا يُقبل معيار الـ 10 ppm لأدوية الأورام (Oncologics) وفق EMA 2014؟', '["لأنها باهظة التكلفة","لأنها شديدة السمية وتستلزم حدود PDE/ADE أصغر بكثير","لأن الـ HPLC لا تستطيع قياسها","لا يوجد قيد خاص بها"]', '1', NULL, 'multiple', NULL),
('cleaning-validation', 'ما الهدف الأساسي من التحقق من التنظيف (Cleaning Validation)؟', '["توفير المياه والمنظفات","إثبات علمياً أن عملية التنظيف قادرة على إزالة البقيا للحد المقبول","تسريع دورة الإنتاج","تدريب موظفي الإنتاج"]', '1', NULL, 'multiple', NULL),
('cleaning-validation', 'ما معنى "Worst-case Product" في سياق التحقق من التنظيف؟', '["الدواء الأغلى في الإنتاج","الدواء الذي يُنتج بأكبر كمية","الدواء الأصعب تنظيفاً بناءً على الذائبية والسمية وصعوبة التنظيف","الدواء الأقدم تاريخ انتهاء صلاحية"]', '2', NULL, 'multiple', NULL),
('cleaning-validation', 'أي طريقة أخذ عينات تغطي المساحة الكاملة لسطح المعدة؟', '["Swab (مسحة)","Rinse (شطف)","الفحص البصري","TOC فقط"]', '1', NULL, 'multiple', NULL),
('cleaning-validation', 'وفق EMA 2014، ما هو المعيار المعتمد لحساب حدود بقايا المنتجات عالية الخطورة؟', '["10 ppm","PDE/ADE","MACO فقط","0.1% من حجم الدفعة"]', '1', NULL, 'multiple', NULL),
('cleaning-validation', 'الفحص البصري للمعدات وحده كافٍ كدليل على نظافتها في التحقق الرسمي من التنظيف.', NULL, 'false', NULL, 'tf', NULL),
('cleaning-validation', 'يجب أن تخضع طرق التحليل المستخدمة في Cleaning Validation هي نفسها للتحقق (Method Validation).', NULL, 'true', NULL, 'tf', NULL),
('cleaning-validation', 'تُطبَّق حدود DHT و CHT فقط على خزانات الإنتاج الكبيرة ولا تشمل الخراطيم والفلاتر.', NULL, 'false', NULL, 'tf', NULL),
('cleaning-validation', 'ما هو Dead Leg في سياق التحقق من التنظيف؟', '["أنبوب مسدود لا تصله السوائل بشكل صحيح ويُشكّل نقطة ساخنة","عامل تنظيف منتهي الصلاحية","خطأ في البرنامج الزمني للتنظيف","منطقة يزيد فيها تركيز المنظف"]', '0', NULL, 'multiple', NULL),
('cleaning-validation', 'ما هو الحد الأساسي الأول المعتمد تقليدياً في حسابات MACO؟', '["PDE/ADE","LD50 للحيوانات","1/1000 من الحد الأدنى للجرعة العلاجية اليومية","10% من حجم التشغيلة"]', '2', NULL, 'multiple', NULL),
('cleaning-validation', 'يجب تحديد خطة أخذ العينات (Sampling Plan) في بروتوكول التحقق قبل بدء الدراسة.', NULL, 'true', NULL, 'tf', NULL),
('cleaning-validation', 'في Swab sampling، ما الذي يجب إثباته قبل الاعتماد على نتائج المسحة؟', '["لون المسحة ونوعها","وزن المسحة الجافة","نسبة الاسترداد (Recovery %)","درجة حرارة تخزين المسحة"]', '2', NULL, 'multiple', NULL);

-- equipment-qualification questions
INSERT INTO questions ("unitId", question, options, "correctAnswer", "correctAnswers", type, explanation) VALUES
('equipment-qualification', 'ما الترتيب الصحيح الإلزامي لمراحل التأهيل؟', '["IQ → OQ → DQ → PQ","DQ → IQ → OQ → PQ","OQ → IQ → DQ → PQ","PQ → OQ → IQ → DQ"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'ما الهدف الأساسي من إعداد URS قبل شراء أي جهاز؟', '["إعداد ميزانية الشراء","تحديد متطلبات المستخدم ومواصفات الجهاز المطلوبة","تدريب موظفي التشغيل","اختبار البرمجيات فقط"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'في أي مرحلة من مراحل التأهيل يُستخدَم المنتج الفعلي لأول مرة؟', '["DQ","IQ","OQ","PQ"]', '3', NULL, 'multiple', NULL),
('equipment-qualification', 'ما الفرق الرئيسي بين FAT و SAT؟', '["FAT في الموقع و SAT في مصنع المورد","FAT في مصنع المورد قبل الشحن و SAT في موقع العميل بعد التركيب","هما نفس الاختبار في أوقات مختلفة","SAT اختياري دائماً"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'ماذا يثبت IQ تحديداً ولا يتجاوز نطاقه؟', '["أن الجهاز يؤدي وظيفته بكفاءة","أن الجهاز ركِّب وفق المواصفات التقنية","أن الجهاز ينتج منتجاً مطابقاً للمواصفات","أن التصميم ملائم لمتطلبات GMP"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'متى يجب مراجعة أو إعادة التأهيل؟', '["كل عشر سنوات بشكل آلي","عند أي تعديل أو إصلاح جوهري وفق نظام Change Control","فقط عند طلب هيئة التفتيش","لا يُعاد إذا كان التأهيل الأول ناجحاً"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'ما الهدف المحدد من OQ مقارنةً بـ IQ؟', '["التحقق من التركيب الفيزيائي","التحقق من الأداء مع المنتج الفعلي","التحقق من أن الجهاز يعمل ضمن الحدود التشغيلية المحددة","مراجعة وثائق التصميم"]', '2', NULL, 'multiple', NULL),
('equipment-qualification', 'ما الذي يعنيه الارتباط المتسلسل (Metrological Traceability) في برنامج المعايرة؟', '["إجراء المعايرة داخلياً فقط","ربط قياسات الجهاز بمعايير SI الدولية عبر سلسلة موثقة غير منقطعة","الاقتصار على أجهزة من مورد واحد","إجراء المعايرة مرة واحدة فقط طوال عمر الجهاز"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'ما هو Impact Assessment في سياق إعادة التأهيل؟', '["دراسة الأثر البيئي للجهاز","مراجعة الأثر المحتمل لأي تغيير على صحة التأهيل القائم","تقييم تأثير الجهاز على المريض","تقرير مالي لتكلفة إعادة التأهيل"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'أي من الوثائق التالية يجب مراجعتها خلال مرحلة IQ؟', '["سجلات المبيعات وفواتير الشراء","مخططات P&ID والرسومات التقنية وشهادات المعايرة","قوائم أسعار قطع الغيار","نتائج التجارب السريرية للمنتج"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'ما الفرق الجوهري بين Qualification (تأهيل) و Validation (تحقق)؟', '["لا فرق بينهما في الصناعة الدوائية","التأهيل للمعدات والمرافق / التحقق للعمليات والطرق التحليلية","التأهيل للعمليات / التحقق للمعدات","التحقق أسهل وأقصر من التأهيل"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'لماذا يُجرى اختبار Worst-case تحديداً في مرحلة OQ؟', '["لاختبار مدى تحمل الجهاز قبل الكسر","لإثبات أن الجهاز يعمل بشكل صحيح في أصعب ظروف التشغيل المحتملة","لتوفير وقت الاختبارات المتعددة","لإرضاء متطلبات هيئات التفتيش فقط"]', '1', NULL, 'multiple', NULL),
('equipment-qualification', 'نجاح FAT في مصنع المورد يُغني عن إجراء IQ و OQ بعد التركيب في الموقع.', NULL, 'false', NULL, 'tf', NULL),
('equipment-qualification', 'يمكن البدء بمرحلة PQ قبل إكمال OQ بنجاح وتوثيقه.', NULL, 'false', NULL, 'tf', NULL),
('equipment-qualification', 'المعايرة الدورية لأجهزة القياس الحرجة جزء أساسي من الحفاظ على صلاحية التأهيل.', NULL, 'true', NULL, 'tf', NULL),
('equipment-qualification', 'يُجرى DQ (تأهيل التصميم) فقط بعد شراء الجهاز وتركيبه في الموقع.', NULL, 'false', NULL, 'tf', NULL),
('equipment-qualification', 'مرحلة التأهيل التي تثبت أن الجهاز يعمل ضمن الحدود التشغيلية المحددة دون استخدام المنتج الفعلي تُسمى ___', NULL, '[object Object]', NULL, 'fill', NULL);

-- method-validation questions
INSERT INTO questions ("unitId", question, options, "correctAnswer", "correctAnswers", type, explanation) VALUES
('method-validation', 'ما هو الهدف الأساسي من التحقق من الطريقة التحليلية؟', '["تسريع عملية التحليل المخبري","إثبات أن الطريقة التحليلية مناسبة وموثوقة للغرض المقصود منها","تقليل تكلفة استهلاك المواد الكيميائية","الاستغناء عن أجهزة التحليل القديمة"]', '1', NULL, 'multiple', NULL),
('method-validation', 'أي من المعلمات التالية تقيس قدرة الطريقة التحليلية على إعطاء نتائج تتناسب طردياً مع تركيز المادة الفعالة؟', '["الخطية (Linearity)","الدقة (Accuracy)","التحديد (Specificity)","المتانة (Robustness)"]', '0', NULL, 'multiple', NULL),
('method-validation', 'ما هو الفرق بين LOD و LOQ؟', '["لا يوجد فرق بينهما","LOD هو أقل كمية يمكن كشفها، بينما LOQ هي أقل كمية يمكن قياسها كمياً بدقة","LOD يستخدم للشوائب، و LOQ يستخدم للأسواغات","LOD هو الحد الأقصى و LOQ هو الحد الأدنى"]', '1', NULL, 'multiple', NULL),
('method-validation', 'أي مما يلي يُعبر عن الدقة المتوسطة (Intermediate Precision)؟', '["نفس المحلل ونفس الجهاز في نفس اليوم","تحليل العينة في مختبرين في بلدين مختلفين","محللون مختلفون في نفس المختبر وفي أيام مختلفة","عدم وجود أي تداخل بين الشوائب"]', '2', NULL, 'multiple', NULL),
('method-validation', 'كيف يتم قياس صحة النتائج (Accuracy) عادةً؟', '["عن طريق تغيير درجة حرارة عمود الـ HPLC","عن طريق حساب معامل الارتباط للخطية","من خلال اختبار الاسترداد (Recovery Testing) بإضافة تركيز معروف","من خلال فحص العينة بالعين المجردة"]', '2', NULL, 'multiple', NULL),
('method-validation', 'المتانة (Robustness) تقيم الطريقة التحليلية عند حدوث:', '["تغيرات كبيرة وجوهرية في الطريقة","تغيرات صغيرة متعمدة في معايير الطريقة مثل درجة الحرارة والتدفق","تغير في اسم المادة الفعالة","تغير في نوع الجهاز من HPLC إلى GC"]', '1', NULL, 'multiple', NULL),
('method-validation', 'هل اختبار (Assay) لقوة الدواء يتطلب إثباتاً لـ LOD و LOQ؟', '["نعم، دائماً","لا، يتم إثباتهما فقط لاختبارات الشوائب والبقايا","نعم، لكن LOD فقط","نعم، للمستحضرات الصلبة فقط"]', '1', NULL, 'multiple', NULL),
('method-validation', 'ماذا يسمى الإجراء المتبع عند استخدام مختبر لطريقة تحليلية موجودة مسبقاً في دستور الأدوية (Pharmacopeia)؟', '["Method Validation (تحقق كامل)","Method Verification (إثبات المطابقة)","Method Transfer (نقل الطريقة)","Method Validation Protocol"]', '1', NULL, 'multiple', NULL),
('method-validation', 'أي معامل يؤكد "التحديد" (Specificity) لطريقة الـ HPLC؟', '["انفصال قمة الدواء بوضوح عن قمم الشوائب (Resolution)","الحصول على نسبة استرداد 100%","تكرار الحقن 6 مرات بنجاح","تغير الـ pH بدون تأثير على النتائج"]', '0', NULL, 'multiple', NULL),
('method-validation', 'ماذا يحدث إذا تجاهلت الشركة دراسة "ثبات المحلول" (Solution Stability)؟', '["تحصل على تقييم إيجابي من المفتش","قد تتحلل العينة أو القياسي بمرور الوقت معطية نتائج خاطئة (OOS)","يصبح التحليل أسرع وأقل تكلفة","تزداد الخطية (Linearity) بشكل تلقائي"]', '1', NULL, 'multiple', NULL),
('method-validation', 'التحقق من طرق التحليل (Method Validation) إلزامي فقط للأدوية الجديدة وغير مطلوب للأدوية الجنيسة (Generics).', NULL, 'false', NULL, 'tf', NULL),
('method-validation', 'التكرارية (Repeatability) تعني الحصول على نفس النتائج عند استخدام نفس المحلل لنفس الجهاز في نفس اليوم.', NULL, 'true', NULL, 'tf', NULL),
('method-validation', 'طريقة التحليل الموصوفة بالكامل في دستور الأدوية لا تحتاج إلى أي شكل من أشكال التقييم عند تطبيقها في المختبر.', NULL, 'false', NULL, 'tf', NULL),
('method-validation', 'أقل كمية من المادة يمكن قياسها كمياً بدقة عالية تُسمى حد التحديد الـ ___ (LOQ).', NULL, '[object Object]', NULL, 'fill', NULL);

-- process-validation questions
INSERT INTO questions ("unitId", question, options, "correctAnswer", "correctAnswers", type, explanation) VALUES
('process-validation', 'وفقاً للمفهوم الحديث، التحقق من العملية (Process Validation) يتكون من كم مرحلة أساسية؟', '["مرحلة واحدة","مرحلتين","ثلاث مراحل","خمس مراحل"]', '2', NULL, 'multiple', NULL),
('process-validation', 'ما المقصود بـ CQA؟', '["Control Quality Audit","Critical Quality Attribute","Continuous Quality Assessment","Critical Quantity Approval"]', '1', NULL, 'multiple', NULL),
('process-validation', 'في أي مرحلة من مراحل التحقق من العملية يتم استخدام التحليل الإحصائي المستمر (مثل Control Charts)؟', '["المرحلة 1: Process Design","المرحلة 2: Process Qualification","المرحلة 3: Continued Process Verification (CPV)","في مرحلة الأبحاث الأولية فقط"]', '2', NULL, 'multiple', NULL),
('process-validation', 'المتغيرات التشغيلية التي يتم التحكم بها لضمان جودة المنتج النهائي تُسمى:', '["CQAs","CPPs","CMAs","SOPs"]', '1', NULL, 'multiple', NULL),
('process-validation', 'المرحلة الثانية (Stage 2) من التحقق من العملية تتضمن عادةً إجراء الدفعات التجريبية الناجحة (PPQ)، كم عددها تقليدياً؟', '["دفعة واحدة","دفعتين","3 دفعات","10 دفعات"]', '2', NULL, 'multiple', NULL),
('process-validation', 'ما العلاقة بين CPP و CQA؟', '["لا توجد علاقة بينهما","التحكم في CPP يضمن تحقيق الـ CQA المطلوبة للمنتج","الـ CQA هي متغيرات الماكينة والـ CPP هي خصائص المنتج","كلاهما يُقاس فقط في المختبرات ولا علاقة لهما بالإنتاج"]', '1', NULL, 'multiple', NULL),
('process-validation', 'بمجرد نجاح 3 دفعات في مرحلة الـ PPQ، لا حاجة لمراقبة أداء العملية بعد ذلك.', NULL, 'false', NULL, 'tf', NULL),
('process-validation', 'سمك القرص الدوائي وصلابته تعتبر أمثلة على سمات الجودة الحرجة (CQAs).', NULL, 'true', NULL, 'tf', NULL);

-- hold-time-stability questions
INSERT INTO questions ("unitId", question, options, "correctAnswer", "correctAnswers", type, explanation) VALUES
('hold-time-stability', 'الهدف الأساسي من دراسة الـ Hold Time هو:', '["إطالة عمر الآلات","إثبات استقرار جودة المواد الوسيطة أثناء فترات التخزين المؤقتة","تقليل عدد الموظفين المطلوبين","تسريع عملية التعبئة"]', '1', NULL, 'multiple', NULL),
('hold-time-stability', 'أي من الأشكال الصيدلانية التالية يعتبر الأكثر عرضة للخطر الميكروبي أثناء فترة الاحتفاظ؟', '["الأقراص المضغوطة الجافة","المحاليل المائية والمعلقات","الكبسولات الجيلاتينية الصلبة","المساحيق الجافة"]', '1', NULL, 'multiple', NULL),
('hold-time-stability', 'حاويات التخزين المستخدمة في دراسة الـ Hold Time يجب أن تكون:', '["أرخص الحاويات المتاحة","مصنوعة من الزجاج الشفاف دائماً","ممثلة تماماً لحاويات التخزين الحقيقية المستخدمة في الإنتاج","مختلفة عن الحاويات الفعلية لإضافة التحدي"]', '2', NULL, 'multiple', NULL),
('hold-time-stability', 'فترة الاحتفاظ (Hold Time) لا تؤثر مطلقاً على التركيب الكيميائي للدواء.', NULL, 'false', NULL, 'tf', NULL);

