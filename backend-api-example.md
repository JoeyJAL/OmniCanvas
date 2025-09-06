# Backend API Service Example

這是一個參考實現，展示如何創建一個後端服務來管理API keys並提供AI功能。

## API Endpoints

### 1. Health Check
```
GET /api/health
Response: { status: "ok", timestamp: "2024-01-01T00:00:00Z" }
```

### 2. Generate Image (Gemini)
```
POST /api/ai/generate-image
Body: {
  "prompt": "A beautiful landscape",
  "width": 512,
  "height": 512,
  "provider": "gemini"
}
Response: {
  "imageUrl": "https://...",
  "width": 512,
  "height": 512,
  "metadata": { "model": "gemini-2.5-flash-image" }
}
```

### 3. Merge Images (Gemini Multi-modal)
```
POST /api/ai/merge-images
Body: {
  "imageUrls": ["https://...", "https://..."],
  "prompt": "Intelligent auto-compose",
  "provider": "gemini"
}
Response: {
  "imageUrl": "https://...",
  "metadata": { "originalImages": 2 }
}
```

### 4. Style Transfer (Gemini)
```
POST /api/ai/transfer-style
Body: {
  "imageUrl": "https://...",
  "style": "Van Gogh style",
  "provider": "gemini"
}
Response: {
  "imageUrl": "https://..."
}
```

### 5. Generate Similar (Gemini)
```
POST /api/ai/generate-similar
Body: {
  "prompt": "Similar image description",
  "width": 512,
  "height": 512,
  "provider": "gemini"
}
Response: {
  "imageUrl": "https://...",
  "width": 512,
  "height": 512
}
```

### 6. Voice Generation (ElevenLabs)
```
POST /api/ai/elevenlabs
Body: {
  "text": "Hello world",
  "voiceId": "default",
  "provider": "elevenlabs"
}
Response: {
  "audioUrl": "https://..."
}
```

## Environment Variables

在後端服務中設定以下環境變數：

```env
# API Keys (安全地存儲在後端)
GEMINI_API_KEY=your_gemini_api_key_here
FAL_AI_API_KEY=your_fal_ai_key_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS (如果需要)
FRONTEND_URL=http://localhost:3005
```

## Sample Node.js Implementation

### server.js
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3005'
}));
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gemini image generation
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const { prompt, width = 512, height = 512 } = req.body;
    
    // Call Gemini API with your secure API key
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent', {
      method: 'POST',
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();
    // Process response and return image URL
    res.json({ imageUrl: processGeminiResponse(data), width, height });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gemini image merging (multi-modal)
app.post('/api/ai/merge-images', async (req, res) => {
  try {
    const { imageUrls, prompt } = req.body;
    
    // Convert images to base64 and send to Gemini
    const parts = await Promise.all(
      imageUrls.map(async (url) => {
        const response = await fetch(url);
        const buffer = await response.buffer();
        return {
          inlineData: {
            mimeType: 'image/jpeg',
            data: buffer.toString('base64')
          }
        };
      })
    );
    
    parts.push({ text: prompt });

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent', {
      method: 'POST',
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
      })
    });

    const data = await response.json();
    res.json({ imageUrl: processGeminiResponse(data) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ElevenLabs voice generation
app.post('/api/ai/elevenlabs', async (req, res) => {
  try {
    const { text, voiceId = 'default' } = req.body;
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1'
      })
    });

    const audioBuffer = await response.buffer();
    // Save to temporary file or cloud storage and return URL
    const audioUrl = await saveAudioFile(audioBuffer);
    res.json({ audioUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API server running on port ${PORT}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL}`);
});
```

### package.json
```json
{
  "name": "omnicanvas-backend",
  "version": "1.0.0",
  "description": "Backend API service for OmniCanvas AI features",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

## Security Benefits

1. **API Key Security**: Keys never exposed to frontend
2. **Rate Limiting**: Control API usage per user/session
3. **Request Validation**: Sanitize and validate all inputs
4. **CORS Protection**: Only allow requests from your frontend
5. **Logging**: Track API usage and errors
6. **Caching**: Cache responses to reduce API costs

## Deployment Options

- **Local Development**: `npm run dev` on localhost:3001
- **Production**: Deploy to Heroku, Vercel, AWS, or your preferred platform
- **Docker**: Containerize for consistent deployment
- **Environment**: Set all API keys as secure environment variables

## Usage

1. 設定你的API keys在後端環境變數中
2. 啟動後端服務: `npm start`
3. 前端會自動連接到 `http://localhost:3001/api`
4. 所有AI功能將通過安全的後端代理處理

這樣你的API keys就完全安全了！ 🔐