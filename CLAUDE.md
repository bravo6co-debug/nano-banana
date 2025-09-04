# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Nano Banana - AI Image Generation & Editing App

This is a single-page application (SPA) for AI-powered image generation and editing using Google's Gemini 2.5 Flash Image Preview API (aka "Nano Banana").

## Core Technologies
- **Framework**: Next.js 14 with App Router
- **UI**: Shadcn UI components with Tailwind CSS
- **AI Model**: Gemini 2.5 Flash Image Preview API
- **State Management**: Zustand or React Context
- **Image Processing**: Canvas API, File API
- **Database**: SQLite (development), PostgreSQL (production)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check

# Run tests
npm test

# Run single test
npm test -- --testNamePattern="test-name"
```

## Architecture Overview

### Single Page Layout Structure
The app uses a 4-section grid layout on a single page:
- **Top-Left**: Prompt Builder (buttons, categories, text input)
- **Top-Right**: Image Generation Results & Preview
- **Bottom-Left**: Upload & Edit Tools
- **Bottom-Right**: History & Version Management

### Key API Routes
- `/api/generate` - Text-to-image generation via Gemini API
- `/api/edit` - Image editing with text prompts
- `/api/synthesize` - Multi-image synthesis
- `/api/watermark` - SynthID watermark detection

### State Management
Global state includes:
- Current prompt composition
- Generated images array
- History tree structure
- User preferences
- API usage stats

### Component Structure
```
src/
├── app/
│   ├── page.tsx (main single-page app)
│   └── api/ (API routes)
├── components/
│   ├── PromptBuilder/ (prompt button system)
│   ├── ImageCanvas/ (generation/editing area)
│   ├── UploadZone/ (drag & drop upload)
│   └── HistoryPanel/ (version management)
└── lib/
    ├── gemini.ts (API client)
    ├── prompts.ts (prompt templates)
    └── storage.ts (image/history management)
```

## Gemini API Integration

The app uses `gemini-2.5-flash-image-preview` model for:
1. Text-to-image generation
2. Image + text editing
3. Multi-image synthesis

Example API call:
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-image-preview",
  contents: [
    { text: prompt },
    ...images.map(img => ({
      inlineData: { data: img, mimeType: "image/png" }
    }))
  ]
});
```

## Prompt Button System

Categories with preset buttons:
- **Styles**: anime, realistic, watercolor, oil painting, 3D, pixel art
- **Colors**: pastel, neon, vintage, black & white, high saturation
- **People**: Korean, Asian, Western, male, female, child
- **Backgrounds**: studio, nature, city, indoor, fantasy, space
- **Effects**: HDR, bokeh, motion blur, light rays, fog, particles

## Performance Requirements
- 1024×1024 image generation within 10 seconds (95th percentile)
- 90% character consistency across generations
- 100% SynthID watermark application and detection

## Security & Safety
- All generated images include SynthID watermark
- Content filtering for inappropriate requests
- Copyright warnings for commercial use
- User consent checkboxes for image uploads

## Environment Variables
```
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

## Testing Approach
- Unit tests for prompt composition logic
- Integration tests for API routes
- E2E tests for user workflows
- Visual regression tests for UI components

## Common Development Tasks

### Adding New Prompt Buttons
Edit `src/lib/prompts.ts` to add new categories or buttons.

### Customizing Layout
Modify grid structure in `src/app/page.tsx` using Tailwind classes.

### API Rate Limiting
Implement queue system in `src/lib/gemini.ts` for batch processing.

## Important Notes
- Always handle API errors gracefully with user-friendly messages
- Implement proper loading states for all async operations
- Cache generated images locally to reduce API calls
- Use optimistic UI updates for better perceived performance
- Ensure all images are properly cleaned up from memory after use