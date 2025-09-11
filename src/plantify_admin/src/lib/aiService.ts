export interface AIGeneratedFounder {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  previousBusinesses: string;
  expertise: string;
  linkedIn: string;
  idNumber: string;
  taxNumber: string;
}

export class AIService {
  private static readonly OPENROUTER_API_URL =
    "https://openrouter.ai/api/v1/chat/completions";
  private static readonly API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  private static readonly SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://plantify-admin.vercel.app";

  static async generateFounderData(): Promise<AIGeneratedFounder> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate realistic founder registration data for testing a startup platform. Return ONLY a valid JSON object with these exact fields:
{
  "fullName": "string",
  "email": "string", 
  "phone": "string",
  "address": "string",
  "experience": "string (number of years)",
  "previousBusinesses": "string",
  "expertise": "string",
  "linkedIn": "string (LinkedIn profile URL)",
  "idNumber": "string (realistic ID number)",
  "taxNumber": "string (realistic tax number)"
}

Make the data realistic and diverse. Use different industries, experience levels, and backgrounds.`;

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer": this.SITE_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.8,
          max_tokens: 1000,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();

      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from AI API");
      }

      let jsonContent = content.trim();

      const jsonMatch = jsonContent.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
      );
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      } else {
        if (jsonContent.startsWith("```json")) {
          jsonContent = jsonContent
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else if (jsonContent.startsWith("```")) {
          jsonContent = jsonContent
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }
      }

      console.log("Cleaned JSON:", jsonContent);

      const founderData = JSON.parse(jsonContent);

      const requiredFields = [
        "fullName",
        "email",
        "phone",
        "address",
        "experience",
        "previousBusinesses",
        "expertise",
        "linkedIn",
        "idNumber",
        "taxNumber",
      ];

      for (const field of requiredFields) {
        if (!founderData[field] || typeof founderData[field] !== "string") {
          throw new Error(`Invalid or missing field: ${field}`);
        }
      }

      return founderData as AIGeneratedFounder;
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error(
        `Failed to generate founder data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
