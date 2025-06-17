const express = require('express');
const authMiddleware = require('../middleware');
const router = express.Router();
const { Account, User } = require('../db');
const mongoose = require('mongoose');

// ✅ GET account balance
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const user = await Account.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).json({ msg: "Account not found" });
        }

        res.status(200).json({ balance: user.balance });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});



// 💸 POST /transfer - Send money to another user
router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { amount, to, pin } = req.body;

        const user = await User.findById(req.userId).session(session);
        if (!user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "User not found" });
        }

        const isPinCorrect = await bcrypt.compare(pin, user.pin);
        if (!isPinCorrect) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Incorrect PIN" });
        }

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Recipient account not found" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Internal server error" });
    } finally {
        session.endSession();
    }
});




module.exports = router;
