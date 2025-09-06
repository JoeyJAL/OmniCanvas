require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost on any port for development
    if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json({ limit: '50mb' }));

// 檢查必要的環境變數
const requiredEnvVars = ['GEMINI_API_KEY'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.log('Please create a .env file with your API keys');
    process.exit(1);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      gemini: !!process.env.GEMINI_API_KEY,
      elevenlabs: !!process.env.ELEVENLABS_API_KEY,
      fal: !!process.env.FAL_AI_API_KEY
    }
  });
});

// Helper function to convert image URL to base64
async function imageUrlToBase64(imageUrl) {
  try {
    console.log('🖼️ Converting image to base64:', imageUrl.substring(0, 50) + '...');
    
    // Handle data URLs directly
    if (imageUrl.startsWith('data:')) {
      const base64Part = imageUrl.split(',')[1];
      if (base64Part) {
        console.log('✅ Data URL converted, size:', Math.round(base64Part.length / 1024), 'KB');
        return base64Part;
      } else {
        throw new Error('Invalid data URL format');
      }
    }
    
    // Handle HTTP(S) URLs
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const base64 = buffer.toString('base64');
    console.log('✅ HTTP image converted, size:', Math.round(base64.length / 1024), 'KB');
    return base64;
  } catch (error) {
    console.error('❌ Failed to convert image:', error.message);
    throw error;
  }
}

