const express = require('express');
const router = express.Router();
const { requestPasswordRecovery, resetPassword } = require('../controllers/passwordRecoveryController');

router.post('/password-recovery', requestPasswordRecovery);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
