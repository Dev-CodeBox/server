const User = require("../models/user.schema");
const { ChatGroq } = require("@langchain/groq");

const skillTest = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(400).json({ success: false, message: "userId required" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const level = user.level || "beginner";
    const difficulty =
      level === "beginner"
        ? "easy"
        : level === "intermediate"
          ? "medium"
          : "hard";

    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
    });

    const prompt = `
Generate exactly 10 multiple-choice questions for domain "${user.domain}".
Difficulty: ${difficulty}.
Return STRICT JSON array ONLY, like:
[
  {
    "question": "string",
    "options": ["A","B","C","D"],
    "correctAnswer": "A"
  }
]
Do NOT include extra text, explanation, or markdown.
`;

    const result = await llm.invoke(prompt);

    const rawText = String(result?.content || "").trim();

    if (!rawText) {
      return res.status(500).json({ success: false, message: "AI response is empty" });
    }

    let questions;

    try {
      questions = JSON.parse(rawText);
    } catch (e) {
      return res.status(500).json({ success: false, message: "Failed to parse AI response" });
    }

    return res.json({ success: true, questions, level });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = skillTest;
