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
  const { amount, to } = req.body;

  if (!amount || !to) {
    return res.status(400).json({ msg: "Missing amount or recipient ID" });
  }

  try {
    const senderAccount = await Account.findOne({ userId: req.userId });
    const receiverAccount = await Account.findOne({ userId: to });

    if (!senderAccount || senderAccount.balance < amount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    if (!receiverAccount) {
      return res.status(400).json({ msg: "Invalid recipient" });
    }

    // ⬇️ Deduct from sender
    senderAccount.balance -= amount;
    await senderAccount.save();

    // ⬆️ Add to receiver
    receiverAccount.balance += amount;
    await receiverAccount.save();

    const senderUser = await User.findOne({ _id: req.userId });

    res.status(200).json({
      msg: "Transfer successful",
      newAmount: senderAccount.balance,
      userName: senderUser.firstName || "User"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;


module.exports = router;
