type EventType = "page_view" | "click" | "scroll" | "error" | "custom";

interface AnalyticsEvent {
  type: EventType;
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

interface Window {
  gtag: (command: string, event: string, params: Record<string, unknown>) => void;
}

class Analytics {
  private static instance: Analytics;
  private initialized = false;
  private queue: AnalyticsEvent[] = [];

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  initialize() {
    if (this.initialized) return;

    // Process any queued events
    this.processQueue();
    this.initialized = true;

    // Set up page view tracking
    if (typeof window !== "undefined") {
      this.trackPageView();
      window.addEventListener("popstate", () => this.trackPageView());
    }
  }

  private async processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) {
        await this.sendToAnalytics(event);
      }
    }
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // Send to Google Analytics if available
      if (typeof window !== "undefined" && "gtag" in window) {
        const gtag = (window as unknown as Window).gtag;
        gtag("event", event.name, {
          event_category: event.type,
          ...event.properties,
        });
      }

      // You can add more analytics providers here
      // Example: Mixpanel, Amplitude, etc.
    } catch (error) {
      console.error("[Analytics] Failed to send event:", error);
    }
  }

  trackEvent(event: Omit<AnalyticsEvent, "timestamp">) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };

    if (!this.initialized) {
      this.queue.push(fullEvent);
      return;
    }

    this.sendToAnalytics(fullEvent);
  }

  private trackPageView() {
    this.trackEvent({
      type: "page_view",
      name: "page_view",
      properties: {
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
      },
    });
  }

  trackError(error: Error) {
    this.trackEvent({
      type: "error",
      name: "error",
      properties: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
    });
  }

  trackClick(element: string, properties?: Record<string, unknown>) {
    this.trackEvent({
      type: "click",
      name: "click",
      properties: {
        element,
        ...properties,
      },
    });
  }
}

export const analytics = Analytics.getInstance();
