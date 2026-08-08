/**
 * RC-5 Phase 2A — Better Auth Test Route
 * DIAGNOSTIC WRAPPER — Temporary
 * 
 * Purpose: Log the exact Request URL reaching this handler
 * to determine where 404 originates in the request chain.
 */

import { auth } from "@/lib/auth/better-auth-poc";
import { toNextJsHandler } from "better-auth/next-js";

const originalHandler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
  console.log(`[POC-DIAG] GET ${req.url}`);
  return originalHandler.GET(req);
};

export const POST = async (req: Request) => {
  console.log(`[POC-DIAG] POST ${req.url}`);
  return originalHandler.POST(req);
};
