const supabase = require('../config/supabase');

// الحصول على أسئلة مع مراعاة التدوير لعدم التكرار
exports.getRotatedQuestions = async (req, res) => {
  try {
    const { unitId, count = 10 } = req.params;
    const { userId, excludeIds } = req.query;

    if (req.isDemoMode) {
      let idsToExclude = excludeIds ? excludeIds.split(',') : [];
      const randomQuestions = await req.demoDB.getRotatedQuestions(unitId, count, idsToExclude);
      if (randomQuestions.length === 0) {
        return res.status(404).json({ error: 'No questions found for this unit (Demo Mode)' });
      }
      return res.status(200).json(randomQuestions);
    }

    if (!userId) {
      // إذا لم يكن هناك مستخدم مسجل، نكتفي بالعشوائية العادية
      return exports.getRandomQuestions(req, res);
    }

    const { data: allQuestions, error } = await req.supabase
      .from('questions')
      .select('*')
      .eq('unitId', unitId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!allQuestions || allQuestions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this unit' });
    }

    // جلب سجل المستخدم للوحدة
    const { data: history } = await req.supabase
      .from('quiz_history')
      .select('*')
      .eq('userId', userId)
      .eq('unitId', unitId)
      .single();

    let seenQuestions = history?.seenQuestions || [];

    let unseenQuestions = allQuestions.filter(q => !seenQuestions.includes(q.id.toString()));

    if (unseenQuestions.length < count) {
      // إذا استُنفدت الأسئلة، نقوم بتصفير السجل وإتاحة كل الأسئلة مجدداً
      seenQuestions = [];
      unseenQuestions = allQuestions.slice();
    }

    const shuffled = unseenQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, allQuestions.length));

    // تحديث سجل الأسئلة المرئية
    const selectedIds = selected.map(q => q.id.toString());
    const newSeenQuestions = [...seenQuestions, ...selectedIds];

    if (history) {
      await req.supabase
        .from('quiz_history')
        .update({ seenQuestions: newSeenQuestions, lastReset: new Date().toISOString() })
        .eq('userId', userId)
        .eq('unitId', unitId);
    } else {
      await req.supabase
        .from('quiz_history')
        .insert({ userId, unitId, seenQuestions: newSeenQuestions, lastReset: new Date().toISOString() });
    }

    const formattedQuestions = [];
    selected.forEach(q => {
      const question = { ...q };
      delete question.correctAnswer;
      delete question.correctAnswers;
      
      // Transform to match frontend expected format
      formattedQuestions.push({
        _id: q.id,
        unitId: q.unitId,
        questionText: {
          ar: q.question,
          en: q.question
        },
        options: {
          ar: q.options,
          en: q.options
        },
        type: q.type === 'multiple' ? 'mcq' : q.type,
        explanation: q.explanation
      });
    });

    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error('Get rotated questions error:', error);
    res.status(500).json({ error: error.message });
  }
};
// الحصول على أسئلة عشوائية لوحدة معينة
exports.getRandomQuestions = async (req, res) => {
  try {
    const { unitId, count = 10 } = req.params;

    // Check for Demo Mode
    if (req.isDemoMode) {
      const randomQuestions = await req.demoDB.getRandomQuestions(unitId, count);
      if (randomQuestions.length === 0) {
        return res.status(404).json({ error: 'No questions found for this unit (Demo Mode)' });
      }
      return res.status(200).json(randomQuestions);
    }

    // الحصول على جميع الأسئلة للوحدة
    const { data: allQuestions, error } = await req.supabase
      .from('questions')
      .select('*')
      .eq('unitId', unitId);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!allQuestions || allQuestions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this unit' });
    }

    // اختيار أسئلة عشوائية
    const randomQuestions = [];
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, allQuestions.length));

    selected.forEach(q => {
      const question = { ...q };
      // إزالة معلومات الإجابة الصحيحة من الاستجابة لضمان النزاهة
      delete question.correctAnswer;
      delete question.correctAnswers;
      
      // Transform to match frontend expected format
      randomQuestions.push({
        _id: q.id,
        unitId: q.unitId,
        questionText: {
          ar: q.question,
          en: q.question
        },
        options: {
          ar: q.options,
          en: q.options
        },
        type: q.type === 'multiple' ? 'mcq' : q.type,
        explanation: q.explanation
      });
    });

    res.status(200).json(randomQuestions);
  } catch (error) {
    console.error('Get random questions error:', error);
    res.status(500).json({ error: error.message });
  }
};

// التحقق من إجابة السؤال
exports.checkAnswer = async (req, res) => {
  try {
    const { questionId, userAnswer, shuffledIndices } = req.body;

    // Check for Demo Mode
    if (req.isDemoMode) {
      const result = await req.demoDB.checkAnswer(questionId, userAnswer);
      if (result.message === 'Question not found') {
        return res.status(404).json({ error: result.message });
      }
      return res.status(200).json({
        isCorrect: result.isCorrect || result.correct,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation || 'No explanation available in demo mode'
      });
    }

    const { data: question, error } = await req.supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error || !question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    let isCorrect = false;

    if (question.type === 'fill') {
      const normalizedUser = String(userAnswer || '').trim().toLowerCase();
      isCorrect = (question.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
    } else if (question.type === 'multiple' && shuffledIndices && Array.isArray(shuffledIndices)) {
      // Account for shuffled indices in MCQ questions
      const originalIdx = shuffledIndices[userAnswer];
      isCorrect = Number(originalIdx) === Number(question.correctAnswer);
    } else {
      isCorrect = String(question.correctAnswer) === String(userAnswer);
    }

    res.status(200).json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation
    });
  } catch (error) {
    console.error('Check answer error:', error);
    res.status(500).json({ error: error.message });
  }
};
