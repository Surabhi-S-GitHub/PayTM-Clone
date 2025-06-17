require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const zod = require('zod');
const { User, Account } = require('../db');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware');
const saltRounds = 10;

// 🛡️ Zod Schemas
const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstName: zod.string(),
    lastName: zod.string()
});

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

// ✅ GET authenticated user info
router.get('/', authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        const user = await User.findById(req.userId);

        if (!account || !user) {
            return res.status(404).json({ msg: "User/account not found" });
        }

        res.status(200).json({
            msg: "Authenticated",
            initialAmount: account.balance,
            username: user.username
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// ✅ POST /signup
router.post('/signup', async (req, res) => {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({ msg: "Incorrect inputs" });
    }

    try {
        const existingUser = await User.findOne({ username: parsed.data.username });
        if (existingUser) {
            return res.status(411).json({ msg: 'User already exists' });
        }

        const hashed = await bcrypt.hash(parsed.data.password, saltRounds);
        const user = await User.create({
            ...parsed.data,
            password: hashed
        });

        const initialAmount = Math.round(1 + Math.random() * 10000);
        await Account.create({
            userId: user._id,
            balance: initialAmount
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.json({
            message: "User created successfully",
            token,
            initialAmount
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// ✅ POST /signin
router.post('/signin', async (req, res) => {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({ msg: "Incorrect inputs" });
    }

    try {
        const user = await User.findOne({ username: parsed.data.username });
        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        const match = await bcrypt.compare(parsed.data.password, user.password);
        if (!match) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const account = await Account.findOne({ userId: user._id });
        const initialAmount = account?.balance ?? 0;

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ token, initialAmount });

    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// ✅ PUT / (update user info)
router.put('/', authMiddleware, async (req, res) => {
    const parsed = updateBody.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({ msg: "Invalid update data" });
    }

    try {
        const update = parsed.data;

        // Hash new password if provided
        if (update.password) {
            update.password = await bcrypt.hash(update.password, saltRounds);
        }

        await User.updateOne({ _id: req.userId }, { $set: update });

        res.status(200).json({ msg: "Updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// ✅ GET /bulk (search users)
router.get('/bulk', async (req, res) => {
    const filter = req.query.filter || "";

    try {
        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } }
            ]
        });

        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;
