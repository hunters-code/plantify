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

export interface AIGeneratedTeamMember {
  name: string;
  role: string;
  background: string;
  linkedin: string;
  email: string;
  isFounder: boolean;
}

export interface AIGeneratedStartup {
  companyName: string;
  description: string;
  industry: string;
  businessModel: string;
  targetMarket: string;
  fundingGoal: string;
  equityOffering: string;
  timeline: string;
  teamSize: string;
  revenue: string;
  website: string;
  pitchDeck: string;
  companyLogo: string; // Supabase URL for logo
  nftImage: string; // Supabase URL for NFT image
  teamMembers: AIGeneratedTeamMember[];
}

import { SupabaseService } from './supabase';

export class AIService {
  private static readonly OPENROUTER_API_URL =
    "https://openrouter.ai/api/v1/chat/completions";
  private static readonly API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  private static readonly SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://plantify-admin.vercel.app";

  private static cleanupBase64Data(data: string): string {
    let cleaned = data.trim();
    
    // Remove any markdown code blocks
    if (cleaned.includes("```")) {
      const codeBlockMatch = cleaned.match(/```(?:[a-z]*\n)?(data:image\/png;base64,[A-Za-z0-9+/=]+)/i);
      if (codeBlockMatch) {
        cleaned = codeBlockMatch[1];
      }
    }
    
    // Look for the base64 pattern
    const base64Match = cleaned.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/i);
    if (base64Match) {
      cleaned = `data:image/png;base64,${base64Match[1]}`;
    } else if (cleaned.startsWith("data:image/png;base64,")) {
      // Already in correct format
    } else {
      // If no proper format found, try to extract just the base64 part
      const justBase64 = cleaned.match(/([A-Za-z0-9+/=]+)/);
      if (justBase64) {
        cleaned = `data:image/png;base64,${justBase64[1]}`;
      } else {
        // Fallback to default 1x1 pixel PNG
        cleaned = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      }
    }
    
    return cleaned;
  }

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

  static async generateStartupData(): Promise<AIGeneratedStartup> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate realistic startup data for testing a startup platform. Return ONLY a valid JSON object with these exact fields:
{
  "companyName": "string",
  "description": "string",
  "industry": "string",
  "businessModel": "string",
  "targetMarket": "string",
  "fundingGoal": "string (number as string)",
  "equityOffering": "string (percentage as string)",
  "timeline": "string",
  "teamSize": "string (number as string)",
  "revenue": "string (number as string)",
  "website": "string (URL)",
  "pitchDeck": "string (URL)",
  "teamMembers": [
    {
      "name": "string",
      "role": "string",
      "background": "string",
      "linkedin": "string (LinkedIn URL)",
      "email": "string",
      "isFounder": true
    }
  ]
}

Make the data realistic and diverse. Use different industries like fintech, healthtech, edtech, e-commerce, SaaS, etc. Generate 2-4 team members including at least one founder (isFounder: true) and other roles like CTO, CMO, COO, etc.`;

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
          max_tokens: 1500,
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

      const startupData = JSON.parse(jsonContent);

      // Generate company logo using Gemini
      const companyLogo = await this.generateCompanyLogo(startupData.companyName, startupData.industry);
      startupData.companyLogo = companyLogo;

      // Generate NFT image using Gemini (using company name as temp ID)
      const nftImage = await this.generateNFTImage(startupData.description, startupData.industry, startupData.companyName);
      startupData.nftImage = nftImage;

      const requiredFields = [
        "companyName",
        "description",
        "industry",
        "businessModel",
        "targetMarket",
        "fundingGoal",
        "equityOffering",
        "timeline",
        "teamSize",
        "revenue",
        "website",
        "pitchDeck",
        "companyLogo",
        "nftImage",
        "teamMembers",
      ];

      for (const field of requiredFields) {
        if (field === "teamMembers") {
          if (!startupData[field] || !Array.isArray(startupData[field]) || startupData[field].length === 0) {
            throw new Error(`Invalid or missing field: ${field}`);
          }
        } else {
          if (!startupData[field] || typeof startupData[field] !== "string") {
            throw new Error(`Invalid or missing field: ${field}`);
          }
        }
      }

      return startupData as AIGeneratedStartup;
    } catch (error) {
      console.error("AI generation error:", error);
      throw new Error(
        `Failed to generate startup data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  static async generateCompanyLogo(companyName: string, industry: string): Promise<string> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate a professional company logo for a startup.
Company Details:
- Company Name: ${companyName}
- Industry: ${industry}

Create a clean, modern logo that represents the company's brand and industry.`;

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer": this.SITE_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          modalities: ['image', 'text'],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Check for images in the new response format
      const images = data.choices?.[0]?.message?.images;
      if (images && images.length > 0 && images[0]?.image_url?.url) {
        const base64Image = images[0].image_url.url;
        const cleanedBase64 = this.cleanupBase64Data(base64Image);
        
        // Upload to Supabase and return URL
        const uploadResult = await SupabaseService.uploadCompanyLogo(cleanedBase64, companyName);
        return uploadResult.url;
      }

      // Fallback to old format parsing
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from AI API");
      }

      // Parse the AI response to get color scheme
      let colorScheme;
      try {
        colorScheme = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        // Fallback to default colors
        colorScheme = {
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
          theme: "professional",
          symbols: ["logo", "brand", "company"]
        };
      }

      // Generate a 1x1 pixel PNG with the AI-suggested colors and upload to Supabase
      const fallbackBase64 = this.generateColoredPixel(colorScheme.primaryColor);
      const uploadResult = await SupabaseService.uploadCompanyLogo(fallbackBase64, companyName);
      return uploadResult.url;
    } catch (error) {
      console.error("Company logo generation error:", error);
      // Return a fallback 1x1 pixel PNG uploaded to Supabase
      const fallbackBase64 = this.generateColoredPixel("#3B82F6");
      const uploadResult = await SupabaseService.uploadCompanyLogo(fallbackBase64, companyName);
      return uploadResult.url;
    }
  }

  static async generateNFTImage(description: string, industry: string, startupId?: string): Promise<string> {
    if (!this.API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const prompt = `Generate image for a representating in a company.
Company Details:
- Industry: ${industry}
- Description: ${description}`;

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.API_KEY}`,
          "HTTP-Referer": this.SITE_URL,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          modalities: ['image', 'text'],
        }),
      });

      if (!response.ok) {
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      
      // Check for images in the new response format
      const images = data.choices?.[0]?.message?.images;
      if (images && images.length > 0 && images[0]?.image_url?.url) {
        const base64Image = images[0].image_url.url;
        const cleanedBase64 = this.cleanupBase64Data(base64Image);
        
        // Upload to Supabase and return URL
        const uploadResult = await SupabaseService.uploadNFTImage(cleanedBase64, startupId || 'temp');
        return uploadResult.url;
      }

      // Fallback to old format parsing
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("No content received from AI API");
      }

      // Parse the AI response to get color scheme
      let colorScheme;
      try {
        colorScheme = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        // Fallback to default colors
        colorScheme = {
          primaryColor: "#3B82F6",
          secondaryColor: "#10B981",
          theme: "investment",
          symbols: ["diamond", "chart", "growth"]
        };
      }

      // Generate a 1x1 pixel PNG with the AI-suggested colors and upload to Supabase
      const fallbackBase64 = this.generateColoredPixel(colorScheme.primaryColor);
      const uploadResult = await SupabaseService.uploadNFTImage(fallbackBase64, startupId || 'temp');
      return uploadResult.url;
    } catch (error) {
      console.error("NFT image generation error:", error);
      // Return a fallback 1x1 pixel PNG uploaded to Supabase
      const fallbackBase64 = this.generateColoredPixel("#3B82F6");
      const uploadResult = await SupabaseService.uploadNFTImage(fallbackBase64, startupId || 'temp');
      return uploadResult.url;
    }
  }

  private static generateColoredPixel(primaryColor: string): string {
    // Map colors to different 1x1 pixel PNGs
    // Each color gets a unique but simple 1x1 pixel PNG
    const colorMap: { [key: string]: string } = {
      // Blue tones (Fintech, Trust, Technology)
      '3B82F6': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      '1E40AF': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      '1E3A8A': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      
      // Green tones (Health, Growth, Environment)
      '10B981': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      '059669': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      '047857': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      
      // Purple tones (Creativity, Innovation, EdTech)
      '8B5CF6': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      '7C3AED': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      '6D28D9': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      
      // Red tones (Energy, Commerce, Urgency)
      'EF4444': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'DC2626': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'B91C1C': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      
      // Orange tones (Warmth, Creativity, Learning)
      'F97316': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'EA580C': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'C2410C': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      
      // Yellow/Gold tones (Wealth, Success, Innovation)
      'F59E0B': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'D97706': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'B45309': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    };

    // Extract color without # and normalize
    const color = primaryColor.replace('#', '').toUpperCase();
    
    // Return a color-specific 1x1 pixel PNG, or default blue if color not found
    return colorMap[color] || colorMap['3B82F6'];
  }
}
