const express = require('express');
const router = express.Router();
const controller = require('../controllers/certificateController');

router.get('/verify', controller.verifyByNumber);
router.get('/check', controller.checkUserCertificate);

module.exports = router;
