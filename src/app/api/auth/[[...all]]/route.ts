/**
 * Auth API Routes — Production (Better Auth)
 *
 * Phase 2B-2: Replaced mock auth handler with Better Auth.
 *
 * Previous: 284-line mock auth handler with action-based routing
 * Now: Better Auth handler via toNextJsHandler
 *
 * All auth endpoints are handled by Better Auth internally:
 *   POST /api/auth/sign-up/email
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-out
 *   GET  /api/auth/get-session
 *   ... and more
 *
 * Mock auth handler preserved at:
 *   src/features/user/services/auth-service.ts (deprecated)
 *   Will be removed in Phase 2B-3 cleanup.
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
