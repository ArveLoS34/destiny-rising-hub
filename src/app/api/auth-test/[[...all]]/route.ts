/**
 * RC-5 Phase 2A — Better Auth Test Route
 * 
 * BU ROUTE TEST AMAÇLIDIR. Production /api/auth route'unu 替换 etmez.
 * Mock auth hala aktif. Bu route sadece Better Auth uyumluluğunu test eder.
 * 
 * Endpoint: /api/auth-test/[...all]
 * 
 * Test edilecek akışlar:
 * - POST /api/auth-test/sign-up/email
 * - POST /api/auth-test/sign-in/email
 * - GET  /api/auth-test/get-session
 * - POST /api/auth-test/sign-out
 */

import { auth } from "@/lib/auth/better-auth-poc";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
