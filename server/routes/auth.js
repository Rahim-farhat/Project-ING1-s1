const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// POST /api/auth/register (optional helper to create a user)
router.post('/register', async (req, res) => {
try {
const { email, password, name } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email and password required' });


const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'User already exists' });


const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);


const user = new User({ email, passwordHash, name });
await user.save();


return res.status(201).json({ message: 'User created' });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email and password required' });


const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });


const isMatch = await bcrypt.compare(password, user.passwordHash);
if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


const payload = { userId: user._id, email: user.email };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });


return res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
} catch (err) {
console.error(err);
return res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;