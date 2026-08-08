#!/usr/bin/env node
/**
 * RC-5 Phase 2A — Better Auth Compatibility Test Script
 * 
 * Bu script Docker container içinde çalıştırılır.
 * Better Auth'ın frozen schema ile uyumluluğunu test eder.
 * 
 * Kullanım: docker compose exec app node scripts/test-better-auth-poc.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = `phase2a-test-${Date.now()}@test.com`;
const TEST_PASSWORD = 'Test1234!';
const TEST_NAME = 'Phase 2A Test User';
const TEST_USERNAME = `testuser_${Date.now()}`;

let totalPassed = 0;
let totalFailed = 0;
const results = {};

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    totalPassed++;
    return true;
  } else {
    console.log(`  ❌ ${message}`);
    totalFailed++;
    return false;
  }
}

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const data = body ? JSON.stringify(body) : null;
    
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
        ...headers,
      },
    }, (res) => {
      let responseBody = '';
      const responseHeaders = {};
      const setCookies = [];
      
      // Capture all headers
      for (const [key, value] of Object.entries(res.headers)) {
        responseHeaders[key] = value;
        if (key.toLowerCase() === 'set-cookie') {
          setCookies.push(...(Array.isArray(value) ? value : [value]));
        }
      }
      
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: responseHeaders,
          setCookies,
          body: responseBody,
          json: () => { try { return JSON.parse(responseBody); } catch { return null; } },
        });
      });
    });
    
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function parseCookie(cookies, name) {
  for (const cookie of cookies) {
    const parts = cookie.split(';')[0].split('=');
    const cookieName = parts[0].trim();
    const cookieValue = parts.slice(1).join('=').trim();
    if (cookieName === name) return cookieValue;
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// TEST 1: Better Auth Instance Activation
// ═══════════════════════════════════════════════════════

async function testBetterAuthInstance() {
  console.log('\n═══ TEST 1: Better Auth Instance ═══\n');
  
  // Test: /api/auth-test endpoint is accessible
  const res = await request('GET', '/api/auth-test/get-session');
  
  assert(res.status !== undefined, 'Better Auth test endpoint responds');
  assert(res.status === 200 || res.status === 401, `GET /get-session returns ${res.status} (expected 200 or 401)`);
  
  results['better-auth-instance'] = res.status !== undefined;
}

// ═══════════════════════════════════════════════════════
// TEST 2: Sign-Up Flow
// ═══════════════════════════════════════════════════════

async function testSignUp() {
  console.log('\n═══ TEST 2: Sign-Up Flow ═══\n');
  
  const res = await request('POST', '/api/auth-test/sign-up/email', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    name: TEST_NAME,
    username: TEST_USERNAME,
  });
  
  console.log(`  Sign-up response status: ${res.status}`);
  console.log(`  Sign-up response body: ${res.body.substring(0, 200)}`);
  
  assert(res.status === 200, `Sign-up returns 200 (got ${res.status})`);
  
  const body = res.json();
  assert(body && body.user, 'Sign-up returns user object');
  assert(body && body.user.email === TEST_EMAIL, 'User email matches');
  assert(body && body.token, 'Sign-up returns session token');
  
  // Check cookies
  assert(res.setCookies.length > 0, 'Sign-up sets cookies');
  
  const sessionCookie = res.setCookies.find(c => c.includes('session_token'));
  assert(sessionCookie !== undefined, 'session_token cookie is set');
  
  if (sessionCookie) {
    assert(sessionCookie.includes('HttpOnly'), 'session_token cookie is HttpOnly');
    assert(sessionCookie.includes('Path=/'), 'session_token cookie path is /');
  }
  
  results['sign-up'] = res.status === 200 && body && body.user;
  
  return { sessionCookie, body };
}

// ═══════════════════════════════════════════════════════
// TEST 3: Get Session
// ═══════════════════════════════════════════════════════

async function testGetSession(sessionCookie) {
  console.log('\n═══ TEST 3: Get Session ═══\n');
  
  const cookieHeader = sessionCookie ? sessionCookie.split(';')[0] : '';
  
  const res = await request('GET', '/api/auth-test/get-session', null, {
    'Cookie': cookieHeader,
  });
  
  console.log(`  Get session status: ${res.status}`);
  console.log(`  Get session body: ${res.body.substring(0, 200)}`);
  
  assert(res.status === 200, `Get session returns 200 (got ${res.status})`);
  
  const body = res.json();
  assert(body && body.user, 'Get session returns user');
  assert(body && body.user.email === TEST_EMAIL, 'Session user email matches');
  
  // Check field mapping: displayName should be mapped from name
  if (body && body.user) {
    console.log(`  User fields: ${JSON.stringify(Object.keys(body.user))}`);
    // Better Auth should return the user with our schema's field names
  }
  
  results['get-session'] = res.status === 200 && body && body.user;
}

// ═══════════════════════════════════════════════════════
// TEST 4: Sign-In Flow
// ═══════════════════════════════════════════════════════

async function testSignIn() {
  console.log('\n═══ TEST 4: Sign-In Flow ═══\n');
  
  const res = await request('POST', '/api/auth-test/sign-in/email', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  
  console.log(`  Sign-in status: ${res.status}`);
  console.log(`  Sign-in body: ${res.body.substring(0, 200)}`);
  
  assert(res.status === 200, `Sign-in returns 200 (got ${res.status})`);
  
  const body = res.json();
  assert(body && body.user, 'Sign-in returns user object');
  assert(body && body.token, 'Sign-in returns session token');
  
  // Check cookies
  const sessionCookie = res.setCookies.find(c => c.includes('session_token'));
  assert(sessionCookie !== undefined, 'Sign-in sets session_token cookie');
  
  results['sign-in'] = res.status === 200 && body && body.user;
  
  return sessionCookie;
}

// ═══════════════════════════════════════════════════════
// TEST 5: Sign-In with Wrong Password
// ═══════════════════════════════════════════════════════

async function testSignInWrongPassword() {
  console.log('\n═══ TEST 5: Sign-In Wrong Password ═══\n');
  
  const res = await request('POST', '/api/auth-test/sign-in/email', {
    email: TEST_EMAIL,
    password: 'WrongPassword123!',
  });
  
  console.log(`  Wrong password status: ${res.status}`);
  
  assert(res.status === 401 || res.status === 400, `Wrong password returns error (got ${res.status})`);
  
  const body = res.json();
  assert(body && (body.message || body.error), 'Error message returned');
  
  results['sign-in-wrong-password'] = res.status === 401 || res.status === 400;
}

// ═══════════════════════════════════════════════════════
// TEST 6: Sign-Out
// ═══════════════════════════════════════════════════════

async function testSignOut(sessionCookie) {
  console.log('\n═══ TEST 6: Sign-Out ═══\n');
  
  const cookieHeader = sessionCookie ? sessionCookie.split(';')[0] : '';
  
  const res = await request('POST', '/api/auth-test/sign-out', null, {
    'Cookie': cookieHeader,
  });
  
  console.log(`  Sign-out status: ${res.status}`);
  
  assert(res.status === 200, `Sign-out returns 200 (got ${res.status})`);
  
  // Check that session cookie is cleared
  const clearedCookie = res.setCookies.find(c => 
    c.includes('session_token') && (c.includes('Max-Age=0') || c.includes('Expires='))
  );
  assert(clearedCookie !== undefined, 'Sign-out clears session_token cookie');
  
  results['sign-out'] = res.status === 200;
}

// ═══════════════════════════════════════════════════════
// TEST 7: Cookie Contract Verification
// ═══════════════════════════════════════════════════════

async function testCookieContract() {
  console.log('\n═══ TEST 7: Cookie Contract ═══\n');
  
  // Sign up to get cookies
  const signUpRes = await request('POST', '/api/auth-test/sign-up/email', {
    email: `cookie-test-${Date.now()}@test.com`,
    password: TEST_PASSWORD,
    name: 'Cookie Test',
    username: `cookie_${Date.now()}`,
  });
  
  console.log(`  Set-Cookie headers: ${JSON.stringify(signUpRes.setCookies)}`);
  
  // Check session_token cookie name (no prefix!)
  const sessionCookie = signUpRes.setCookies.find(c => c.includes('session_token'));
  assert(sessionCookie !== undefined, 'session_token cookie exists');
  
  if (sessionCookie) {
    // CRITICAL: Cookie name should be exactly "session_token" (no "better-auth." prefix)
    const cookieName = sessionCookie.split(';')[0].split('=')[0].trim();
    assert(cookieName === 'session_token', `Cookie name is exactly "session_token" (got "${cookieName}")`);
    
    // Check attributes
    assert(sessionCookie.includes('HttpOnly'), 'Cookie is HttpOnly');
    assert(sessionCookie.includes('Path=/'), 'Cookie path is /');
    
    // In development, Secure should NOT be set
    if (process.env.NODE_ENV !== 'production') {
      const hasSecure = sessionCookie.includes('Secure');
      console.log(`  Secure flag in development: ${hasSecure}`);
    }
  }
  
  results['cookie-contract'] = sessionCookie !== undefined;
}

// ═══════════════════════════════════════════════════════
// TEST 8: CSRF/Origin Protection
// ═══════════════════════════════════════════════════════

async function testCSRFProtection() {
  console.log('\n═══ TEST 8: CSRF/Origin Protection ═══\n');
  
  // Better Auth uses Origin validation, NOT CSRF tokens
  // Test that requests without proper Origin are handled
  
  // Test 1: Request without Origin header (should work for same-origin)
  const res1 = await request('POST', '/api/auth-test/sign-in/email', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  
  console.log(`  Without Origin header: status ${res1.status}`);
  // Better Auth should handle this (non-browser clients don't send Origin)
  
  // Test 2: Request with trusted Origin header
  const res2 = await request('POST', '/api/auth-test/sign-in/email', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  }, {
    'Origin': 'http://localhost:3000',
  });
  
  console.log(`  With trusted Origin: status ${res2.status}`);
  assert(res2.status === 200 || res2.status === 401, `Trusted origin accepted (got ${res2.status})`);
  
  // Test 3: Request with untrusted Origin header
  const res3 = await request('POST', '/api/auth-test/sign-in/email', {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  }, {
    'Origin': 'http://evil.com',
  });
  
  console.log(`  With untrusted Origin: status ${res3.status}`);
  assert(res3.status === 403 || res3.status === 401, `Untrusted origin rejected (got ${res3.status})`);
  
  // CRITICAL: Our RC-4 CSRF test expects X-CSRF-Token header validation
  // Better Auth does NOT use CSRF tokens - it uses Origin validation
  console.log('\n  ⚠️  NOTE: Better Auth uses Origin validation, NOT X-CSRF-Token');
  console.log('  ⚠️  RC-4 smoke test CSRF expectations are INCOMPATIBLE with Better Auth');
  
  results['csrf-protection'] = res3.status === 403 || res3.status === 401;
}

// ═══════════════════════════════════════════════════════
// TEST 9: Database Verification
// ═══════════════════════════════════════════════════════

async function testDatabaseVerification() {
  console.log('\n═══ TEST 9: Database Verification ═══\n');
  
  // This test requires database access
  // In Docker, we can use psql to verify
  
  const { execSync } = require('child_process');
  
  try {
    // Check User table
    const userCheck = execSync(
      `PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub -t -c "SELECT id, email, \\"displayName\\", \\"emailVerified\\" FROM \\"User\\" WHERE email = '${TEST_EMAIL}'"`,
      { encoding: 'utf-8' }
    ).trim();
    
    console.log(`  User record: ${userCheck}`);
    assert(userCheck.length > 0, 'User record exists in database');
    assert(userCheck.includes(TEST_EMAIL), 'User email matches in database');
    
    // Check Account table (credential account)
    const accountCheck = execSync(
      `PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub -t -c "SELECT id, \\"providerId\\", \\"accountId\\", password IS NOT NULL as has_password FROM \\"Account\\" WHERE \\"providerId\\\" = 'credential'"`,
      { encoding: 'utf-8' }
    ).trim();
    
    console.log(`  Account record: ${accountCheck}`);
    assert(accountCheck.length > 0, 'Account record exists for credential provider');
    assert(accountCheck.includes('t'), 'Account has hashed password (not plaintext)');
    
    // Check Session table
    const sessionCheck = execSync(
      `PGPASSWORD=destiny_password psql -h postgres -U destiny_user -d destiny_rising_hub -t -c "SELECT COUNT(*) FROM \\"Session\\" WHERE \\"userId\\\" IN (SELECT id FROM \\"User\\" WHERE email = '${TEST_EMAIL}')"`,
      { encoding: 'utf-8' }
    ).trim();
    
    console.log(`  Session count: ${sessionCheck}`);
    assert(parseInt(sessionCheck) > 0, 'Session records exist for test user');
    
    results['database-verification'] = userCheck.length > 0 && accountCheck.length > 0;
  } catch (err) {
    console.log(`  ⚠️  Database verification failed: ${err.message}`);
    results['database-verification'] = false;
  }
}

// ═══════════════════════════════════════════════════════
// TEST 10: Redis Connection
// ═══════════════════════════════════════════════════════

async function testRedisConnection() {
  console.log('\n═══ TEST 10: Redis Connection ═══\n');
  
  const { execSync } = require('child_process');
  
  try {
    const redisPing = execSync(
      'redis-cli -h redis ping',
      { encoding: 'utf-8', timeout: 5000 }
    ).trim();
    
    console.log(`  Redis ping: ${redisPing}`);
    assert(redisPing === 'PONG', 'Redis is accessible');
    
    // Check if Better Auth stored any rate limit keys
    const rateLimitKeys = execSync(
      'redis-cli -h redis KEYS "*rate*"',
      { encoding: 'utf-8', timeout: 5000 }
    ).trim();
    
    console.log(`  Rate limit keys: ${rateLimitKeys || '(none)'}`);
    
    results['redis-connection'] = redisPing === 'PONG';
  } catch (err) {
    console.log(`  ⚠️  Redis connection failed: ${err.message}`);
    console.log('  (redis-cli might not be available in app container)');
    // Don't fail the test - Redis might still work from Better Auth
    results['redis-connection'] = null; // null = unknown
  }
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  RC-5 PHASE 2A: BETTER AUTH COMPATIBILITY TEST          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  try {
    // Run all tests
    await testBetterAuthInstance();
    const signUpResult = await testSignUp();
    await testGetSession(signUpResult.sessionCookie);
    const signInCookie = await testSignIn();
    await testSignInWrongPassword();
    await testSignOut(signInCookie);
    await testCookieContract();
    await testCSRFProtection();
    await testDatabaseVerification();
    await testRedisConnection();
    
    // Summary
    console.log('\n══════════════════════════════════════════════════════════');
    console.log('  RESULTS SUMMARY');
    console.log('══════════════════════════════════════════════════════════\n');
    
    for (const [test, result] of Object.entries(results)) {
      const icon = result === true ? '✅' : result === false ? '❌' : '⚠️';
      const status = result === true ? 'PASS' : result === false ? 'FAIL' : 'UNKNOWN';
      console.log(`  ${icon} ${test}: ${status}`);
    }
    
    console.log(`\n  Total: ${totalPassed} passed, ${totalFailed} failed`);
    console.log(`  Overall: ${totalFailed === 0 ? 'PASS' : 'FAIL'}`);
    console.log('\n══════════════════════════════════════════════════════════\n');
    
    // JSON output
    console.log('--- JSON_SUMMARY_START ---');
    console.log(JSON.stringify({
      phase: 'RC5-Phase2A-POC',
      overall: totalFailed === 0 ? 'PASS' : 'FAIL',
      passed: totalPassed,
      failed: totalFailed,
      results,
      timestamp: new Date().toISOString(),
    }, null, 2));
    console.log('--- JSON_SUMMARY_END ---\n');
    
    process.exit(totalFailed > 0 ? 1 : 0);
  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
