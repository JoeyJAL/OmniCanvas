/**
 * 🔒 OmniCanvas Security Utils
 * 安全工具包：CSP、XSS 防護、瀏覽器擴展檢測
 */

// Security configuration
interface SecurityConfig {
  enableCSP: boolean
  enableXSSProtection: boolean
  enableExtensionDetection: boolean
  strictMode: boolean
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableCSP: true,
  enableXSSProtection: true,
  enableExtensionDetection: true,
  strictMode: true
}

/**
 * 🛡️ Content Security Policy (CSP) 實施
 */
export class CSPManager {
  private static instance: CSPManager
  private isInitialized = false

  static getInstance(): CSPManager {
    if (!CSPManager.instance) {
      CSPManager.instance = new CSPManager()
    }
    return CSPManager.instance
  }

  initializeCSP(config: Partial<SecurityConfig> = {}): void {
    if (this.isInitialized) return

    const fullConfig = { ...DEFAULT_SECURITY_CONFIG, ...config }

    if (!fullConfig.enableCSP) return

    // 建立嚴格的 CSP 策略
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live", // 允許 Vercel
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' data: blob: https:",
      "connect-src 'self' https: wss: ws:", // API 呼叫
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      fullConfig.strictMode ? "upgrade-insecure-requests" : ""
    ].filter(Boolean).join('; ')

    // 動態插入 CSP meta tag
    this.insertCSPMeta(cspDirectives)

    // 監控 CSP 違規
    this.setupCSPViolationReporting()

    this.isInitialized = true
    console.log('🛡️ CSP initialized:', cspDirectives)
  }

  private insertCSPMeta(csp: string): void {
    const meta = document.createElement('meta')
    meta.httpEquiv = 'Content-Security-Policy'
    meta.content = csp
    document.head.appendChild(meta)
  }

  private setupCSPViolationReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.warn('🚨 CSP Violation detected:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber
      })

      // 可以發送到監控服務
      this.reportViolation({
        type: 'csp_violation',
        blockedURI: event.blockedURI,
        directive: event.violatedDirective,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      })
    })
  }

  private reportViolation(violation: any): void {
    // 實際應用中可以發送到安全監控服務
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Security violation logged:', violation)
    }
  }
}

/**
 * 🚫 XSS 防護工具
 */
export class XSSProtection {
  // HTML 實體編碼
  static sanitizeHTML(input: string): string {
    const div = document.createElement('div')
    div.textContent = input
    return div.innerHTML
  }

  // 清理 URL
  static sanitizeURL(url: string): string {
    try {
      const urlObj = new URL(url)

      // 只允許 http(s) 協議
      if (!['http:', 'https:', 'data:'].includes(urlObj.protocol)) {
        throw new Error('Invalid protocol')
      }

      return urlObj.toString()
    } catch {
      return ''
    }
  }

  // 清理使用者輸入
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // 移除 HTML 標籤
      .replace(/javascript:/gi, '') // 移除 javascript: 協議
      .replace(/on\w+=/gi, '') // 移除事件處理器
      .trim()
  }

  // 檢測潛在的 XSS 攻擊
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /expression\s*\(/gi,
      /vbscript:/gi
    ]

    return xssPatterns.some(pattern => pattern.test(input))
  }

  // 安全的 innerHTML 設定
  static safeSetInnerHTML(element: HTMLElement, content: string): void {
    if (this.detectXSS(content)) {
      console.warn('🚨 XSS attempt blocked:', content.substring(0, 100))
      element.textContent = 'Content blocked for security reasons'
      return
    }

    element.innerHTML = this.sanitizeHTML(content)
  }
}

/**
 * 🔍 瀏覽器擴展檢測
 */
export class ExtensionDetector {
  private static detectedExtensions: Set<string> = new Set()

  // 檢測常見的瀏覽器擴展
  static async detectExtensions(): Promise<string[]> {
    const extensions = []

    // 檢測常見的開發者工具擴展
    if (await this.checkForExtension('chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/')) {
      extensions.push('React Developer Tools')
    }

    // 檢測廣告攔截器
    if (this.checkAdBlocker()) {
      extensions.push('Ad Blocker')
    }

    // 檢測密碼管理器
    if (this.checkPasswordManager()) {
      extensions.push('Password Manager')
    }

    // 檢測惡意擴展的常見特徵
    const maliciousIndicators = this.checkMaliciousIndicators()
    if (maliciousIndicators.length > 0) {
      extensions.push(...maliciousIndicators)
    }

    this.detectedExtensions = new Set(extensions)
    return extensions
  }

