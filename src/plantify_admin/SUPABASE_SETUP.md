# Supabase Setup for Image Storage

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://b30d7a94c3830e62994a4f9d5ae4f4c7.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=15df6f1e1a03f841707282fd1db3c0f459d06e794bf9f45b50d4f6bfb0e3f681

# OpenRouter API
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site URL
NEXT_PUBLIC_SITE_URL=https://plantify-admin.vercel.app
```

## Supabase Storage Setup

1. Create a storage bucket named `plantify-images` in your Supabase project
2. Set the bucket to public so images can be accessed via URLs
3. The service will automatically create folders:
   - `logos/` - for company logos
   - `nfts/` - for NFT images

## How It Works

1. **AI Image Generation**: When generating startup data, the AI service now:
   - Generates images using Gemini
   - Uploads base64 images to Supabase Storage
   - Returns Supabase URLs instead of base64 data

2. **Backend Integration**: The backend service receives Supabase URLs and stores them in the canister as string arrays

3. **Image Access**: Images are accessed directly from Supabase URLs, reducing canister storage and improving performance

## Benefits

- Reduces canister storage usage
- Improves performance by serving images from CDN
- Better scalability for image storage
- Easier image management and updates
