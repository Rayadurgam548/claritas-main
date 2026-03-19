const express = require('express');
const documentRoutes = require('./documentRoutes');
const aiRoutes = require('./aiRoutes');
const authRoutes = require('./authRoutes');
const agentsRoutes = require('./agents');

const router = express.Router();

router.use('/auth', authRoutes);
// temporarily disable authentication to allow non-logged in users
// const authenticate = require('../middlewares/authMiddleware');
// router.use(authenticate);

router.use('/', documentRoutes);
router.use('/', aiRoutes);
router.use('/agents', agentsRoutes);

module.exports = router;
