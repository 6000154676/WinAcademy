const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /api/auth/login
const loginAdmin = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    try {
        const result = await db.query('SELECT * FROM Admins WHERE username = ?', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const admin = result.rows[0];

        // Ensure bcrypt compares plain text with stored hash
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.json({
            success: true,
            token,
            admin: {
                id: admin.id,
                username: admin.username
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create first admin (setup utility, can be removed in prod)
// @route   POST /api/auth/setup
const createAdmin = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await db.query('INSERT INTO Admins (username, password_hash) VALUES (?, ?)', [username, hash]);
        res.status(201).json({ success: true, message: 'Admin created successfully' });
    } catch(err) {
        next(err);
    }
}

module.exports = { loginAdmin, createAdmin };
