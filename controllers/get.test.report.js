const User = require('../models/user.schema');

const getTestReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('tests').sort({ createdAt: -1 });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const testReports = user.tests.map(test => ({
            id: test._id,
            score: test.score,
            totalQuestions: test.totalQuestions,
            percentage: test.percentage,
            createdAt: test.createdAt
        }));

        return res.json({
            success: true,
            testReports
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

module.exports = getTestReport;
