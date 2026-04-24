const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// GET /api/questions/rotate/:unitId/:count? - الحصول على أسئلة مع مراعاة التدوير
router.get('/rotate/:unitId/:count?', questionController.getRotatedQuestions);

// GET /api/questions/:unitId/:count - الحصول على أسئلة عشوائية
router.get('/:unitId/:count?', questionController.getRandomQuestions);

// POST /api/questions/check - التحقق من إجابة السؤال
router.post('/check', questionController.checkAnswer);

module.exports = router;
