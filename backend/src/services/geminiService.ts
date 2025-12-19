import { GoogleGenerativeAI } from '@google/generative-ai';

export interface OptimizedContent {
  title: string;
  bulletPoints: string[];
  description: string;
  keywords: string[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async optimizeProductListing(
    title: string,
    bulletPoints: string[],
    description: string,
    productDetails: Record<string, string>
  ): Promise<OptimizedContent> {
    try {
      // Create comprehensive prompt for optimization
      const prompt = `You are an expert Amazon product listing optimizer. Optimize the following product listing for better visibility, conversion, and SEO.

ORIGINAL LISTING:
Title: ${title}

Bullet Points:
${bulletPoints.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}

Description: ${description}

Product Details: ${JSON.stringify(productDetails)}

TASK:
1. Create an IMPROVED TITLE that is:
   - Keyword-rich and SEO-optimized
   - Clear and readable (max 200 characters)
   - Includes brand, product type, key features
   - Follows Amazon best practices

2. Rewrite BULLET POINTS (exactly 5 points) that are:
   - Clear, concise, and benefit-focused
   - Highlight key features and advantages
   - Start with a capital letter
   - Each 150-200 characters max

3. Create an ENHANCED DESCRIPTION that is:
   - Persuasive and compelling
   - Highlights unique selling points
   - 200-300 words
   - Professional and compliant with Amazon policies

4. Suggest 3-5 RELEVANT KEYWORDS for SEO optimization

IMPORTANT: Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "title": "optimized title here",
  "bulletPoints": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "description": "optimized description here",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let optimizedData: OptimizedContent;
      try {
        // Clean up response text to extract JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        optimizedData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        throw new Error('Invalid response format from Gemini API');
      }

      // Validate response
      if (!optimizedData.title || !optimizedData.bulletPoints || !optimizedData.description || !optimizedData.keywords) {
        throw new Error('Incomplete optimization data from Gemini');
      }

      return optimizedData;
    } catch (error: any) {
      console.error('Error optimizing with Gemini:', error.message);
      throw new Error('Failed to optimize product listing');
    }
  }
}

export default new GeminiService();