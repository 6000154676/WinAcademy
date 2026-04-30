const db = require('../config/db');

// @desc    Get result by roll number and DOB
// @route   POST /api/results/search
const getResult = async (req, res, next) => {
    const { roll_number, dob } = req.body;

    if (!roll_number || !dob) {
        return res.status(400).json({ success: false, message: 'Please provide roll number and Date of Birth' });
    }

    try {
        // Find the student
        const studentResult = await db.query('SELECT * FROM Students WHERE roll_number = ? AND dob = ?', [roll_number, dob]);
        
        if (studentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Student not found or incorrect date of birth' });
        }
        
        const student = studentResult.rows[0];

        // Find marks for all subjects for the latest exam
        // (For simplicity, we grab all marks for this student and join subjects)
        const marksQuery = `
            SELECT m.marks_obtained, s.subject_name, s.total_marks, s.passing_marks, e.exam_name
            FROM Marks m
            JOIN Subjects s ON m.subject_id = s.id
            JOIN Exams e ON m.exam_id = e.id
            WHERE m.student_id = ?
            ORDER BY e.exam_date DESC
        `;
        const marksResult = await db.query(marksQuery, [student.id]);
        
        if (marksResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'No results published for this student yet.' });
        }

        let totalObtained = 0;
        let totalMax = 0;
        let isPass = true;

        marksResult.rows.forEach(row => {
            totalObtained += parseFloat(row.marks_obtained);
            totalMax += row.total_marks;
            if (row.marks_obtained < row.passing_marks) {
                isPass = false;
            }
        });

        const percentage = ((totalObtained / totalMax) * 100).toFixed(2);

        res.json({
            success: true,
            studentInfo: {
                name: student.name,
                roll_number: student.roll_number,
                class_id: student.class_id
            },
            marks: marksResult.rows,
            summary: {
                totalObtained,
                totalMax,
                percentage,
                status: isPass ? 'PASS' : 'FAIL'
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getResult };
