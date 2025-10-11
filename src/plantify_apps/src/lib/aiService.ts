import { StartupFormData } from '@/components/startup/types';

// Startup interface for analysis
interface Startup {
  id: string;
  startupName: string;
  description: string;
  sector: string;
  location: string;
  teamMembers?: { name: string; role: string }[];
  monthlyRevenue?: string;
  fundingGoal: string;
  nftPrice: string;
  periodicProfitSharing: string;
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';

const IMAGE_MODEL = 'google/gemini-2.5-flash-image-preview';
const TEXT_MODEL = 'anthropic/claude-3.5-sonnet';

export interface NFTImagePrompt {
  object: {
    type: string;
    container: string;
    details: {
      leaves_color: string;
      body_shape: string;
      face_expression: string;
    };
  };
  environment: {
    lighting: string;
    background: {
      type: string;
      colors: string[];
    };
  };
  style: {
    theme: string;
    aesthetic: string[];
    use_case: string;
    render_style: string;
  };
  composition: {
    focus: string;
    mood: string;
  };
  metadata: {
    version: string;
    language: string;
    customizable_fields: string[];
  };
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
  metadata: NFTImagePrompt;
}

/**
 * Generates a plant character NFT prompt based on startup information
 */
export function generateNFTPrompt(formData: StartupFormData): NFTImagePrompt {
  const getPlantCharacteristics = (sector: string) => {
    const sectorMap: Record<
      string,
      { color: string; shape: string; expression: string }
    > = {
      Technology: {
        color: 'electric blue',
        shape: 'tall and sleek',
        expression: 'confident with tech-inspired eyes',
      },
      Healthcare: {
        color: 'healing green',
        shape: 'rounded and nurturing',
        expression: 'caring with gentle smile',
      },
      Finance: {
        color: 'golden yellow',
        shape: 'strong and stable',
        expression: 'wise with determined look',
      },
      Education: {
        color: 'bright orange',
        shape: 'curious and growing',
        expression: 'eager with learning sparkle',
      },
      'E-commerce': {
        color: 'vibrant purple',
        shape: 'dynamic and flexible',
        expression: 'energetic with shopping excitement',
      },
      'Food & Beverage': {
        color: 'fresh mint green',
        shape: 'plump and healthy',
        expression: 'satisfied with content smile',
      },
      Energy: {
        color: 'solar yellow',
        shape: 'radiant and powerful',
        expression: 'bright with energy glow',
      },
      Transportation: {
        color: 'speed red',
        shape: 'streamlined and fast',
        expression: 'focused with movement lines',
      },
      'Real Estate': {
        color: 'earth brown',
        shape: 'solid and grounded',
        expression: 'reliable with foundation strength',
      },
      Entertainment: {
        color: 'rainbow spectrum',
        shape: 'playful and varied',
        expression: 'joyful with entertainment sparkle',
      },
    };

    return (
      sectorMap[sector] || {
        color: 'bright green',
        shape: 'small soil mound',
        expression: 'smiling with big round eyes and blushing cheeks',
      }
    );
  };

  const getContainerStyle = (companyType: string) => {
    const containerMap: Record<string, string> = {
      Startup: 'modern transparent glass pot with geometric edges',
      Corporation: 'premium ceramic pot with elegant design',
      'Non-profit': 'eco-friendly biodegradable pot',
      Partnership: 'collaborative dual-section pot',
      LLC: 'professional business-style pot',
      'Sole Proprietorship': 'personal handcrafted pot',
    };

    return containerMap[companyType] || 'round transparent glass pot';
  };

  const getBackgroundColors = (fundingGoal: string) => {
    const goal = Number(fundingGoal) || 0;
    if (goal < 10000) return ['soft pink', 'light blue'];
    if (goal < 100000) return ['warm orange', 'golden yellow'];
    if (goal < 1000000) return ['rich purple', 'deep blue'];
    return ['premium gold', 'platinum silver'];
  };

  const getLightingStyle = (teamSize: number) => {
    if (teamSize === 1) return 'focused spotlight with gentle glow';
    if (teamSize <= 3) return 'warm team lighting with collaborative shadows';
    if (teamSize <= 10) return 'bright group lighting with energy highlights';
    return 'powerful stage lighting with professional highlights';
  };

  const plantChar = getPlantCharacteristics(formData.sector);
  const container = getContainerStyle(formData.companyType);
  const backgroundColors = getBackgroundColors(formData.fundingGoal);
  const teamSize = formData.teamMembers.length + 1;
  const lighting = getLightingStyle(teamSize);

  return {
    object: {
      type: 'plant character',
      container,
      details: {
        leaves_color: plantChar.color,
        body_shape: plantChar.shape,
        face_expression: plantChar.expression,
      },
    },
    environment: {
      lighting,
      background: {
        type: 'gradient',
        colors: backgroundColors,
      },
    },
    style: {
      theme: 'kawaii',
      aesthetic: ['soft', 'minimal', 'colorful', 'adorable'],
      use_case: 'collectible NFT card illustration',
      render_style: '2D soft digital illustration',
    },
    composition: {
      focus: 'centered subject',
      mood: 'happy and cute',
    },
    metadata: {
      version: '1.0',
      language: 'en',
      customizable_fields: [
        'leaves_color',
        'background.colors',
        'face_expression',
        'style.theme',
      ],
    },
  };
}

/**
 * Generates a text prompt for the AI model based on the NFT prompt structure
 */
export function generateTextPrompt(nftPrompt: NFTImagePrompt): string {
  const { object, environment, style, composition } = nftPrompt;

  return `Create a ${style.render_style} of a ${object.type} in a ${object.container}. 
  
  Character details:
  - Leaves: ${object.details.leaves_color}
  - Body shape: ${object.details.body_shape}
  - Face: ${object.details.face_expression}
  
  Environment:
  - Lighting: ${environment.lighting}
  - Background: ${environment.background.type} with colors ${environment.background.colors.join(' and ')}
  
  Style:
  - Theme: ${style.theme}
  - Aesthetic: ${style.aesthetic.join(', ')}
  - Use case: ${style.use_case}
  
  Composition:
  - Focus: ${composition.focus}
  - Mood: ${composition.mood}
  
  Make it perfect for a collectible NFT card - ${style.aesthetic.join(', ')} and ${composition.mood}.`;
}

/**
 * Calls the OpenRouter API to generate an NFT image
 */
export async function generateNFTImage(
  formData: StartupFormData
): Promise<GeneratedImage> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  try {
    const nftPrompt = generateNFTPrompt(formData);

    const textPrompt = generateTextPrompt(nftPrompt);

    console.log('Generating NFT image with prompt:', textPrompt);

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        messages: [
          {
            role: 'user',
            content: textPrompt,
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (result.choices && result.choices.length > 0) {
      const message = result.choices[0].message;
      if (message.images && message.images.length > 0) {
        const imageUrl = message.images[0].image_url.url;

        return {
          imageUrl,
          prompt: textPrompt,
          metadata: nftPrompt,
        };
      }
    }

    throw new Error('No image generated in the response');
  } catch (error) {
    console.error('Error generating NFT image:', error);
    throw new Error(
      `Failed to generate NFT image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generates a fallback NFT image using a simple SVG pattern
 * This can be used when the AI service is unavailable
 */
export function generateFallbackNFTImage(formData: StartupFormData): string {
  const nftPrompt = generateNFTPrompt(formData);
  const { object, environment } = nftPrompt;

  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${environment.background.colors[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${environment.background.colors[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="400" height="400" fill="url(#bg)" />
      
      <!-- Glass pot -->
      <ellipse cx="200" cy="320" rx="80" ry="40" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
      
      <!-- Plant body -->
      <ellipse cx="200" cy="280" rx="60" ry="80" fill="#8B4513"/>
      
      <!-- Leaves -->
      <circle cx="200" cy="200" r="50" fill="${object.details.leaves_color}"/>
      <circle cx="180" cy="180" r="30" fill="${object.details.leaves_color}"/>
      <circle cx="220" cy="180" r="30" fill="${object.details.leaves_color}"/>
      
      <!-- Face -->
      <circle cx="200" cy="210" r="8" fill="black"/> <!-- Left eye -->
      <circle cx="220" cy="210" r="8" fill="black"/> <!-- Right eye -->
      <path d="M 190 230 Q 200 240 210 230" stroke="black" stroke-width="2" fill="none"/> <!-- Smile -->
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Interface for startup analysis result
 */
export interface StartupAnalysisResult {
  overallScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  investmentRecommendation:
    | 'strong_buy'
    | 'buy'
    | 'hold'
    | 'sell'
    | 'strong_sell';
  riskLevel: 'low' | 'medium' | 'high';
  summary: string;
  keyMetrics: {
    marketPotential: number;
    teamStrength: number;
    financialHealth: number;
    competitivePosition: number;
    scalability: number;
  };
}

/**
 * Analyzes a startup using AI and returns comprehensive analysis
 */
export async function analyzeStartup(
  startupData: Startup
): Promise<StartupAnalysisResult> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  try {
    const analysisPrompt = `
You are a professional startup investment analyst. Analyze the following startup and provide a comprehensive investment analysis.

Startup Information:
- Name: ${startupData.startupName}
- Sector: ${startupData.sector}
- Description: ${startupData.description}
- Location: ${startupData.location}
- Team Size: ${startupData.teamMembers?.length || 'Unknown'}
- Monthly Revenue: ${startupData.monthlyRevenue || 'Not disclosed'}
- Funding Goal: ${startupData.fundingGoal}
- NFT Price: ${startupData.nftPrice}
- Profit Sharing: ${startupData.periodicProfitSharing}

Please provide a detailed analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "strengths": [<array of key strengths>],
  "weaknesses": [<array of potential weaknesses>],
  "opportunities": [<array of market opportunities>],
  "threats": [<array of potential threats>],
  "investmentRecommendation": "<strong_buy|buy|hold|sell|strong_sell>",
  "riskLevel": "<low|medium|high>",
  "summary": "<2-3 sentence executive summary>",
  "keyMetrics": {
    "marketPotential": <number 0-100>,
    "teamStrength": <number 0-100>,
    "financialHealth": <number 0-100>,
    "competitivePosition": <number 0-100>,
    "scalability": <number 0-100>
  }
}

Base your analysis on startup fundamentals, market conditions, financial metrics, and industry trends. Be objective and provide actionable insights.
`;

    console.log('Analyzing startup with AI...');

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();

    if (result.choices && result.choices.length > 0) {
      const content = result.choices[0].message.content;

      try {
        // Extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisResult = JSON.parse(jsonMatch[0]);
          return analysisResult as StartupAnalysisResult;
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI analysis result');
      }
    }

    throw new Error('No analysis generated in the response');
  } catch (error) {
    console.error('Error analyzing startup:', error);
    throw new Error(
      `Failed to analyze startup: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
