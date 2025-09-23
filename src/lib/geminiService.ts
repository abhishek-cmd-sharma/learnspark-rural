import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Safety settings to allow for educational content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// Get the Gemini model
const getModel = () => {
  return genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    safetySettings
  });
};

// Function to generate quiz questions from subject content
export const generateQuizFromContent = async (
  subject: string,
  content: string,
 numQuestions: number = 5,
  difficulty: "easy" | "medium" | "hard" = "medium"
): Promise<any> => {
  try {
    const model = getModel();
    
    const prompt = `You are an expert educator creating quizzes for students. Generate a quiz with ${numQuestions} multiple-choice questions based on the following ${subject} content:

Content:
${content}

Difficulty Level: ${difficulty}

Requirements:
1. Each question should have 4 options (A, B, C, D)
2. Clearly indicate the correct answer for each question
3. Include a brief explanation for the correct answer
4. Assign points based on difficulty (easy=1pt, medium=2pts, hard=3pts)
5. Format the response as JSON with the following structure:
{
  "questions": [
    {
      "text": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0, // Index of correct option (0-3)
      "explanation": "Explanation of why this is correct",
      "points": 2
    }
  ]
}

Return ONLY the JSON object, no other text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);
    
    // Parse and return the JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating quiz from Gemini API:", error);
    throw new Error("Failed to generate quiz. Please try again.");
 }
};

// Function to generate subject content summary
export const generateContentSummary = async (
  subject: string,
  content: string
): Promise<string> => {
  try {
    const model = getModel();
    
    const prompt = `Summarize the following ${subject} content in a clear and concise way suitable for students:

Content:
${content}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content summary from Gemini API:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
};

export default {
  generateQuizFromContent,
  generateContentSummary
};