const Question = require('../models/Question');
const QuizHistory = require('../models/QuizHistory');

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

    const allQuestions = await Question.find({ unitId });
    if (allQuestions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this unit' });
    }

    // جلب سجل المستخدم للوحدة
    let history = await QuizHistory.findOne({ userId, unitId });
    if (!history) {
      history = new QuizHistory({ userId, unitId, seenQuestions: [] });
    }

    let unseenQuestions = allQuestions.filter(q => !history.seenQuestions.includes(q._id.toString()));

    if (unseenQuestions.length < count) {
      // إذا استُنفدت الأسئلة، نقوم بتصفير السجل وإتاحة كل الأسئلة مجدداً
      history.seenQuestions = [];
      unseenQuestions = allQuestions.slice();
    }

    const shuffled = unseenQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, allQuestions.length));

    // تحديث سجل الأسئلة المرئية
    const selectedIds = selected.map(q => q._id.toString());
    history.seenQuestions.push(...selectedIds);
    history.lastReset = new Date();
    await history.save();

    const formattedQuestions = [];
    selected.forEach(q => {
      const question = q.toObject();
      delete question.correctAnswer;
      delete question.correctAnswers;
      formattedQuestions.push(question);
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
    const allQuestions = await Question.find({ unitId });

    if (allQuestions.length === 0) {
      return res.status(404).json({ error: 'No questions found for this unit' });
    }

    // اختيار أسئلة عشوائية
    const randomQuestions = [];
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, allQuestions.length));

    selected.forEach(q => {
      const question = q.toObject();
      // إزالة معلومات الإجابة الصحيحة من الاستجابة لضمان النزاهة
      delete question.correctAnswer;
      delete question.correctAnswers;
      randomQuestions.push(question);
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
    const { questionId, userAnswer } = req.body;

    // Check for Demo Mode
    if (req.isDemoMode) {
      const result = await req.demoDB.checkAnswer(questionId, userAnswer);
      if (result.message === 'Question not found') {
        return res.status(404).json({ error: result.message });
      }
      return res.status(200).json({
        isCorrect: result.correct,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation || 'No explanation available in demo mode'
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    let isCorrect = false;

    if (question.type === 'fill') {
      const normalizedUser = String(userAnswer || '').trim().toLowerCase();
      isCorrect = (question.correctAnswers || []).some(ans => ans.toLowerCase() === normalizedUser);
    } else {
      isCorrect = question.correctAnswer === userAnswer;
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