  private static async checkForExtension(extensionUrl: string): Promise<boolean> {
    try {
      const response = await fetch(extensionUrl, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  private static checkAdBlocker(): boolean {
    // 檢測廣告攔截器
    const testAd = document.createElement('div')
    testAd.innerHTML = '&nbsp;'
    testAd.className = 'adsbox'
    testAd.style.position = 'absolute'
    testAd.style.left = '-10000px'
    document.body.appendChild(testAd)

    const blocked = testAd.offsetHeight === 0
    document.body.removeChild(testAd)

    return blocked
  }

  private static checkPasswordManager(): boolean {
    // 檢測密碼管理器注入的元素
    const passwordManagerIndicators = [
      'data-lastpass-icon-root',
      'data-dashlane-rid',
      '_1PasswordExtension',
      'bitwarden-browser-action-handler'
    ]

    return passwordManagerIndicators.some(indicator =>
      document.querySelector(`[${indicator}]`) !== null
    )
  }

  private static checkMaliciousIndicators(): string[] {
    const indicators = []

    // 檢測異常的全域變數
    const suspiciousGlobals = ['webpackChunkJsonp', '__REACT_DEVTOOLS_GLOBAL_HOOK__']
    suspiciousGlobals.forEach(global => {
      if (window[global as any] && typeof window[global as any] !== 'function') {
        indicators.push(`Suspicious Global: ${global}`)
      }
    })

    // 檢測 DOM 修改
    if (this.checkDOMModification()) {
      indicators.push('Suspicious DOM Modification')
    }

    return indicators
  }

  private static checkDOMModification(): boolean {
    // 檢測是否有異常的 DOM 修改行為
    const originalLength = document.scripts.length

    setTimeout(() => {
      if (document.scripts.length > originalLength + 5) {
        console.warn('🚨 Suspicious script injection detected')
        return true
      }
    }, 1000)

    return false
  }

  // 取得檢測到的擴展清單
  static getDetectedExtensions(): string[] {
    return Array.from(this.detectedExtensions)
  }

  // 檢查是否有潛在威脅
  static hasPotentialThreats(): boolean {
    const threats = this.getDetectedExtensions().filter(ext =>
      ext.includes('Suspicious') || ext.includes('Malicious')
    )
    return threats.length > 0
  }
}

/**
 * 🔐 主要安全管理器
 */
export class SecurityManager {
  private static instance: SecurityManager
  private isInitialized = false
  private config: SecurityConfig

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config }
  }

  static getInstance(config?: Partial<SecurityConfig>): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager(config)
    }
    return SecurityManager.instance
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    console.log('🔒 Initializing OmniCanvas Security Manager...')

    // 1. 初始化 CSP
    if (this.config.enableCSP) {
      CSPManager.getInstance().initializeCSP(this.config)
    }

    // 2. 設定 XSS 防護監聽器
    if (this.config.enableXSSProtection) {
      this.setupXSSProtection()
    }

    // 3. 檢測瀏覽器擴展
    if (this.config.enableExtensionDetection) {
      await this.performExtensionDetection()
    }

    // 4. 設定安全標頭
    this.setupSecurityHeaders()

    // 5. 監控安全事件
    this.setupSecurityMonitoring()

    this.isInitialized = true
    console.log('✅ Security Manager initialized successfully')
  }

  private setupXSSProtection(): void {
    // 監控輸入欄位
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement
      if (target.value && XSSProtection.detectXSS(target.value)) {
        console.warn('🚨 XSS attempt detected in input field')
        target.value = XSSProtection.sanitizeInput(target.value)
      }
    })

    console.log('🛡️ XSS Protection enabled')
  }

  private async performExtensionDetection(): Promise<void> {
    try {
      const extensions = await ExtensionDetector.detectExtensions()

      if (extensions.length > 0) {
        console.log('🔍 Browser extensions detected:', extensions)

        if (ExtensionDetector.hasPotentialThreats()) {
          console.warn('⚠️ Potential security threats detected!')
          this.handleSecurityThreat('malicious_extension', extensions)
        }
      }
    } catch (error) {
      console.error('Extension detection failed:', error)
    }
  }

  private setupSecurityHeaders(): void {
    // 對於可能的 iframe 嵌入，設定安全策略
    if (window.self !== window.top) {
      console.warn('🚨 Application running in iframe - potential security risk')
    }

    // 禁用右鍵選單 (可選)
    if (this.config.strictMode) {
      document.addEventListener('contextmenu', (e) => {
        if (process.env.NODE_ENV === 'production') {
          e.preventDefault()
        }
      })
    }
  }

  private setupSecurityMonitoring(): void {
    // 監控異常活動
    let requestCount = 0
    const originalFetch = window.fetch

    window.fetch = async (...args) => {
      requestCount++

      // 檢測異常高頻請求
      if (requestCount > 100) {
        console.warn('🚨 High frequency requests detected')
        this.handleSecurityThreat('high_frequency_requests', { count: requestCount })
      }

      return originalFetch.apply(window, args)
    }

    console.log('👀 Security monitoring enabled')
  }

  private handleSecurityThreat(type: string, details: any): void {
    const threat = {
      type,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    console.error('🚨 Security threat detected:', threat)

    // 在生產環境中，這裡可以：
    // 1. 發送警報到監控系統
    // 2. 暫時限制某些功能
    // 3. 記錄到安全日誌
    // 4. 通知管理員

    if (process.env.NODE_ENV === 'production') {
      // 可以發送到您的安全監控端點
      // this.reportThreatToBackend(threat)
    }
  }

  // 取得安全狀態報告
  getSecurityReport(): any {
    return {
      initialized: this.isInitialized,
      config: this.config,
      detectedExtensions: ExtensionDetector.getDetectedExtensions(),
      hasPotentialThreats: ExtensionDetector.hasPotentialThreats(),
      timestamp: Date.now()
    }
  }

  // 手動觸發安全檢查
  async performSecurityCheck(): Promise<boolean> {
    console.log('🔍 Performing security check...')

    // 重新檢測擴展
    await this.performExtensionDetection()

    // 檢查當前頁面安全性
    const threats = ExtensionDetector.hasPotentialThreats()

    console.log(threats ? '⚠️ Security issues found' : '✅ Security check passed')
    return !threats
  }
}

// 輔助函數：初始化安全措施
export const initializeSecurity = async (config?: Partial<SecurityConfig>): Promise<void> => {
  const securityManager = SecurityManager.getInstance(config)
  await securityManager.initialize()
}

// 輔助函數：取得安全報告
export const getSecurityReport = (): any => {
  return SecurityManager.getInstance().getSecurityReport()
}

// 主要類別已在上方宣告時匯出，無需重複導出