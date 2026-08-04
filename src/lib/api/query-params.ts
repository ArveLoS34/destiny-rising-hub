import { NextRequest } from 'next/server';

/**
 * API Query Parameters
 * Standardized query parameter parsing for all endpoints
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sortBy: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  filters: Record<string, any>;
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

/**
 * Parse pagination parameters from request
 */
export function parsePagination(request: NextRequest): PaginationParams {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

  return { page, limit };
}

/**
 * Parse sort parameters from request
 */
export function parseSort(
  request: NextRequest,
  allowedFields: string[] = [],
  defaultField: string = 'createdAt'
): SortParams {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sort') || defaultField;
  const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

  // Validate sort field
  const validSortBy = allowedFields.length === 0 || allowedFields.includes(sortBy)
    ? sortBy
    : defaultField;

  return {
    sortBy: validSortBy,
    order: order === 'asc' ? 'asc' : 'desc',
  };
}

/**
 * Parse filter parameters from request
 */
export function parseFilters(request: NextRequest): FilterParams {
  const { searchParams } = new URL(request.url);
  const filters: Record<string, any> = {};

  // Parse filter[key]=value format
  searchParams.forEach((value, key) => {
    if (key.startsWith('filter[') && key.endsWith(']')) {
      const filterKey = key.slice(7, -1);
      
      // Try to parse as JSON for complex values
      try {
        filters[filterKey] = JSON.parse(value);
      } catch {
        // Use as string
        filters[filterKey] = value;
      }
    }
  });

  return { filters };
}

/**
 * Parse all query parameters
 */
export function parseQueryParams(
  request: NextRequest,
  options?: {
    allowedSortFields?: string[];
    defaultSortField?: string;
  }
): QueryParams {
  const pagination = parsePagination(request);
  const sort = parseSort(request, options?.allowedSortFields, options?.defaultSortField);
  const filter = parseFilters(request);

  return {
    ...pagination,
    ...sort,
    ...filter,
  };
}

/**
 * Generate pagination metadata
 */
export function generatePaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Build URL with query parameters
 */
export function buildUrlWithParams(
  baseUrl: string,
  params: Record<string, any>
): string {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        url.searchParams.set(`filter[${key}]`, JSON.stringify(value));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  });

  return url.toString();
}
