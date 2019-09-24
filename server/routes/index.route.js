const express = require('express');
const userRoutes = require('./auth.route');
const verificationRoutes = require('./verification.route');

const router = express.Router();
router.get('/health-check', (req, res) => res.send('OK'));
router.use('/auth', userRoutes);
router.use('/verify', verificationRoutes);
module.exports = router;
