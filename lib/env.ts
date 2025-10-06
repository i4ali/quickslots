/**
 * Environment Configuration & Validation
 *
 * This file validates that all required environment variables are present
 * and provides typed access to them throughout the application.
 */

// =============================================================================
// Type Definitions
// =============================================================================

export interface EnvConfig {
  // Redis (Upstash)
  redis: {
    url: string;
    token: string;
  };

  // Email (SendGrid)
  email: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };

  // Payment (Stripe)
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };

  // Google AdSense
  adsense: {
    clientId: string;
  };

  // App Configuration
  app: {
    url: string;
    linkExpirationSeconds: number;
    maxTimeSlotsPerLink: number;
    rateLimitMaxLinksPerHour: number;
  };
}

// =============================================================================
// Validation Helpers
// =============================================================================

/**
 * Gets an environment variable and throws if it's missing
 */
function getEnvVar(key: string, required: boolean = true): string {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please check your .env.local file and ensure ${key} is set.\n` +
      `See .env.example for reference.`
    );
  }

  return value || '';
}

/**
 * Gets an environment variable as a number
 */
function getEnvVarAsNumber(key: string, defaultValue: number): number {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);

  if (isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} must be a number, got: ${value}`
    );
  }

  return parsed;
}

/**
 * Validates email format
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates URL format
 */
function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// =============================================================================
// Configuration Loading & Validation
// =============================================================================

/**
 * Loads and validates all environment variables
 * Call this at application startup to fail fast if config is invalid
 */
export function loadAndValidateEnv(): EnvConfig {
  // Redis
  const redisUrl = getEnvVar('UPSTASH_REDIS_REST_URL', false);
  const redisToken = getEnvVar('UPSTASH_REDIS_REST_TOKEN', false);

  if (redisUrl && !validateUrl(redisUrl)) {
    throw new Error('UPSTASH_REDIS_REST_URL must be a valid URL');
  }

  // Email
  const fromEmail = getEnvVar('SENDGRID_FROM_EMAIL', false);

  if (fromEmail && !validateEmail(fromEmail)) {
    throw new Error('SENDGRID_FROM_EMAIL must be a valid email address');
  }

  // App URL
  const appUrl = getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000';

  if (!validateUrl(appUrl)) {
    throw new Error('NEXT_PUBLIC_APP_URL must be a valid URL');
  }

  // Build config object
  const config: EnvConfig = {
    redis: {
      url: redisUrl,
      token: redisToken,
    },
    email: {
      apiKey: getEnvVar('SENDGRID_API_KEY', false),
      fromEmail: fromEmail,
      fromName: getEnvVar('SENDGRID_FROM_NAME', false) || 'QuickSlots',
    },
    stripe: {
      secretKey: getEnvVar('STRIPE_SECRET_KEY', false),
      publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY', false),
      webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', false),
    },
    adsense: {
      clientId: getEnvVar('NEXT_PUBLIC_ADSENSE_CLIENT_ID', false),
    },
    app: {
      url: appUrl,
      linkExpirationSeconds: getEnvVarAsNumber('LINK_EXPIRATION_SECONDS', 86400),
      maxTimeSlotsPerLink: getEnvVarAsNumber('MAX_TIME_SLOTS_PER_LINK', 5),
      rateLimitMaxLinksPerHour: getEnvVarAsNumber('RATE_LIMIT_MAX_LINKS_PER_HOUR', 10),
    },
  };

  return config;
}

/**
 * Get a specific required environment variable
 * Use this for server-side code that needs specific env vars
 */
export function requireEnvVar(key: string): string {
  return getEnvVar(key, true);
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if a service is configured (optional services)
 */
export function isServiceConfigured(service: 'redis' | 'email' | 'stripe' | 'adsense'): boolean {
  try {
    const config = loadAndValidateEnv();

    switch (service) {
      case 'redis':
        return !!config.redis.url && !!config.redis.token;
      case 'email':
        return !!config.email.apiKey;
      case 'stripe':
        return !!config.stripe.secretKey && !!config.stripe.publishableKey;
      case 'adsense':
        return !!config.adsense.clientId;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

// =============================================================================
// Export singleton config instance
// =============================================================================

let cachedConfig: EnvConfig | null = null;

/**
 * Get the validated environment configuration
 * Config is loaded once and cached for performance
 */
export function getEnvConfig(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = loadAndValidateEnv();
  }
  return cachedConfig;
}
