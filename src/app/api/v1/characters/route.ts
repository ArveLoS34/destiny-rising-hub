import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withMetrics } from '@/lib/api/metrics';
import { withRateLimit } from '@/lib/api/rate-limit';
import { withPermission, extractUserContext } from '@/lib/api/permissions';
import { validateQuery, createValidationError } from '@/lib/api/validation';
import { parseQueryParams, generatePaginationMeta } from '@/lib/api/query-params';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/errors';
import { characters } from '@/data/games/destiny-rising/characters';

/**
 * GET /api/v1/characters
 * List all characters with pagination, filtering, and sorting
 */

// Validation schema for query parameters
const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.string().default('popularity'),
  order: z.enum(['asc', 'desc']).default('desc'),
  'filter[rarity]': z.string().optional(),
  'filter[element]': z.string().optional(),
  'filter[role]': z.string().optional(),
  'filter[faction]': z.string().optional(),
});

export async function GET(request: NextRequest) {
  return withMetrics(request, async (req) => {
    return withRateLimit(req, 'public', async (req) => {
      const requestId = req.headers.get('x-request-id') || `req_${Date.now()}`;
      
      // Parse and validate query parameters
      const queryParams = parseQueryParams(req, {
        allowedSortFields: ['name', 'rarity', 'element', 'role', 'popularity', 'winRate'],
        defaultSortField: 'popularity',
      });
      
      const validation = validateQuery(queryParams, querySchema);
      if (!validation.success) {
        const error = createValidationError(validation.errors, requestId, req.nextUrl.pathname);
        return NextResponse.json(error, { status: 400 });
      }
      
      const { page, limit, sort, order } = validation.data;
      const filters = {
        rarity: validation.data['filter[rarity]'],
        element: validation.data['filter[element]'],
        role: validation.data['filter[role]'],
        faction: validation.data['filter[faction]'],
      };
      
      // Filter characters
      let filteredCharacters = [...characters];
      
      if (filters.rarity) {
        filteredCharacters = filteredCharacters.filter((c) => c.rarity === filters.rarity);
      }
      if (filters.element) {
        filteredCharacters = filteredCharacters.filter((c) => c.element === filters.element);
      }
      if (filters.role) {
        filteredCharacters = filteredCharacters.filter((c) => c.role === filters.role);
      }
      if (filters.faction) {
        filteredCharacters = filteredCharacters.filter((c) => c.faction === filters.faction);
      }
      
      // Sort characters
      filteredCharacters.sort((a, b) => {
        let comparison = 0;
        
        switch (sort) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'rarity': {
            const rarityOrder = { SSR: 4, SR: 3, R: 2, N: 1 };
            comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity];
            break;
          }
          case 'element':
            comparison = a.element.localeCompare(b.element);
            break;
          case 'role':
            comparison = a.role.localeCompare(b.role);
            break;
          case 'popularity':
            comparison = a.popularity - b.popularity;
            break;
          case 'winRate':
            comparison = a.winRate - b.winRate;
            break;
          default:
            comparison = 0;
        }
        
        return order === 'asc' ? comparison : -comparison;
      });
      
      // Paginate
      const total = filteredCharacters.length;
      const offset = (page - 1) * limit;
      const paginatedCharacters = filteredCharacters.slice(offset, offset + limit);
      
      // Create response
      const response = createSuccessResponse(
        paginatedCharacters,
        generatePaginationMeta(page, limit, total),
        requestId
      );
      
      return NextResponse.json(response, { status: 200 });
    });
  });
}

/**
 * POST /api/v1/characters
 * Create a new character (admin only)
 */

const createCharacterSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  rarity: z.enum(['SSR', 'SR', 'R', 'N']),
  element: z.enum(['Fire', 'Water', 'Wind', 'Earth', 'Lightning', 'Ice', 'Light', 'Dark', 'Physical']),
  role: z.enum(['DPS', 'Sub-DPS', 'Support', 'Tank', 'Healer', 'Utility']),
  weaponType: z.string().min(1),
  faction: z.string().min(1),
  icon: z.string().url(),
  portrait: z.string().url(),
});

export async function POST(request: NextRequest) {
  return withMetrics(request, async (req) => {
    return withRateLimit(req, 'admin', async (req) => {
      return withPermission(req, 'admin', async (req, user) => {
        const requestId = req.headers.get('x-request-id') || `req_${Date.now()}`;
        
        try {
          const body = await req.json();
          
          // Validate request body
          const validation = validateQuery(body, createCharacterSchema);
          if (!validation.success) {
            const error = createValidationError(validation.errors, requestId, req.nextUrl.pathname);
            return NextResponse.json(error, { status: 400 });
          }
          
          // TODO: Create character in database
          // For now, return mock response
          
          const response = createSuccessResponse(
            {
              id: `char_${Date.now()}`,
              ...validation.data,
              createdAt: new Date().toISOString(),
            },
            undefined,
            requestId
          );
          
          return NextResponse.json(response, { status: 201 });
        } catch (error) {
          const errResponse = createErrorResponse(
            'INTERNAL_ERROR',
            'Failed to create character',
            undefined,
            requestId,
            req.nextUrl.pathname
          );
          return NextResponse.json(errResponse, { status: 500 });
        }
      });
    });
  });
}
