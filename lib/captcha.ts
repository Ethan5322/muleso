/**
 * Google reCAPTCHA v3 integration
 * Invisible bot protection
 */

/**
 * Get reCAPTCHA token from Google
 */
export async function getRecaptchaToken(action: string = 'login'): Promise<string> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (typeof window === 'undefined' || !window.grecaptcha) {
      reject(new Error('reCAPTCHA not loaded'));
      return;
    }

    // Hard timeout: if grecaptcha.ready/execute never settles (invalid site
    // key, unregistered domain, blocked script), we must NOT hang the caller.
    let settled = false;
    const finish = (fn: (v: any) => void, value: any) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };
    const timer = setTimeout(() => finish(reject, new Error('reCAPTCHA timed out')), 4000);

    try {
      // @ts-ignore
      window.grecaptcha.ready(() => {
        // @ts-ignore
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
          .then((token: string) => finish(resolve, token))
          .catch((error: any) => finish(reject, error));
      });
    } catch (error) {
      finish(reject, error);
    }
  });
}

/**
 * Verify reCAPTCHA token on backend
 */
export async function verifyRecaptchaToken(
  token: string
): Promise<{ success: boolean; score: number; action: string; error?: string }> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        score: 0,
        action: '',
        error: 'reCAPTCHA verification failed',
      };
    }

    // Score ranges from 0.0 to 1.0
    // 1.0 is very likely a legitimate interaction
    // 0.0 is very likely a bot
    const score = data.score || 0;

    // Block if score is too low (likely bot)
    if (score < 0.5) {
      return {
        success: false,
        score,
        action: data.action || '',
        error: 'Potential bot activity detected',
      };
    }

    return {
      success: true,
      score,
      action: data.action || '',
    };
  } catch (error: any) {
    console.error('Error verifying reCAPTCHA:', error);
    return {
      success: false,
      score: 0,
      action: '',
      error: error.message,
    };
  }
}

/**
 * Initialize reCAPTCHA script in document
 */
export function initializeRecaptcha(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Check if already loaded
  // @ts-ignore
  if (window.grecaptcha) {
    return;
  }

  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}
