import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from './errors';

/**
 * API Validation
 * Input/Output validation using Zod schemas
 */

/**
 * Common validation schemas
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const sortSchema = z.object({
  sortBy: z.string().default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * Validate request body against schema
 */
export function validateBody<T>(
  body: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(body);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

/**
 * Validate request query parameters
 */
export function validateQuery<T>(
  query: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(query);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}

/**
 * Format Zod errors into readable format
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  
  error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });
  
  return errors;
}

/**
 * Create validation error response
 */
export function createValidationError(
  error: z.ZodError,
  requestId: string,
  path: string
) {
  return createErrorResponse(
    'VALIDATION_ERROR',
    'Validation failed',
    {
      errors: formatZodErrors(error),
    },
    requestId,
    path
  );
}

/**
 * Common schemas
 */
export const idSchema = z.string().cuid();

export const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be a valid slug');

export const emailSchema = z.string().email();

export const urlSchema = z.string().url();

export const dateSchema = z.string().datetime();

export const enumSchema = <T extends string>(values: readonly T[]) =>
  z.enum(values as unknown as [T, ...T[]]);

/**
 * Pagination schema with custom defaults
 */
export function createPaginationSchema(defaults?: { page?: number; limit?: number }) {
  return z.object({
    page: z.coerce.number().int().positive().default(defaults?.page || 1),
    limit: z.coerce.number().int().positive().max(100).default(defaults?.limit || 20),
  });
}

/**
 * Search schema
 */
export const searchSchema = z.object({
  q: z.string().min(1).max(255),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * ID parameter schema
 */
export const idParamSchema = z.object({
  id: z.string().cuid(),
});

/**
 * Slug parameter schema
 */
export const slugParamSchema = z.object({
  slug: slugSchema,
});
