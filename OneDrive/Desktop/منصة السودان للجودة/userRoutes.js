const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// GET /api/user/profile/:userId
router.get('/profile/:userId', userController.getUserProfile);

// GET /api/user/leaderboard
router.get('/leaderboard', userController.getLeaderboard);

// POST /api/user/sync/:userId
router.post('/sync/:userId', userController.syncUserStats);

// GET /api/user/certificates/:userId
router.get('/certificates/:userId', userController.getCertificates);

module.exports = router;
