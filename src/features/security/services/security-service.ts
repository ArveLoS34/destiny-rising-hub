/**
 * Security Service
 * Production-ready security implementation
 */

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

class SecurityService {
  // Generate security headers
  getSecurityHeaders(): SecurityHeaders {
    return {
      'Content-Security-Policy': this.getCSP(),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': this.getPermissionsPolicy(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    };
  }

  // Content Security Policy
  private getCSP(): string {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://*.vercel.app",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ];

    return directives.join('; ');
  }

  // Permissions Policy
  private getPermissionsPolicy(): string {
    const features = [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=(self)',
      'usb=()',
    ];

    return features.join(', ');
  }

  // Validate input
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate URL
  validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Rate limiting configuration
  getRateLimitConfig(endpoint: string): RateLimitConfig {
    const configs: Record<string, RateLimitConfig> = {
      default: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        message: 'Too many requests, please try again later.',
      },
      auth: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5,
        message: 'Too many login attempts, please try again later.',
      },
      api: {
        windowMs: 1 * 60 * 1000, // 1 minute
        maxRequests: 60,
        message: 'API rate limit exceeded.',
      },
      search: {
        windowMs: 1 * 60 * 1000,
        maxRequests: 30,
        message: 'Search rate limit exceeded.',
      },
    };

    return configs[endpoint] || configs.default;
  }

  // CSRF token generation
  generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate CSRF token
  validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }

  // Cookie security options
  getSecureCookieOptions(): {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
    path: string;
  } {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    };
  }

  // Password validation
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Check for SQL injection patterns
  detectSQLInjection(input: string): boolean {
    const patterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
      /(['"]\s*(OR|AND)\s+['"])/i,
      /(;\s*(DROP|ALTER|CREATE))/i,
    ];

    return patterns.some((pattern) => pattern.test(input));
  }

  // Check for XSS patterns
  detectXSS(input: string): boolean {
    const patterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b/i,
      /<object\b/i,
      /<embed\b/i,
    ];

    return patterns.some((pattern) => pattern.test(input));
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }
}

export const securityService = new SecurityService();
