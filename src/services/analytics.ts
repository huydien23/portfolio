import { database, analytics } from '../config/firebase';
import { ref, set, get, update, onValue, off, push, serverTimestamp } from 'firebase/database';
import { logEvent } from 'firebase/analytics';

// Types for Analytics
export interface VisitorData {
  sessionId: string;
  timestamp: number;
  userAgent: string;
  referrer: string;
  pages: string[];
  isUnique: boolean;
}

export interface PageView {
  page: string;
  timestamp: number;
  sessionId: string;
  timeSpent?: number;
}

export interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  dailyStats: Record<string, number>;
  monthlyStats: Record<string, number>;
  pageStats: Record<string, number>;
  realTimeVisitors: number;
}

// Analytics Service Class
export class AnalyticsService {
  private sessionId: string;
  private startTime: number;
  private currentPage: string = '';

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeSession();
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize visitor session
  private async initializeSession(): Promise<void> {
    try {
      const visitorData: VisitorData = {
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        pages: [],
        isUnique: await this.isUniqueVisitor()
      };

      // Store session data
      await set(ref(database, `analytics/sessions/${this.sessionId}`), visitorData);
      
      // Update counters
      await this.updateVisitorCounters(visitorData.isUnique);
      
      // Log to Firebase Analytics
      logEvent(analytics, 'session_start', {
        session_id: this.sessionId,
        is_unique: visitorData.isUnique
      });

    } catch (error) {
      console.warn('Analytics initialization failed:', error);
      // Fallback to localStorage
      this.fallbackToLocalStorage();
    }
  }

  // Check if visitor is unique (not visited in last 24 hours)
  private async isUniqueVisitor(): Promise<boolean> {
    try {
      const lastVisit = localStorage.getItem('lastVisit');
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;

      if (!lastVisit || (now - parseInt(lastVisit)) > dayInMs) {
        localStorage.setItem('lastVisit', now.toString());
        return true;
      }
      return false;
    } catch {
      return true; // Default to unique if can't determine
    }
  }

  // Update visitor counters
  private async updateVisitorCounters(isUnique: boolean): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const month = today.substring(0, 7);

    const updates: Record<string, any> = {};

    if (isUnique) {
      // Update total unique visitors
      const totalRef = ref(database, 'analytics/totalVisitors');
      const totalSnapshot = await get(totalRef);
      const currentTotal = totalSnapshot.val() || 0;
      updates['analytics/totalVisitors'] = currentTotal + 1;

      // Update daily stats
      const dailyRef = ref(database, `analytics/dailyStats/${today}`);
      const dailySnapshot = await get(dailyRef);
      const dailyCount = dailySnapshot.val() || 0;
      updates[`analytics/dailyStats/${today}`] = dailyCount + 1;

      // Update monthly stats
      const monthlyRef = ref(database, `analytics/monthlyStats/${month}`);
      const monthlySnapshot = await get(monthlyRef);
      const monthlyCount = monthlySnapshot.val() || 0;
      updates[`analytics/monthlyStats/${month}`] = monthlyCount + 1;
    }

    // Update real-time visitors counter
    updates[`analytics/realTimeVisitors/${this.sessionId}`] = {
      timestamp: serverTimestamp(),
      active: true
    };

    await update(ref(database), updates);
  }

  // Track page view
  public async trackPageView(page: string): Promise<void> {
    try {
      // End previous page tracking
      if (this.currentPage) {
        await this.endPageView(this.currentPage);
      }

      this.currentPage = page;
      this.startTime = Date.now();

      const pageView: PageView = {
        page,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };

      // Store page view
      await push(ref(database, 'analytics/pageViews'), pageView);

      // Update page stats
      const pageStatsRef = ref(database, `analytics/pageStats/${page}`);
      const pageSnapshot = await get(pageStatsRef);
      const pageCount = pageSnapshot.val() || 0;
      await set(pageStatsRef, pageCount + 1);

      // Update total page views
      const totalPageViewsRef = ref(database, 'analytics/totalPageViews');
      const totalSnapshot = await get(totalPageViewsRef);
      const totalViews = totalSnapshot.val() || 0;
      await set(totalPageViewsRef, totalViews + 1);

      // Update session pages
      await update(ref(database, `analytics/sessions/${this.sessionId}`), {
        [`pages/${Date.now()}`]: page,
        lastPage: page,
        lastActivity: serverTimestamp()
      });

      // Log to Firebase Analytics
      logEvent(analytics, 'page_view', {
        page_title: page,
        session_id: this.sessionId
      });

    } catch (error) {
      console.warn('Page tracking failed:', error);
    }
  }

  // End page view tracking
  private async endPageView(page: string): Promise<void> {
    const timeSpent = Date.now() - this.startTime;
    
    try {
      // You could store time spent data here if needed
      logEvent(analytics, 'page_time', {
        page_title: page,
        time_spent: timeSpent,
        session_id: this.sessionId
      });
    } catch (error) {
      console.warn('End page view tracking failed:', error);
    }
  }

  // Get analytics data
  public async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const snapshot = await get(ref(database, 'analytics'));
      const data = snapshot.val() || {};

      // Count real-time visitors (active in last 5 minutes)
      const realTimeData = data.realTimeVisitors || {};
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      const realTimeCount = Object.values(realTimeData).filter(
        (visitor: any) => visitor && visitor.timestamp > fiveMinutesAgo && visitor.active
      ).length;

      return {
        totalVisitors: data.totalVisitors || 0,
        totalPageViews: data.totalPageViews || 0,
        dailyStats: data.dailyStats || {},
        monthlyStats: data.monthlyStats || {},
        pageStats: data.pageStats || {
          'home': 0,
          'about': 0,
          'projects': 0,
          'contact': 0
        },
        realTimeVisitors: realTimeCount
      };
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      // Return mock data when Firebase fails
      return {
        totalVisitors: 0,
        totalPageViews: 0,
        dailyStats: {},
        monthlyStats: {},
        pageStats: {
          'home': 0,
          'about': 0,
          'projects': 0,
          'contact': 0
        },
        realTimeVisitors: 0
      };
    }
  }

  // Listen to real-time analytics updates
  public subscribeToAnalytics(callback: (data: AnalyticsData) => void): () => void {
    const analyticsRef = ref(database, 'analytics');
    
    const unsubscribe = onValue(analyticsRef, async (snapshot) => {
      const data = await this.getAnalyticsData();
      callback(data);
    });

    return () => off(analyticsRef, 'value', unsubscribe);
  }

  // Cleanup session when user leaves
  public async cleanup(): Promise<void> {
    try {
      if (this.currentPage) {
        await this.endPageView(this.currentPage);
      }

      // Mark session as inactive
      await update(ref(database, `analytics/realTimeVisitors/${this.sessionId}`), {
        active: false,
        endTime: serverTimestamp()
      });

      // Log session end
      logEvent(analytics, 'session_end', {
        session_id: this.sessionId,
        duration: Date.now() - this.startTime
      });

    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }

  // Fallback to localStorage if Firebase fails
  private fallbackToLocalStorage(): void {
    const localData = localStorage.getItem('analytics') || '{}';
    const analytics = JSON.parse(localData);
    
    analytics.sessions = analytics.sessions || [];
    analytics.sessions.push({
      sessionId: this.sessionId,
      timestamp: Date.now(),
      pages: []
    });

    localStorage.setItem('analytics', JSON.stringify(analytics));
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  analyticsService.cleanup();
});