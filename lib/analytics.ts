/**
 * Google Analytics 4 Event Tracking
 * Track key user actions and conversions
 */

export const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// Predefined conversion events
export const analytics = {
  // Contact form events
  contactFormView: () => trackEvent('contact_form_view'),
  contactFormSubmit: (service?: string) =>
    trackEvent('contact_form_submit', { service: service || 'general' }),
  contactFormError: (error?: string) =>
    trackEvent('contact_form_error', { error_type: error || 'unknown' }),

  // CTA button clicks
  ctaClick: (buttonText: string, location: string) =>
    trackEvent('cta_click', { button: buttonText, location }),

  // Service page views
  serviceView: (serviceName: string) =>
    trackEvent('service_view', { service: serviceName }),

  // Portfolio/project views
  portfolioView: (projectName: string) =>
    trackEvent('portfolio_view', { project: projectName }),

  // Store/product events
  productView: (productName: string, price: number) =>
    trackEvent('product_view', { product: productName, value: price }),

  productClick: (productName: string) =>
    trackEvent('product_click', { product: productName }),

  checkoutStart: (value: number) =>
    trackEvent('begin_checkout', { value, currency: 'ZAR' }),

  purchaseComplete: (transactionId: string, value: number) =>
    trackEvent('purchase', {
      transaction_id: transactionId,
      value,
      currency: 'ZAR'
    }),

  // Engagement events
  testimonialView: () => trackEvent('testimonial_engagement'),
  portfolioFilterApply: (filter: string) =>
    trackEvent('portfolio_filter', { filter_type: filter }),

  chatbotOpen: () => trackEvent('chatbot_open'),
  chatbotMessage: (messageType: string) =>
    trackEvent('chatbot_message', { type: messageType }),

  // Scroll depth tracking (optional)
  scrollDepth: (depth: number) =>
    trackEvent('scroll_depth', { scroll_percent: depth }),

  // Error tracking
  errorOccurred: (errorType: string, details?: string) =>
    trackEvent('error_occurred', { error_type: errorType, details }),

  // Lead source tracking
  leadSource: (source: string, medium: string) =>
    trackEvent('lead_source', { source, medium }),
};
