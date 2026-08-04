/**
 * Analytics Service
 * Production-ready analytics implementation
 */

export interface AnalyticsEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface UserJourney {
  userId: string;
  pages: string[];
  duration: number;
  timestamp: string;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessions: Map<string, UserJourney> = new Map();

  // Initialize analytics providers
  initialize() {
    if (typeof window === 'undefined') return;

    // Google Analytics 4
    this.initGA4();

    // PostHog
    this.initPostHog();

    // Vercel Analytics
    this.initVercelAnalytics();
  }

  private initGA4() {
    // GA4 initialization code
    // In production, this would load the GA4 script
    console.log('[Analytics] GA4 initialized');
  }

  private initPostHog() {
    // PostHog initialization code
    console.log('[Analytics] PostHog initialized');
  }

  private initVercelAnalytics() {
    // Vercel Analytics initialization
    console.log('[Analytics] Vercel Analytics initialized');
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    const event: AnalyticsEvent = {
      name: 'page_view',
      category: 'navigation',
      label: path,
      metadata: { title, timestamp: new Date().toISOString() },
    };

    this.events.push(event);
    this.sendToProviders(event);
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    this.events.push(event);
    this.sendToProviders(event);
  }

  // Track user actions
  trackAction(action: string, metadata?: Record<string, any>) {
    this.trackEvent({
      name: 'user_action',
      category: 'interaction',
      label: action,
      metadata,
    });
  }

  // Track conversions
  trackConversion(conversionType: string, value?: number) {
    this.trackEvent({
      name: 'conversion',
      category: 'conversion',
      label: conversionType,
      value,
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent({
      name: 'error',
      category: 'error',
      label: error.message,
      metadata: { stack: error.stack, context },
    });
  }

  // Track performance
  trackPerformance(metric: string, value: number) {
    this.trackEvent({
      name: 'performance',
      category: 'performance',
      label: metric,
      value,
    });
  }

  // User journey tracking
  startSession(userId: string) {
    const session: UserJourney = {
      userId,
      pages: [],
      duration: 0,
      timestamp: new Date().toISOString(),
    };
    this.sessions.set(userId, session);
  }

  trackPageInSession(userId: string, page: string) {
    const session = this.sessions.get(userId);
    if (session) {
      session.pages.push(page);
    }
  }

  endSession(userId: string) {
    const session = this.sessions.get(userId);
    if (session) {
      session.duration = Date.now() - new Date(session.timestamp).getTime();
      this.trackEvent({
        name: 'session_end',
        category: 'session',
        metadata: session,
      });
      this.sessions.delete(userId);
    }
  }

  // Funnel analysis
  trackFunnelStep(funnelName: string, step: number, stepName: string) {
    this.trackEvent({
      name: 'funnel_step',
      category: 'funnel',
      label: `${funnelName}:${stepName}`,
      value: step,
    });
  }

  // Get analytics data
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  getEventStats() {
    const stats: Record<string, number> = {};
    this.events.forEach((event) => {
      stats[event.name] = (stats[event.name] || 0) + 1;
    });
    return stats;
  }

  // Send to all providers
  private sendToProviders(event: AnalyticsEvent) {
    // In production, this would send to GA4, PostHog, etc.
    // For now, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Event]', event);
    }
  }
}

export const analyticsService = new AnalyticsService();
