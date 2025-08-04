import OpenAI from "openai";
import { fallbackMathConcept, fallbackNews, fallbackQuestion } from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this environment variable
});

export const generateMathQuestion = async (difficulty: string, topics: string[]) => {
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `Generate a ${difficulty} level math question about ${topic} suitable for kids aged 8-15. 
  
  Format your response as JSON with this exact structure:
  {
    "question": "The math question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "difficulty": "${difficulty}",
    "topic": "${topic}",
    "explanation": "Exaplanation of the answer"
  }
  
  The correctAnswer should be the index (0-3) of the correct option.
  Make the question engaging and age-appropriate.
  Include exactly 4 multiple choice options.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content generated");

    const questionData = JSON.parse(content);
    
    // Validate the response
    if (!questionData.question || !Array.isArray(questionData.options) || 
        questionData.options.length !== 4 || typeof questionData.correctAnswer !== 'number' ||
        questionData.correctAnswer < 0 || questionData.correctAnswer > 3) {
      throw new Error("Invalid question format");
    }

    return questionData;
  } catch (error) {
    console.error("Error generating question:", error);
    
    // Fallback to predefined questions
    return fallbackQuestion(difficulty, topic);
  }
}

export const getTopNews = async () => {
    try {
      const prompt = `Top 3 recent news articles in the field of maths.
       
      Return the response as a JSON array with objects containing:
      - title: The news headline (engaging and informative)
      - summary: A brief 4-5 sentence description
      - url: news article link`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: "You are a news curator creating engaging headlines for a math-savvy audience. Return only valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content received from OpenAI');
      
      const newsData = JSON.parse(content);
    
        // Validate the response
        if (!Array.isArray(newsData) || 
            newsData.length !== 3) {
        throw new Error("Invalid news format");
        }

        return newsData;
    } catch (error) {
      console.error('Error generating news:', error);
      // Fallback news items
      return fallbackNews();
    }
}

export const getMathConcept = async () => {
    try {
      const prompt = `Generate an interesting random mathematical concept for a "Math Concept of the Week" section in a newsletter. 
      
      The concept should be:
      - Accessible to a general educated audience
      - Have real-world applications or interesting properties
      - Include mathematical notation where appropriate
      - Be engaging and educational

      Return the response as JSON with:
      - title: The name of the mathematical concept
      - description: A 3-4 sentence explanation that's informative but accessible
      - learnMoreLinks: An array of 3 objects with "text" and "url" fields for related topics`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: "You are a mathematics educator creating engaging content for a general audience. Return only valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content received from OpenAI');
      
      const mathConceptData = JSON.parse(content);

        // Validate the response
        if (!mathConceptData.title || !Array.isArray(mathConceptData.learnMoreLinks) || mathConceptData.learnMoreLinks.length < 2) {
            throw new Error("Invalid math concept format");
        }

        return mathConceptData;
    } catch (error) {
      console.error('Error generating math concept:', error);
      // Fallback math concept
      return fallbackMathConcept();
    }
}
