const db = require('../config/db');

// @desc    Admit a new student
// @route   POST /api/students
const admitStudent = async (req, res, next) => {
    const { name, dob, class_id, email, phone, address, roll_number } = req.body;

    if (!name || !dob || !class_id || !roll_number) {
        return res.status(400).json({ success: false, message: 'Please provide name, dob, class_id and roll_number' });
    }

    try {
        const insertResult = await db.query(
            `INSERT INTO Students (name, dob, class_id, email, phone, address, roll_number) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, dob, class_id, email, phone, address, roll_number]
        );

        const fetchResult = await db.query('SELECT * FROM Students WHERE id = ?', [insertResult.insertId]);

        res.status(201).json({ success: true, data: fetchResult.rows[0] });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') { // unique violation in mysql
            return res.status(400).json({ success: false, message: 'Roll number already exists' });
        }
        next(error);
    }
};

// @desc    Get all classes for admission form dropdown
// @route   GET /api/students/classes
const getClasses = async (req, res, next) => {
    try {
        const result = await db.query('SELECT * FROM Classes');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
};

module.exports = { admitStudent, getClasses };
