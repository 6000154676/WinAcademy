const express = require('express');
const { admitStudent, getClasses } = require('../controllers/studentController');

const router = express.Router();

router.post('/', admitStudent);
router.get('/classes', getClasses);

module.exports = router;
