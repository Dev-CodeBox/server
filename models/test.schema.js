const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    }
}
    , { timestamps: true }
);

module.exports = mongoose.model('Test', testSchema);
