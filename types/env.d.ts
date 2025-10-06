/**
 * Type definitions for environment variables
 * This provides TypeScript autocomplete and type checking for process.env
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Node environment
    NODE_ENV: 'development' | 'production' | 'test';

    // Redis (Upstash)
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;

    // Email (SendGrid)
    SENDGRID_API_KEY?: string;
    SENDGRID_FROM_EMAIL?: string;
    SENDGRID_FROM_NAME?: string;

    // Payment (Stripe)
    STRIPE_SECRET_KEY?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;

    // Google AdSense
    NEXT_PUBLIC_ADSENSE_CLIENT_ID?: string;

    // App Configuration
    NEXT_PUBLIC_APP_URL?: string;
    LINK_EXPIRATION_SECONDS?: string;
    MAX_TIME_SLOTS_PER_LINK?: string;
    RATE_LIMIT_MAX_LINKS_PER_HOUR?: string;
  }
}
