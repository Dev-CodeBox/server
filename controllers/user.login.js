const User = require('../models/user.schema');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'User not found' });
        } else {
            if (!password || password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid password' });
            }
            else {
                const token = jwt.sign(
                    {
                        id: existingUser._id,
                        role: existingUser.role,
                        email: existingUser.email,
                        name: existingUser.name
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1d' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'none',
                    maxAge: 24 * 60 * 60 * 1000
                }).status(200).json({ success: true, message: 'Login successful' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error });
    }
}

module.exports = userLogin;