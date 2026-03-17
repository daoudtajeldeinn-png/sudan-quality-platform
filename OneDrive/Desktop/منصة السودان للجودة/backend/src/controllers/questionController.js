const Question = require('../models/Question');

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
