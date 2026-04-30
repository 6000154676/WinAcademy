const express = require('express');
const { getResult } = require('../controllers/resultController');

const router = express.Router();

router.post('/search', getResult);

module.exports = router;
