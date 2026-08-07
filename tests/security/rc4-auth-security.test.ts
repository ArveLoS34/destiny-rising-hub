#!/usr/bin/env node

/**
 * RC-4 Step 2: Authentication & Authorization Security Tests
 * 
 * Test Coverage:
 * 1. Authentication flows (sign-in, sign-up, sign-out)
 * 2. Session management
 * 3. Authorization (RBAC)
 * 4. Unauthorized access attempts
 * 5. Token validation
 * 6. Security headers
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  test: string;
  passed: boolean;
  details: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
}

const results: TestResult[] = [];

async function test(name: string, fn: () => Promise<{ passed: boolean; details: string; severity?: any }>) {
  try {
    const result = await fn();
    results.push({ test: name, ...result });
    console.log(`${result.passed ? '✅' : '❌'} ${name}`);
    console.log(`   ${result.details}`);
  } catch (error) {
    results.push({ 
      test: name, 
      passed: false, 
      details: `Error: ${error instanceof Error ? error.message : String(error)}`,
      severity: 'critical'
    });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('RC-4 Step 2: Authentication & Authorization Security Tests');
  console.log('═══════════════════════════════════════════════════════════\n');

  // Test 1: Health endpoint accessibility
  await test('Health endpoint is accessible without auth', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    return {
      passed: res.status === 200 && data.status === 'healthy',
      details: `Status: ${res.status}, Health: ${data.status}`
    };
  });

  // Test 2: Get current user without authentication
  await test('Get current user returns null without auth', async () => {
    const res = await fetch(`${BASE_URL}/api/auth`);
    const data = await res.json();
    return {
      passed: res.status === 200 && data.user === null,
      details: `Status: ${res.status}, User: ${data.user}`
    };
  });

  // Test 3: Sign up with valid credentials
  await test('Sign up creates new user', async () => {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-up',
        email: `test_${Date.now()}@example.com`,
        username: `testuser_${Date.now()}`,
        displayName: 'Test User',
        password: 'TestPass123!'
      })
    });
    const data = await res.json();
    return {
      passed: res.status === 200 && data.user !== null,
      details: `Status: ${res.status}, User created: ${data.user?.username || 'none'}`
    };
  });

  // Test 4: Sign up with duplicate email
  await test('Sign up rejects duplicate email', async () => {
    const email = `duplicate_${Date.now()}@example.com`;
    
    // First sign up
    await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-up',
        email,
        username: `user1_${Date.now()}`,
        displayName: 'User 1',
        password: 'TestPass123!'
      })
    });

    // Second sign up with same email
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-up',
        email,
        username: `user2_${Date.now()}`,
        displayName: 'User 2',
        password: 'TestPass123!'
      })
    });
    const data = await res.json();
    return {
      passed: data.error === 'Email already in use',
      details: `Error: ${data.error || 'none'}`
    };
  });

  // Test 5: Sign in with valid credentials
  await test('Sign in with valid credentials', async () => {
    const email = `signin_${Date.now()}@example.com`;
    
    // Sign up first
    await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-up',
        email,
        username: `signinuser_${Date.now()}`,
        displayName: 'Sign In User',
        password: 'TestPass123!'
      })
    });

    // Sign in
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-in',
        email,
        password: 'TestPass123!'
      })
    });
    const data = await res.json();
    return {
      passed: res.status === 200 && data.user !== null,
      details: `Status: ${res.status}, User: ${data.user?.username || 'none'}`
    };
  });

  // Test 6: Sign in with invalid credentials
  await test('Sign in rejects invalid credentials', async () => {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-in',
        email: 'nonexistent@example.com',
        password: 'WrongPassword123!'
      })
    });
    const data = await res.json();
    return {
      passed: data.error === 'Invalid credentials',
      details: `Error: ${data.error || 'none'}`
    };
  });

  // Test 7: Sign out
  await test('Sign out clears session', async () => {
    // Sign in first
    await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'demo-login'
      })
    });

    // Sign out
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-out'
      })
    });
    const data = await res.json();

    // Check if user is null
    const checkRes = await fetch(`${BASE_URL}/api/auth`);
    const checkData = await checkRes.json();

    return {
      passed: data.success === true && checkData.user === null,
      details: `Sign out: ${data.success}, User after: ${checkData.user}`
    };
  });

  // Test 8: Demo login
  await test('Demo login works', async () => {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'demo-login'
      })
    });
    const data = await res.json();
    return {
      passed: res.status === 200 && data.user !== null && data.user.username === 'guardian',
      details: `Status: ${res.status}, User: ${data.user?.username || 'none'}`
    };
  });

  // Test 9: Characters API accessible without auth
  await test('Characters API accessible without auth', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/characters`);
    const data = await res.json();
    return {
      passed: res.status === 200 && data.data !== undefined,
      details: `Status: ${res.status}, Characters: ${data.data?.length || 0}`
    };
  });

  // Test 10: Invalid action handling
  await test('Invalid action returns 400', async () => {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'invalid-action'
      })
    });
    const data = await res.json();
    return {
      passed: res.status === 400 && data.error === 'Unknown action',
      details: `Status: ${res.status}, Error: ${data.error || 'none'}`
    };
  });

  // Test 11: SQL Injection attempt in email
  await test('SQL Injection attempt in email is handled', async () => {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-in',
        email: "'; DROP TABLE users; --",
        password: 'TestPass123!'
      })
    });
    const data = await res.json();
    return {
      passed: res.status === 200 && data.user === null,
      details: `Status: ${res.status}, User: ${data.user}, Error: ${data.error || 'none'}`,
      severity: 'high'
    };
  });

  // Test 12: XSS attempt in username
  await test('XSS attempt in username is handled', async () => {
    const res = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sign-up',
        email: `xss_${Date.now()}@example.com`,
        username: '<script>alert("xss")</script>',
        displayName: 'XSS User',
        password: 'TestPass123!'
      })
    });
    const data = await res.json();
    // Should either reject or sanitize
    const passed = data.error !== undefined || !data.user?.username.includes('<script>');
    return {
      passed,
      details: `Username: ${data.user?.username || 'rejected'}, Error: ${data.error || 'none'}`,
      severity: 'high'
    };
  });

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('Test Summary');
  console.log('═══════════════════════════════════════════════════════════');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const critical = results.filter(r => r.severity === 'critical' && !r.passed).length;
  const high = results.filter(r => r.severity === 'high' && !r.passed).length;
  
  console.log(`\nTotal Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`\nSeverity:`);
  console.log(`  🔴 Critical: ${critical}`);
  console.log(`  🟠 High: ${high}`);
  
  console.log('\n═══════════════════════════════════════════════════════════');
  
  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ❌ ${r.test}`);
      console.log(`     ${r.details}`);
    });
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
