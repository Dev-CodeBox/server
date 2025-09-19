const User = require('../models/user.schema');
const bcrypt = require("bcrypt");
const validator = require("validator");
const cloudinary = require('cloudinary').v2;
const generateSkillVector = require('../services/generate.skill.vector');

const userSignup = async (req, res) => {
    try {
        const { name, email, password, domain, skills } = req.body;

        if (!req.files || !req.files.image) {
            return res.status(400).json({ success: false, message: "Profile image is required" });
        }
        const image = req.files?.image;

        if (!name) return res.status(400).json({ message: 'Name is required' });

        const imageType = image.mimetype.split("/")[1];
        const allowedTypes = ["jpeg", "png", "jpg"];
        if (!allowedTypes.includes(imageType)) {
            return res.status(400).json({ success: false, message: "Invalid image type" });
        }

        if (!email) return res.status(400).json({ message: 'Email is required' });
        if (!validator.isEmail(email)) return res.status(400).json({ message: 'Please enter a valid email address' });

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        if (!domain) return res.status(400).json({ message: 'Domain is required' });
        if (!skills || skills.length === 0) return res.status(400).json({ message: 'At least one skill is required' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const uploadedImage = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "images",
            use_filename: true,
            unique_filename: false,
            transformation: [
                { width: 300, height: 300, crop: "fill" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ]
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            image: uploadedImage.secure_url,
            email,
            password: hashedPassword,
            domain,
            skills
        });

        await newUser.save();
        await generateSkillVector(newUser._id);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: newUser._id
        });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server error', error });
    }
};

module.exports = userSignup;
