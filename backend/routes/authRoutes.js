const express = require('express');
const { loginAdmin, createAdmin } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/setup', createAdmin);

module.exports = router;
