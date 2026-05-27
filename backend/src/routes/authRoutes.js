const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.get('/user/:userId', authController.getUser);

module.exports = router;
