# 🏆 StoryShop Canvas — 對話式「可購漫畫短片」生成畫布

> **一句話故事 + 一張人物/產品照**，在無限畫布上**動態生成 4 格漫畫 → 15 秒配音短片**，主角與產品在所有畫面中**保持一致風格與外觀**，並支援**文字即時編輯與跨實境融合**。

## 📋 產品概述

StoryShop Canvas 是一個革命性的內容創作工具，利用 Gemini 2.5 Flash Image (Nano Banana) 的強大能力，讓創作者能夠：
- 🎨 從單張照片生成角色一致的 4 格漫畫
- 🛍️ 將真實產品自然融入故事場景
- ✨ 用自然語言即時編輯畫面（"改成聖誕夜、加雪花"）
- 🎬 一鍵生成 15 秒配音短片，直接用於社群媒體

## 🎯 目標用戶

1. **內容創作者 / 電商**：快速製作產品故事短片
2. **教育工作者**：將照片轉化為教學漫畫與配音影片
3. **品牌行銷**：維持角色 IP 一致性，快速製作節慶改版內容

## 🚀 核心功能實現

### 1. 角色與產品上傳
```typescript
// 支援角色照片上傳，確保 4 格漫畫中角色外觀一致
setCharacterImage(imageUrl)
// 可選：上傳產品照片，自動融入故事場景
setProductImage(imageUrl)
```

### 2. 智能 4 格漫畫生成
```typescript
// 故事自動分解為 4 個敘事階段
generateStoryParts(story):
  - Setup: 故事開場，建立角色與場景
  - Development: 故事發展，引入衝突或進展
  - Climax: 高潮時刻，情緒或動作巔峰
  - Resolution: 結局收尾，展現結果

// 每格使用一致性 prompt
`${style} style comic panel, consistent character, 
 panel ${i+1} of 4: ${storyPart}, 
 cinematic graphic novel style, soft rim lighting`
```

### 3. 文字編輯功能 (Edit with Words)
```typescript
// 自然語言即時修改畫面
editWithWords({
  imageUrl: panel.url,
  editPrompt: "把黃昏改成聖誕夜、下雪、主角穿毛衣"
})
```

### 4. 產品智能融合
```typescript
// 產品自動匹配場景光源與角度
blendProduct({
  sceneImageUrl: panel.url,
  productImageUrl: product.url,
  blendPrompt: "自然融入場景，匹配光照與陰影"
})
```

### 5. 影片生成整合
```typescript
// Fal.ai 動畫 + ElevenLabs 配音
generateVideoFromPanels({
  panelUrls: comicPanels.map(p => p.url),
  narrationText: storyPrompt,
  duration: 15 // 秒
})
```

## 💡 技術架構

### 前端技術棧
- **React + TypeScript**: 主要框架
- **Fabric.js**: 無限畫布功能
- **Zustand**: 狀態管理（storyShopStore）
- **Tailwind CSS**: 樣式系統

### 後端 API 整合
- **Gemini 2.5 Flash Image**: 
  - 一致性角色生成
  - 文字編輯圖像
  - 產品融合與光照匹配
- **Fal.ai**: 影片合成與轉場動畫
- **ElevenLabs**: AI 語音合成

### API 配額管理
- **每日限制**: 200 requests/day
- **智能快取**: Map 結構儲存生成結果
- **配額分配**:
  - 4 格首次生成: 4 requests
  - 每格編輯上限: 2 requests
  - 產品融合: 4 requests
  - 影片生成: ~5 requests equivalent

## 📱 使用流程

### Step 1: 準備素材
1. 上傳主角照片（可選）
2. 上傳產品照片（可選）
3. 輸入一句話故事

### Step 2: 生成漫畫
1. 選擇視覺風格（comic/manga/disney/realistic/anime/vintage）
2. 點擊「Generate 4-Panel Comic」
3. 系統自動分解故事為 4 個階段並生成

### Step 3: 文字編輯（可選）
1. 在編輯框輸入修改指令
2. 選擇「Edit All Panels」或編輯特定面板
3. 即時看到修改結果

