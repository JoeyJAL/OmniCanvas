# OmniCanvas Security Documentation

## 概述
OmniCanvas 實施了多層次的安全措施來保護用戶的 API 金鑰和數據隱私。

## 🔐 API 金鑰安全

### 1. 本地儲存加密
- **XOR 加密**：使用網站 origin 作為金鑰進行 XOR 加密
- **Base64 編碼**：額外的編碼層提供基本混淆
- **版本控制**：儲存版本資訊以便未來升級
- **時間戳**：記錄儲存時間用於審計

### 2. 輸入驗證
```typescript
// API 金鑰格式驗證
OpenAI: /^sk-[a-zA-Z0-9]{48,}$/
Anthropic: /^sk-ant-api[0-9]{2}-[a-zA-Z0-9\-]{32,}$/
Fal.ai: 32-128 字符長度
Replicate: /^r8_[a-zA-Z0-9]{39}$/ 或 40+ 字符
Stability AI: /^sk-[a-zA-Z0-9]{48,}$/
```

### 3. 輸入清理
- 移除控制字符和空白字符
- 檢查惡意字符注入
- 限制金鑰長度防止 DoS 攻擊

## 🛡️ 請求安全

### 1. 速率限制
- **時間窗口**：60 秒
- **最大請求數**：每個服務 10 次/分鐘
- **自動重置**：時間窗口過期後自動重置計數器

### 2. 輸入消毒
```typescript
// 清理用戶輸入的提示詞
- 移除 <script> 標籤
- 移除 javascript: 協議
- 移除事件處理器 (onclick, onload 等)
- 限制長度到 2000 字符
```

### 3. URL 驗證
- 僅允許 http://, https://, data: 協議
- 驗證 data: URL 格式為圖片類型
- 防止 XSS 和 SSRF 攻擊

## 🚫 威脅防護

### 1. XSS 防護
- 清理所有用戶輸入
- 移除潛在的腳本標籤
- 驗證 URL 協議

### 2. 注入攻擊防護
- API 金鑰格式嚴格驗證
- 輸入長度限制
- 特殊字符過濾

### 3. DoS 防護
- 客戶端速率限制
- 輸入長度限制
- 錯誤處理和重試機制

## 🔒 數據隱私

### 1. 本地優先
- 所有 API 金鑰儲存在用戶瀏覽器本地
- 不會傳送到 OmniCanvas 伺服器
- 用戶完全控制自己的金鑰

### 2. 加密儲存
- XOR 加密 + Base64 編碼
- origin 特定的加密金鑰
- 瀏覽器清除數據時自動刪除

### 3. 安全清除
```typescript
// 提供安全清除功能
clearAllKeys() {
  // 清除 store 狀態
  set({ apiKeys: {}, isConfigured: false })
  // 清除 localStorage
  localStorage.removeItem('api-keys-storage')
}
```

## ⚡ 安全最佳實踐

### 1. 使用者教育
- 明確說明 API 金鑰不會離開瀏覽器
- 提供金鑰獲取指南
- 強調定期輪換金鑰的重要性

### 2. 錯誤處理
- 不在錯誤訊息中洩露敏感資訊
- 記錄安全事件到 console
- 提供用戶友好的錯誤訊息

### 3. 金鑰管理
- 金鑰混淆顯示 (sk-1234••••5678)
- 提供刪除個別金鑰功能
- 支援批量清除所有金鑰

## 🔧 實施細節

### 1. 加密演算法
```typescript
// XOR 加密實施
const key = window.location.origin.repeat(...)
const encrypted = data.map((byte, i) => 
  byte ^ key.charCodeAt(i % key.length)
)
```

### 2. 速率限制實施
```typescript
interface RateLimitInfo {
  count: number
  resetTime: number
}

checkRateLimit(service: string): boolean {
  // 檢查是否超過限制
  // 自動重置過期的計數器
  // 更新請求計數
}
```

### 3. 輸入驗證實施
```typescript
isValidKeyFormat(service, key): boolean {
  // 檢查惡意字符
  if (!/^[a-zA-Z0-9\-_]+$/.test(key)) return false
  
  // 服務特定格式驗證
  switch (service) {
    case 'openai': return /^sk-[a-zA-Z0-9]{48,}$/.test(key)
    // ...
  }
}
```

## ⚠️ 已知限制

### 1. 瀏覽器安全性
- 依賴瀏覽器的 localStorage 安全性
- XOR 加密不是軍用級加密
- 有經驗的攻擊者可能解密本地儲存

### 2. 網路安全
- HTTPS 傳輸依賴 SSL/TLS
- 中間人攻擊的潛在風險
- DNS 劫持風險

### 3. 客戶端限制
- 無法防止瀏覽器擴展程式訪問
- 開發者工具可查看加密數據
- 惡意軟體可能訪問瀏覽器數據

## 🎯 安全建議

### 對用戶
1. **使用 HTTPS 連線**訪問應用程式
2. **定期輪換 API 金鑰**
3. **不要在公共電腦**上儲存金鑰
4. **使用專用的 API 金鑰**，避免使用主帳戶金鑰
5. **監控 API 使用量**，檢查異常活動

### 對開發者
1. **定期安全審計**
2. **更新依賴套件**
3. **監控安全漏洞**
4. **實施 CSP 標頭**
5. **考慮升級加密方法**

## 📞 安全問題回報

如果發現安全漏洞，請通過以下方式聯繫：
- GitHub Issues（非敏感問題）
- 電子郵件：security@omnicanvas.app（敏感問題）

請提供：
1. 漏洞詳細描述
2. 重現步驟
3. 潛在影響評估
4. 建議修復方案（如有）

## 🔄 更新記錄

### v1.0 (2024-09-28)
- 初始安全實施
- XOR 加密 + Base64 編碼
- 速率限制實施
- 輸入驗證和清理
- 安全文檔建立

---

**免責聲明**：本應用程式提供的安全措施是為了保護用戶數據，但無法保證 100% 的安全性。用戶應該了解並接受使用任何網路應用程式的固有風險。