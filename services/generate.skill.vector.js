const User = require('../models/user.schema');
const axios = require("axios");
require("dotenv").config();

async function generateSkillVector(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const userProfileText = `
            Name: ${user.name}
            Domain: ${user.domain}
            Skills: ${user.skills.join(", ")}
        `;

        // Direct Groq API call for embeddings
        const response = await axios.post(
            "https://api.groq.com/openai/v1/embeddings",
            {
                model: "nomic-embed-text",
                input: userProfileText,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                },
            }
        );

        const vector = response.data.data[0].embedding;

        user.skillVector = vector;
        await user.save();

        return { success: true, vector };
    } catch (error) {
        console.error("Error generating skill vector:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}

module.exports = generateSkillVector;
