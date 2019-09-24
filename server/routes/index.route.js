const express = require('express');
const userRoutes = require('./auth.route');
const verificationRoutes = require('./verification.route');
const isIpAllowed = require('../middleware/blockIp.middleware');

const router = express.Router();
router.use(isIpAllowed);
router.get('/health-check', (req, res) => res.send('OK'));
router.use('/auth', userRoutes);
router.use('/verify', verificationRoutes);
module.exports = router;