### Step 4: 生成影片
1. 點擊「Make 15s Video」
2. 自動生成配音旁白
3. 輸出垂直影片格式（1080×1920）

## 🎨 Prompt 模板

### 角色一致性
```
System style: cinematic graphic novel, soft rim light, 35mm, f/2.8, medium shot
Subject: {character_desc} // "short-haired barista in beige coat"
Constraint: keep facial traits and outfit consistent across panels
Background: {setting_desc} // "cozy café at dusk"
```

### 產品融合
```
Blend this product photo into the scene as an in-hand prop
Match scene lighting/color temperature; plausible scale; natural shadow
Keep product brand area clean and readable
```

### 文字編輯
```
Edit with words: change time to snowy Christmas night; add soft falling snow;
change mug color to matte red; keep character and composition unchanged
```

## 📊 效能優化

### 快取策略
- 相同 prompt 結果快取 15 分鐘
- 使用 hash key: `comic_${story}_${style}_${character}_${product}`
- 避免重複生成，節省 API 配額

### 並行處理
- 4 格漫畫同時生成（Promise.all）
- 影片與音訊並行處理
- UI 響應式更新，不阻塞用戶操作

### 降級方案
- 一致性失敗 → 切換 figurine/sticker 風格
- 融合不自然 → 強制陰影與色溫匹配
- 配額不足 → 顯示剩餘次數，鎖定功能

## 🚦 已知限制

1. **API 配額**: 每日 200 次請求限制
2. **圖像尺寸**: 目前固定 512×512 像素
3. **影片長度**: 固定 15 秒
4. **角色數量**: 最佳效果為單一主角

## 🔮 未來計畫

### Phase 2 功能
- [ ] 多角色支援與互動
- [ ] 自訂影片長度（10-30 秒）
- [ ] 更多語音選項（性別、語言、情緒）
- [ ] 漫畫模板庫

### Phase 3 功能
- [ ] AI 自動故事延續
- [ ] 社群分享整合
- [ ] 協作編輯功能
- [ ] NFT 鑄造選項

## 📝 程式碼結構

```
src/
├── components/panels/
│   └── AIPanel.tsx          # StoryShop UI 主介面
├── store/
│   └── storyShopStore.ts    # 狀態管理與業務邏輯
├── services/
│   └── aiService.ts         # API 整合層
└── types/
    └── ai.ts                # TypeScript 類型定義
```

## 🎯 2 分鐘 Demo 腳本

**0:00-0:08** 
> "傳統內容創作耗時費力，StoryShop Canvas 讓你一拖一寫，秒變漫畫與影片"

**0:08-0:25**
> 拖入角色照 → 輸入"聖誕夜的咖啡邂逅" → 拖入馬克杯產品照

**0:25-0:55**
> 生成 4 格漫畫，展示角色一致性與產品自然融合

**0:55-1:15**
> 文字編輯："改成雪夜、主角穿紅毛衣" → 全部面板同步更新

**1:15-1:40**
> 一鍵生成影片，播放配音旁白與動畫效果

**1:40-2:00**
> 展示輸出：漫畫圖、影片檔、社群海報
> "StoryShop Canvas - 把真實產品帶進你的故事宇宙"

## 🛠️ 環境設置

```bash
# 安裝依賴
npm install

# 設置環境變數
cp .env.example .env
# 編輯 .env 加入 API keys

# 開發模式
npm run dev

# 構建生產版本
npm run build
```

## 📄 授權

MIT License - 開源專案，歡迎貢獻

---

**🤖 Generated with [Claude Code](https://claude.ai/code)**  
**Co-Authored-By: Claude <noreply@anthropic.com>**

---

## 聯絡資訊

- GitHub: [OmniCanvas Repository](https://github.com/JoeyJAL/OmniCanvas)
- Demo: [即將上線]
- 問題回報: [GitHub Issues](https://github.com/JoeyJAL/OmniCanvas/issues)