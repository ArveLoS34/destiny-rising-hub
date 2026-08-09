/**
 * Auth API Routes — Production (Better Auth)
 *
 * Phase 2B-2: Replaced mock auth handler with Better Auth.
 *
 * All auth endpoints are handled by Better Auth internally:
 *   POST /api/auth/sign-up/email
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-out
 *   GET  /api/auth/get-session
 *   ... and more
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
