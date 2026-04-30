const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../config/db');

// Edit API keys in the .env file.
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/order
const createOrder = async (req, res, next) => {
    const { amount, student_id, class_id, payment_type } = req.body;

    if (!amount || !student_id || !class_id || !payment_type) {
        return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: 'Some error occurred while creating Razorpay order' });
        }

        // Insert pending payment record
        const insertQuery = `
            INSERT INTO Payments (student_id, class_id, amount, payment_type, razorpay_order_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await db.query(insertQuery, [student_id, class_id, amount, payment_type, order.id]);

        res.status(201).json({ success: true, order, paymentId: result.insertId });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify Payment Signature
// @route   POST /api/payments/verify
const verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generateSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generateSignature === razorpay_signature) {
            // Update payment status to Completed
            await db.query(
                `UPDATE Payments SET payment_status = 'Completed', razorpay_payment_id = ? WHERE razorpay_order_id = ?`,
                [razorpay_payment_id, razorpay_order_id]
            );

            return res.json({ success: true, message: 'Payment successfully verified' });
        } else {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, verifyPayment };
