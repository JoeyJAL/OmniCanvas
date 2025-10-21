// Analytics Service for OmniCanvas
// Supports Google Analytics 4 and custom event tracking
// Safe deployment with feature flags and graceful fallbacks

import { getAnalyticsConfig, canInitializeAnalytics, isAnalyticsFeatureEnabled } from '@config/analytics'

export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

export interface UserSession {
  session_id: string
  user_id?: string
  start_time: number
  page_views: number
  events: AnalyticsEvent[]
}

class AnalyticsService {
  private isEnabled: boolean = false
  private gaTrackingId: string | null = null
  private currentSession: UserSession | null = null

  constructor() {
    this.initializeSession()
    this.safeInitialize()
  }

  // Safe initialization with feature flags
  private safeInitialize() {
    try {
      const config = getAnalyticsConfig()

      if (!canInitializeAnalytics()) {
        console.log('📊 Analytics initialization skipped')
        return
      }

      if (config.googleAnalyticsId) {
        this.init(config.googleAnalyticsId)
      }
    } catch (error) {
      console.warn('📊 Analytics initialization failed safely:', error)
      this.isEnabled = false
    }
  }

  // Initialize Google Analytics 4
  init(trackingId: string) {
    this.gaTrackingId = trackingId
    this.isEnabled = true

    // Load Google Analytics script
    this.loadGoogleAnalytics(trackingId)

    // Track initial page view
    if (isAnalyticsFeatureEnabled('pageTracking')) {
      this.trackPageView(window.location.pathname)
    }

    console.log('📊 Analytics initialized with tracking ID:', trackingId)
  }

  private loadGoogleAnalytics(trackingId: string) {
    // Add Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
    document.head.appendChild(script1)

    // Add gtag configuration
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: 'OmniCanvas - AI Creative Canvas',
        custom_map: {'custom_parameter_1': 'ai_feature'}
      });
    `
    document.head.appendChild(script2)

    // Make gtag globally available
    ;(window as any).gtag = (...args: any[]) => {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push(arguments)
    }
  }

  private initializeSession() {
    this.currentSession = {
      session_id: this.generateSessionId(),
      start_time: Date.now(),
      page_views: 0,
      events: []
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Track page views
  trackPageView(path: string) {
    if (!this.isEnabled || !isAnalyticsFeatureEnabled('pageTracking')) return

    try {
      if (this.currentSession) {
        this.currentSession.page_views++
      }

      // Google Analytics page view
      if ((window as any).gtag) {
        ;(window as any).gtag('config', this.gaTrackingId, {
          page_path: path,
          page_title: `OmniCanvas - ${path}`
        })
      }

      console.log('📄 Page view tracked:', path)
    } catch (error) {
      console.warn('📄 Page view tracking failed safely:', error)
    }
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled || !isAnalyticsFeatureEnabled('eventTracking')) return

    try {
      // Add to session
      if (this.currentSession) {
        this.currentSession.events.push({
          ...event,
          custom_parameters: {
            ...event.custom_parameters,
            timestamp: Date.now(),
            session_id: this.currentSession.session_id
          }
        })
      }

      // Send to Google Analytics
      if ((window as any).gtag) {
        ;(window as any).gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_parameter_1: event.custom_parameters?.ai_feature,
          ...event.custom_parameters
        })
      }

      console.log('📊 Event tracked:', event)
    } catch (error) {
      console.warn('📊 Event tracking failed safely:', error)
    }
  }

  // AI-specific tracking methods
  trackAIGeneration(params: {
    type: 'text-to-image' | 'image-to-image' | 'enhancement'
    template?: string
    hasSelection: boolean
    promptLength: number
    processingTime?: number
  }) {
    this.trackEvent({
      action: 'ai_generation',
      category: 'AI Features',
      label: params.type,
      value: params.processingTime,
      custom_parameters: {
        ai_feature: params.type,
        template_used: params.template,
        has_image_selection: params.hasSelection,
        prompt_length: params.promptLength,
        generation_mode: params.hasSelection ? 'image-to-image' : 'text-to-image'
      }
    })
  }

  trackTemplateUsage(templateId: string, category: string) {
    this.trackEvent({
      action: 'template_selected',
      category: 'Templates',
      label: templateId,
      custom_parameters: {
        template_id: templateId,
        template_category: category,
        ai_feature: 'template_usage'
      }
    })
  }

  trackFeatureUsage(feature: string, details?: Record<string, any>) {
    this.trackEvent({
      action: 'feature_used',
      category: 'User Interaction',
      label: feature,
      custom_parameters: {
        feature_name: feature,
        ...details,
        ai_feature: 'general_usage'
      }
    })
  }

  trackError(error: string, context?: string) {
    this.trackEvent({
      action: 'error_occurred',
      category: 'Errors',
      label: error,
      custom_parameters: {
        error_message: error,
        error_context: context,
        ai_feature: 'error_tracking'
      }
    })
  }

  // Get session statistics
  getSessionStats() {
    return this.currentSession
  }

  // User behavior insights
  trackUserEngagement() {
    if (!this.currentSession) return

    const sessionDuration = Date.now() - this.currentSession.start_time
    const eventCount = this.currentSession.events.length

    this.trackEvent({
      action: 'session_engagement',
      category: 'User Behavior',
      label: 'session_summary',
      value: Math.round(sessionDuration / 1000), // Duration in seconds
      custom_parameters: {
        session_duration_ms: sessionDuration,
        total_events: eventCount,
        page_views: this.currentSession.page_views,
        events_per_minute: eventCount / (sessionDuration / 60000),
        ai_feature: 'engagement_metrics'
      }
    })
  }

  // Disable analytics (for privacy)
  disable() {
    this.isEnabled = false
    console.log('📊 Analytics disabled')
  }

  // Enable analytics
  enable() {
    this.isEnabled = true
    console.log('📊 Analytics enabled')
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService()

// Export types
export type { AnalyticsEvent, UserSession }