const express = require('express');
const authMiddleware = require('../middleware');
const router = express.Router();
const { Account, User } = require('../db');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // ✅ ADD THIS LINE

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
        console.log("🚀 Transfer route called");

        session.startTransaction();
        const { amount, to, pin } = req.body;

        console.log("📦 Request body:", { amount, to, pin });

        const user = await User.findById(req.userId).session(session);
        if (!user) {
            console.log("❌ User not found");
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "User not found" });
        }

        const pinString = String(pin);
        const isPinCorrect = await bcrypt.compare(pinString, user.pin);
        console.log("🔐 PIN check:", isPinCorrect);

        if (!isPinCorrect) {
            console.log("❌ Incorrect PIN");
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({ message: "Incorrect PIN" });
        }

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            console.log("❌ Insufficient balance or account missing");
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            console.log("❌ Recipient not found");
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Recipient account not found" });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        console.log("✅ Transfer successful");
        res.json({ message: "Transfer successful" });

    } catch (error) {
        console.error("🔥 Error during transfer:", error); // ✅ Most important line!
        await session.abortTransaction();
        res.status(500).json({ message: "Internal server error" });
    } finally {
        session.endSession();
    }
});


module.exports = router;