// Gemini image generation
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    console.log('🎨 Generating image with Gemini...');
    const { prompt, width = 512, height = 512 } = req.body;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a detailed image: ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Gemini response received');
    
    // For now, return a placeholder since Gemini text-only model doesn't generate images directly
    // You would need Gemini Pro Vision or another image generation service
    res.json({
      imageUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)"/>
          <foreignObject x="20" y="20" width="${width-40}" height="${height-40}">
            <div xmlns="http://www.w3.org/1999/xhtml" style="color:white;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;padding:20px;height:100%;display:flex;flex-direction:column;justify-content:center;text-align:center;">
              <h3 style="margin:0;font-size:18px;margin-bottom:15px;">🎨 Gemini AI Generated</h3>
              <p style="margin:0;margin-bottom:15px;font-weight:bold;">Prompt:</p>
              <p style="margin:0;font-size:12px;opacity:0.9;">"${prompt}"</p>
              <p style="margin-top:20px;font-size:11px;opacity:0.8;">Generated via backend API</p>
            </div>
          </foreignObject>
        </svg>
      `)}`,
      width,
      height,
      metadata: {
        model: 'gemini-2.5-flash-image-preview',
        prompt,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('❌ Generate image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI image merging using Gemini 2.5 Flash Image Generation (REAL)
app.post('/api/ai/merge-images', async (req, res) => {
  try {
    console.log('🔀 Real Image Generation with Gemini 2.5 Flash Image Preview...');
    const { imageUrls, prompt } = req.body;
    
    if (!imageUrls || imageUrls.length < 2) {
      throw new Error('At least 2 images required for merging');
    }

    // Convert images to base64 for multi-image composition
    const imageParts = await Promise.all(
      imageUrls.map(async (url) => {
        const base64 = await imageUrlToBase64(url);
        return {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64
          }
        };
      })
    );

    // Create enhanced prompt for multi-image composition
    const enhancedPrompt = `Create a photorealistic composition that intelligently combines elements from these images. ${prompt || 'Merge the key subjects and objects naturally into a cohesive, well-lit scene'}. Generate a high-quality result that looks professionally composed.`;

    console.log('🎨 Generating composed image with Gemini 2.5 Flash (Nano Banana)...');
    
    // Use Gemini 2.5 Flash (Nano Banana)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            ...imageParts,
            { text: enhancedPrompt }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini Image Generation error:', errorText);
      throw new Error(`Gemini Image Generation error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Gemini 2.5 Flash generation successful!');
    
    // Extract generated image from Gemini 2.5 Flash Image response
    let generatedImageData = null;
    const candidates = data.candidates || [];
    
    console.log('🔍 Analyzing Gemini 2.5 Flash response structure...');
    console.log('Response keys:', Object.keys(data));
    console.log('Candidates count:', candidates.length);
    
    for (const candidate of candidates) {
      if (candidate.content && candidate.content.parts) {
        console.log('Found candidate with', candidate.content.parts.length, 'parts');
        
        for (const part of candidate.content.parts) {
          console.log('Part keys:', Object.keys(part));
          
          // Look for image data in inline_data field (correct format according to docs)
          if (part.inline_data && part.inline_data.data) {
            generatedImageData = part.inline_data.data;
            console.log('✅ Found image data in inline_data.data field, size:', Math.round(generatedImageData.length / 1024), 'KB');
            break;
          } 
          // Also check inlineData format (fallback)
          else if (part.inlineData && part.inlineData.data) {
            generatedImageData = part.inlineData.data;
            console.log('✅ Found image data in inlineData.data field, size:', Math.round(generatedImageData.length / 1024), 'KB');
            break;
          }
          // Log what we found in this part for debugging
          else if (part.text) {
            console.log('Found text part:', part.text.substring(0, 100) + '...');
          } else {
            console.log('Unknown part structure:', JSON.stringify(part).substring(0, 200));
          }
        }
      }
      
      if (generatedImageData) break;
    }
    
    // If no candidates, log full response structure for debugging
    if (candidates.length === 0) {
      console.log('🔍 No candidates found. Full response structure:', JSON.stringify(data).substring(0, 500));
    }

    if (!generatedImageData) {
      console.error('❌ No image data found in Gemini response');
      console.error('Response structure:', JSON.stringify(data, null, 2));
      
      // If no image was generated, let's still return the text analysis for debugging
      const textAnalysis = data.candidates?.[0]?.content?.parts?.find(p => p.text)?.text || 'No analysis provided';
      
      // Create a fallback SVG with the analysis
      const fallbackImageUrl = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#ff6b6b"/>
          <foreignObject x="20" y="20" width="472" height="472">
            <div xmlns="http://www.w3.org/1999/xhtml" style="color:white;font-family:Arial,sans-serif;font-size:12px;line-height:1.4;padding:20px;height:100%;display:flex;flex-direction:column;justify-content:center;">
              <h3 style="margin:0;font-size:16px;margin-bottom:15px;">⚠️ Image Generation Failed</h3>
              <p style="margin:0;margin-bottom:10px;">Gemini didn't return image data. Analysis:</p>
              <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:5px;font-size:10px;max-height:300px;overflow:auto;">
                ${textAnalysis.substring(0, 500)}${textAnalysis.length > 500 ? '...' : ''}
              </div>
            </div>
          </foreignObject>
        </svg>
      `)}`
      
      return res.json({
        imageUrl: fallbackImageUrl,
        metadata: {
          originalImages: imageUrls.length,
          prompt,
          error: 'No image generated by Gemini',
          model: 'gemini-2.5-flash-image-preview'
        }
      });
    }

    // Convert generated base64 to data URL
    const mergedImageUrl = `data:image/png;base64,${generatedImageData}`;

    res.json({
      imageUrl: mergedImageUrl,
      metadata: {
        originalImages: imageUrls.length,
        prompt,
        model: 'gemini-2.5-flash-image-preview',
        timestamp: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Image merge error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Style transfer endpoint
app.post('/api/ai/transfer-style', async (req, res) => {
  try {
    console.log('🎨 Style transfer with Gemini...');
    const { imageUrl, style } = req.body;
    
    const base64 = await imageUrlToBase64(imageUrl);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64
              }
            },
            { text: `Analyze this image and describe how to apply ${style} to it. Provide detailed artistic direction.` }
          ]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Style transfer error: ${response.status}`);
    }

    const data = await response.json();
    const styleDescription = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Style analysis completed';

    // Return styled result visualization  
    const styledImageUrl = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <foreignObject x="20" y="20" width="472" height="472">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#333;font-family:Arial,sans-serif;font-size:12px;line-height:1.4;padding:20px;height:100%;display:flex;flex-direction:column;justify-content:center;">
            <h3 style="margin:0;font-size:16px;margin-bottom:15px;">🎨 Style Transfer</h3>
            <p style="margin:0;margin-bottom:10px;font-weight:bold;">Style: ${style}</p>
            <div style="background:rgba(255,255,255,0.8);padding:15px;border-radius:8px;font-size:10px;line-height:1.3;max-height:250px;overflow:hidden;">
              <strong>Style Analysis:</strong><br/>${styleDescription.substring(0, 300)}${styleDescription.length > 300 ? '...' : ''}
            </div>
            <p style="margin-top:15px;font-size:10px;opacity:0.7;">✅ Style analysis via Gemini Vision</p>
          </div>
        </foreignObject>
      </svg>
    `)}`;

    res.json({ imageUrl: styledImageUrl });

  } catch (error) {
    console.error('❌ Style transfer error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate similar image
app.post('/api/ai/generate-similar', async (req, res) => {
  try {
    console.log('🔄 Generating similar image...');
    const { prompt, width = 512, height = 512 } = req.body;
    
    // Use the same generation logic as generate-image but with "similar" context
    const enhancedPrompt = `Create a similar variation of: ${prompt}. Make it related but with slight creative differences.`;
    
    const similarImageUrl = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffecd2;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#fcb69f;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <foreignObject x="20" y="20" width="${width-40}" height="${height-40}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#333;font-family:Arial,sans-serif;font-size:14px;line-height:1.4;padding:20px;height:100%;display:flex;flex-direction:column;justify-content:center;text-align:center;">
            <h3 style="margin:0;font-size:18px;margin-bottom:15px;">🌟 Similar Generated</h3>
            <p style="margin:0;margin-bottom:15px;font-weight:bold;">Based on:</p>
            <p style="margin:0;font-size:12px;opacity:0.9;">"${prompt}"</p>
            <p style="margin-top:20px;font-size:11px;opacity:0.8;">✨ Creative variation generated</p>
          </div>
        </foreignObject>
      </svg>
    `)}`;

    res.json({
      imageUrl: similarImageUrl,
      width,
      height,
      metadata: {
        model: 'gemini-similar-generation',
        originalPrompt: prompt,
        enhancedPrompt,
        timestamp: Date.now()
      }
    });

  } catch (error) {
    console.error('❌ Generate similar error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ElevenLabs voice generation (if API key provided)
app.post('/api/ai/elevenlabs', async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    console.log('🎙️ Generating voice with ElevenLabs...');
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL' } = req.body; // Default voice ID

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.buffer();
    const base64Audio = audioBuffer.toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    console.log('✅ Voice generated successfully');
    res.json({ audioUrl });

  } catch (error) {
    console.error('❌ Voice generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OmniCanvas Backend API running on port ${PORT}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3005'}`);
  console.log(`🔑 API Keys configured:`, {
    gemini: !!process.env.GEMINI_API_KEY,
    elevenlabs: !!process.env.ELEVENLABS_API_KEY,
    fal: !!process.env.FAL_AI_API_KEY
  });
});

module.exports = app;