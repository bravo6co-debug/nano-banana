# Nano Banana - AI Image Generation & Editing App

AI-powered image generation and editing application using Google's Gemini 2.5 Flash Image Preview API.

## Features

### 🎨 Image Generation
- Text-to-image generation with natural language prompts
- Batch generation for multiple prompts
- Style presets and templates

### 🖼️ Image Editing
- Edit existing images with text prompts
- Multi-image synthesis (combine 2-5 images)
- Interactive multi-turn editing

### 🎯 Prompt Button System
- **Styles**: Anime, Realistic, Watercolor, Oil Painting, 3D, Pixel Art
- **Colors**: Pastel, Neon, Vintage, Black & White
- **People**: Various demographics and expressions
- **Backgrounds**: Studio, Nature, City, Space
- **Effects**: HDR, Bokeh, Motion Blur, Particles

### 📸 One-Click Templates
- Profile Photo
- SNS Thumbnail
- Product Photo
- Character Design
- Logo Design
- YouTube Thumbnail

### 🔒 Safety Features
- SynthID watermark on all generated images
- Content filtering
- Copyright warnings

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: Shadcn UI components + Tailwind CSS
- **AI**: Gemini 2.5 Flash Image Preview API
- **State**: Zustand
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Gemini API key from Google AI Studio

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nano-banana.git
cd nano-banana
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Single Page Interface

The app features a 4-section grid layout:

```
┌─────────────────┬─────────────────┐
│ Prompt Builder  │ Generation Result│
│ (Top Left)      │ (Top Right)      │
├─────────────────┼─────────────────┤
│ Upload/Edit     │ History/Versions │
│ (Bottom Left)   │ (Bottom Right)   │
└─────────────────┴─────────────────┘
```

### Quick Start

1. **Select prompt buttons** from categories or use preset templates
2. **Add custom text** for more specific instructions
3. **Upload images** (optional) for editing or synthesis
4. **Click "Generate Image"** to create
5. **View history** and manage versions

## API Endpoints

- `POST /api/generate` - Generate new image
- `POST /api/edit` - Edit existing image
- `POST /api/synthesize` - Combine multiple images
- `POST /api/watermark` - Detect SynthID watermark

## Development

```bash
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
```

## Performance Goals

- 1024×1024 image generation within 10 seconds (95th percentile)
- 90% character consistency across generations
- 100% SynthID watermark application

## License

MIT

## Acknowledgments

- Powered by Google's Gemini 2.5 Flash Image Preview API
- UI components from Shadcn UI
- Icons from Lucide React