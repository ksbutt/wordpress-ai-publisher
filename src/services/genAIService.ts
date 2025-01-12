import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const gemini = async (topic: string): Promise<any> => {
    const systemPrompt = `You are an AI assistant specialized in generating SEO-optimized content structured for CMS platforms like WordPress. Please make sure in result attribute, you should not add \\n in the content and make sure double quotes should be converted to HTML tags

Generate the response in the following JSON object
title: Add title without HTML tags
meta_title
meta_description: it should be 160 characters long
focus_keyword
content:
tags: A list of relevant tags.`;
    const userPrompt = {
        contents: [
            {
                role: 'user',
                parts: [
                  {
                    text: `Write a comprehensive and SEO-optimized article about "${topic}", aiming for a minimum of 1000 words. The article should be highly informative and engaging in ranking on the first page of Google for "${topic}".
  Formatting and Structure Requirements:
  Create a compelling title with the main keyword.
  Introduction: Write an engaging introduction of approximately 100 words, including the main keyword.
  Structure the page with detailed content under well-defined headings:
  <h2>Section 1 Heading (Great keyword)</h2>: Include two detailed paragraphs.
  <h2>Section 2 Heading (Great keyword)</h2>: Include two comprehensive paragraphs.
  <h2>Section 3 Heading (Great keyword)</h2>: Include three in-depth paragraphs.
  <h2>Section 4 Heading (Great keyword)</h2>: Include three thorough paragraphs.
  <h2>Section 5 Heading (Great keyword)</h2>: Include three extensive paragraphs.
  Conclusion: Provide a summary of key points and insights in a concluding section.
  FAQs Section: Add a section with common questions related to the topic, using <h3> tags for each question.`,
                  }
                ],
              }
        ],
        generationConfig: {
            responseMimeType: 'application/json'
        }
    };

    const model = genAI.getGenerativeModel(
        {
            model: "gemini-2.0-flash-exp",
            systemInstruction: systemPrompt
        });
    const result = await model.generateContentStream(userPrompt);
    let results = [];
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        results.push(chunkText);
    }
    return results.join('');
}