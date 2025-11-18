import { useEffect } from 'react';
import { analyticsService } from '../services/analytics';

// Hook để track page views tự động
export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    if (pageName) {
      analyticsService.trackPageView(pageName);
    }
  }, [pageName]);
};

// Hook để track events
export const useEventTracking = () => {
  const trackEvent = (eventName: string, data?: any) => {
    try {
      // Log to Firebase Analytics if available
      console.log('Event tracked:', eventName, data);
      
      // You can extend this to send to Firebase Analytics
      // logEvent(analytics, eventName, data);
    } catch (error) {
      console.warn('Event tracking failed:', error);
    }
  };

  return { trackEvent };
};

// Hook để lấy analytics data real-time
export const useAnalyticsData = () => {
  return analyticsService.getAnalyticsData();
};