# 🚀 Vercel 部署指南

## 部署步驟

### 1. 登入 Vercel
```bash
vercel login
```
選擇登入方式（GitHub/GitLab/Email）

### 2. 初始化部署
```bash
cd quick-backend
vercel
```

會問你幾個問題：
- Setup and deploy: **Y**
- Which scope: 選擇你的帳號
- Link to existing project: **N** (創建新專案)
- Project name: **omnicanvas-backend** (或你喜歡的名稱)
- Directory: **./** (目前目錄)
- Override settings: **N**

### 3. 設定環境變數

部署後，前往 Vercel Dashboard 設定環境變數：

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)
2. 點擊你的專案 **omnicanvas-backend**
3. 進入 **Settings** → **Environment Variables**
4. 新增以下變數：

```
GEMINI_API_KEY = AIzaSyD5PtkdgdaGcyeh2rNUXrMPbzjifl_C600
ELEVENLABS_API_KEY = sk_430dd34dd2a8d7a514c2e7f61c804ed8f802bc5c6102ec0c
FAL_AI_API_KEY = f4b0a31c-53bb-40ed-825b-5349511672b1:e1c239e17b13ea71b66df81768094c1d
FRONTEND_URL = http://localhost:3005
```

### 4. 重新部署生效
```bash
vercel --prod
```

### 5. 取得你的 API URL

部署完成後會顯示：
```
✅ Production: https://omnicanvas-backend-xxx.vercel.app
```

## 🔄 更新前端設定

在 OmniCanvas 前端的設定面板中：
1. 打開設定 (右上角齒輪圖標)
2. 將 Backend API URL 改為：
   ```
   https://omnicanvas-backend-xxx.vercel.app/api
   ```
3. 點擊 **Test** 測試連接

## 📝 後續部署更新

當你修改後端程式碼後：
```bash
git add .
git commit -m "Update backend"
vercel --prod
```

## 🔧 監控和日誌

前往 Vercel Dashboard 查看：
- **Functions** - API 請求監控
- **Logs** - 即時日誌
- **Analytics** - 使用分析

## ⚠️ 重要提醒

1. **CORS 設定**: 部署前端後，記得更新 `FRONTEND_URL` 環境變數
2. **API 限制**: Vercel 免費方案有以下限制：
   - 100GB 流量/月
   - 10秒 函數執行時間
   - 適合大部分使用場景

## 🎉 完成！

你的後端 API 現在已經部署在 Vercel 上，具有：
- ✅ 自動 HTTPS
- ✅ 全球 CDN
- ✅ 自動擴展
- ✅ 零維護成本

---

## 常見問題

**Q: 部署失敗？**
A: 檢查 `vercel.json` 配置是否正確

**Q: API 無法連接？**
A: 確認環境變數已正確設定並重新部署

**Q: 如何查看錯誤日誌？**
A: 前往 Vercel Dashboard → Functions → Logs