// Analytics Configuration
// Safe deployment with feature flags and environment-based activation

export interface AnalyticsConfig {
  enabled: boolean
  googleAnalyticsId?: string
  environment: 'development' | 'staging' | 'production'
  features: {
    pageTracking: boolean
    eventTracking: boolean
    errorTracking: boolean
    performanceTracking: boolean
  }
  privacy: {
    anonymizeIP: boolean
    respectDoNotTrack: boolean
    cookieConsent: boolean
  }
}

// Environment-based configuration
export const getAnalyticsConfig = (): AnalyticsConfig => {
  const isDevelopment = import.meta.env.MODE === 'development'
  const isProduction = import.meta.env.MODE === 'production'

  // Safe defaults - only enable in production with explicit configuration
  const config: AnalyticsConfig = {
    enabled: false, // 預設關閉，等您設定好後再啟用
    environment: import.meta.env.MODE as any,

    // Google Analytics ID from environment variables
    googleAnalyticsId: import.meta.env.VITE_GA_TRACKING_ID,

    features: {
      pageTracking: true,
      eventTracking: true,
      errorTracking: true,
      performanceTracking: !isDevelopment // 開發環境關閉性能追蹤
    },

    privacy: {
      anonymizeIP: true, // 保護用戶隱私
      respectDoNotTrack: true, // 尊重用戶 DNT 設定
      cookieConsent: isProduction // 生產環境需要 cookie 同意
    }
  }

  // 只有在生產環境且有 GA ID 時才啟用
  if (isProduction && config.googleAnalyticsId) {
    config.enabled = true
  }

  // 開發環境的安全測試模式
  if (isDevelopment && import.meta.env.VITE_ENABLE_ANALYTICS_DEV === 'true') {
    config.enabled = true
    console.log('🔧 Analytics enabled in development mode for testing')
  }

  return config
}

// Feature flag checker
export const isAnalyticsFeatureEnabled = (feature: keyof AnalyticsConfig['features']): boolean => {
  const config = getAnalyticsConfig()
  return config.enabled && config.features[feature]
}

// Privacy compliance checker
export const shouldRespectPrivacy = (): boolean => {
  const config = getAnalyticsConfig()

  // Check Do Not Track header
  if (config.privacy.respectDoNotTrack && navigator.doNotTrack === '1') {
    return true
  }

  // Add more privacy checks here
  return false
}

// Safe initialization checker
export const canInitializeAnalytics = (): boolean => {
  const config = getAnalyticsConfig()

  // Don't initialize if privacy should be respected
  if (shouldRespectPrivacy()) {
    console.log('🔒 Analytics disabled due to privacy settings')
    return false
  }

  // Don't initialize if not properly configured
  if (!config.enabled || !config.googleAnalyticsId) {
    console.log('📊 Analytics not initialized - missing configuration')
    return false
  }

  return true
}