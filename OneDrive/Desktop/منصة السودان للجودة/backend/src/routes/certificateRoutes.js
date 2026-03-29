const express = require('express');
const router = express.Router();
const controller = require('../controllers/certificateController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Protect creation with API key
router.post('/create', apiKeyAuth, controller.createCertificate);
router.get('/verify', controller.verifyByNumber);
router.get('/check', controller.checkUserCertificate);

module.exports = router;
