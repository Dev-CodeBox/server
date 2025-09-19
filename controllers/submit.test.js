const User = require("../models/user.schema");
const Test = require("../models/test.schema");

const submitTest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { answers, questions } = req.body;

        if (!userId || !answers || !questions) {
            return res.status(400).json({
                success: false,
                message: "userId, answers & questions are required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let score = 0;
        answers.forEach(({ qIndex, answer }) => {
            if (
                questions[qIndex] &&
                questions[qIndex].correctAnswer.trim().toLowerCase() ===
                answer.trim().toLowerCase()
            ) {
                score++;
            }
        });

        const percentage = (score / questions.length) * 100;

        if (percentage >= 80) user.level = "advanced";
        else if (percentage >= 50) user.level = "intermediate";
        else user.level = "beginner";

        const newTest = await Test.create({
            score,
            totalQuestions: questions.length,
            percentage,
        });

        user.tests.push(newTest._id);
        await user.save();

        return res.json({
            success: true,
            score,
            total: questions.length,
            percentage,
            level: user.level,
            latestTest: newTest,
            message: "Test submitted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
};

module.exports = submitTest;
