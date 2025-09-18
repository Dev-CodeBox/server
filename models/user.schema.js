const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    skills: [
        {
            type: String,
            required: true
        }
    ],
    skillVector: {
        type: [Number],
        default: []
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });

userSchema.post("save", async (doc) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Future Fit <${process.env.EMAIL_USER}>`,
            to: doc.email,
            subject: "Welcome to Future Fit",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                    <img src="https://img.icons8.com/emoji/96/waving-hand-emoji.png" style="width: 80px; margin-bottom: 20px;" />
                    <h2 style="color: #2b6cb0;">Welcome, ${doc.name}!</h2>
                    <p>Thanks for joining <strong>Future Fit</strong>.</p>
                    <p>You can now explore our features and start your journey with us.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error in post-save hook:", error);
    }
});

module.exports = mongoose.model('User', userSchema);
