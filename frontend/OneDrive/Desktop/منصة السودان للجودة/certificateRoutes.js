const express = require('express');
const router = express.Router();
const controller = require('../controllers/certificateController');
const apiKeyAuth = require('../middleware/apiKeyAuth');

// Protect creations with API key
router.post('/create', apiKeyAuth, controller.createCertificate);
router.post('/award', apiKeyAuth, controller.awardCertificateSmart); // Backend/internal
router.post('/award-public', controller.awardCertificateSmart); // Frontend/public (add auth later)
router.get('/verify', controller.verifyByNumber);
router.get('/check', controller.checkUserCertificate);

module.exports = router;
