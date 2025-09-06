# OmniCanvas Backend API

安全的後端服務，管理所有AI API keys並提供圖像生成、合成等功能。

## 🚀 本地端快速開始

### 1. 安裝依賴
```bash
cd quick-backend
npm install
```

### 2. 設定環境變數
```bash
# 複製環境變數範例檔案
cp .env.example .env

# 編輯 .env 檔案，填入你的API keys
# 至少需要 GEMINI_API_KEY
```

### 3. 獲取API Keys

**必要：Gemini API Key**
1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 點擊 "Create API Key"
3. 複製API key到 `.env` 檔案中

**可選：ElevenLabs API Key** 
1. 前往 [ElevenLabs](https://elevenlabs.io/app/settings)
2. 複製API key

### 4. 啟動服務
```bash
npm start
```

服務將運行在 `http://localhost:3001`

### 5. 測試連接
```bash
curl http://localhost:3001/api/health
```

## 📡 部署選項

### Option 1: Vercel (推薦 - 免費)
```bash
npm install -g vercel
vercel --prod
```

在Vercel dashboard設定環境變數：
- `GEMINI_API_KEY`
- `ELEVENLABS_API_KEY` (可選)
- `FAL_AI_API_KEY` (可選)

### Option 2: Railway (簡單部署)
1. 前往 [Railway.app](https://railway.app)
2. 連接GitHub repository
3. 設定環境變數
4. 自動部署

### Option 3: Render (免費方案)
1. 前往 [Render.com](https://render.com)
2. 選擇 "New Web Service"
3. 連接repository
4. 設定環境變數

### Option 4: Heroku
```bash
# 安裝 Heroku CLI
npm install -g heroku

# 創建應用
heroku create omnicanvas-backend

# 設定環境變數
heroku config:set GEMINI_API_KEY=your_key_here

# 部署
git push heroku main
```

## 🔧 API端點

```
GET  /api/health                    # 健康檢查
POST /api/ai/generate-image         # 圖像生成
POST /api/ai/merge-images          # AI智能合成
POST /api/ai/transfer-style        # 風格轉換
POST /api/ai/generate-similar      # 相似圖片生成
POST /api/ai/elevenlabs           # 語音生成
```

## 🛡️ 安全特性

- ✅ API keys僅存於後端伺服器
- ✅ CORS保護
- ✅ 請求大小限制 (50MB)
- ✅ 錯誤處理和日誌記錄
- ✅ 環境變數驗證

## 🔧 前端設定

在OmniCanvas前端的設定面板中：
- **本地端**: `http://localhost:3001/api`
- **部署後**: `https://your-app.vercel.app/api`

## 📊 監控和日誌

服務會輸出詳細日誌：
```
🚀 OmniCanvas Backend API running on port 3001
🔑 API Keys configured: { gemini: true, elevenlabs: false }
🎨 Generating image with Gemini...
✅ Gemini response received
```

## ⚠️ 注意事項

1. **環境變數**: 絕對不要將 `.env` 檔案提交到版本控制
2. **API配額**: 注意各平台的API使用限制
3. **圖片大小**: 大型圖片可能需要更多處理時間
4. **CORS**: 部署後記得更新 `FRONTEND_URL` 環境變數

## 🔄 更新部署

本地測試後，推送到生產環境：
```bash
git add .
git commit -m "Update backend API"
git push origin main  # 自動觸發部署
```