const http = require('http');

// Wait for server to be ready
async function waitForServer(maxRetries = 30, delay = 1000) {
  console.log('Waiting for server to be ready...');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3000,
          path: '/api/health',
          method: 'GET',
          timeout: 2000,
        }, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        });
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
        req.end();
      });
      
      console.log('✅ Server is ready!\n');
      return true;
    } catch (err) {
      console.log(`  Attempt ${i + 1}/${maxRetries}: Server not ready (${err.message}), waiting ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error('❌ Server did not become ready in time');
  return false;
}

// Helper: Parse Set-Cookie headers from rawHeaders
function parseCookies(rawHeaders) {
  const cookies = {};
  for (let i = 0; i < rawHeaders.length; i += 2) {
    if (rawHeaders[i].toLowerCase() === 'set-cookie') {
      const cookieStr = rawHeaders[i + 1];
      const [nameValue] = cookieStr.split(';');
      const [name, value] = nameValue.split('=');
      cookies[name.trim()] = value.trim();
    }
  }
  return cookies;
}

// Helper: Make HTTP request
function makeRequest(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': data.length }),
        ...headers,
      },
    }, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          rawHeaders: res.rawHeaders,
          cookies: parseCookies(res.rawHeaders),
          body: responseBody,
        });
      });
    });
    
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Helper: Login and return cookies + csrf token
async function login() {
  const res = await makeRequest('POST', '/api/auth', { action: 'demo-login' });
  const csrfToken = res.body ? JSON.parse(res.body).csrfToken : null;
  return {
    session_token: res.cookies.session_token,
    csrf_token: res.cookies.csrf_token,
    csrfToken: csrfToken,
  };
}

// Test runner
async function runTests() {
  console.log('=== CSRF VALIDATION TEST SUITE ===\n');
  
  // Wait for server
  const ready = await waitForServer();
  if (!ready) {
    process.exit(1);
  }
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Sign-out WITHOUT X-CSRF-Token header (should fail with 403)
  console.log('TEST 1: Sign-out WITHOUT CSRF header');
  const auth1 = await login();
  console.log('  session_token:', auth1.session_token ? 'YES' : 'NO');
  console.log('  csrf_token:', auth1.csrf_token ? 'YES' : 'NO');
  console.log('  CSRF token (body):', auth1.csrfToken ? 'YES' : 'NO');
  
  const res1 = await makeRequest(
    'POST',
    '/api/auth',
    { action: 'sign-out' },
    {
      'Cookie': `session_token=${auth1.session_token}; csrf_token=${auth1.csrf_token}`,
    }
  );
  console.log('  Response status:', res1.status);
  console.log('  Response body:', res1.body);
  if (res1.status === 403) {
    console.log('  ✅ PASSED (403 as expected)');
    passed++;
  } else {
    console.log('  ❌ FAILED (expected 403, got', res1.status + ')');
    failed++;
  }
  
  console.log('\n---\n');
  
  // Test 2: Sign-out WITH correct X-CSRF-Token header (should succeed with 200)
  console.log('TEST 2: Sign-out WITH correct CSRF header');
  const auth2 = await login();
  console.log('  session_token:', auth2.session_token ? 'YES' : 'NO');
  console.log('  csrf_token:', auth2.csrf_token ? 'YES' : 'NO');
  console.log('  CSRF token (body):', auth2.csrfToken ? 'YES' : 'NO');
  
  const res2 = await makeRequest(
    'POST',
    '/api/auth',
    { action: 'sign-out' },
    {
      'Cookie': `session_token=${auth2.session_token}; csrf_token=${auth2.csrf_token}`,
      'X-CSRF-Token': auth2.csrfToken,
    }
  );
  console.log('  Response status:', res2.status);
  console.log('  Response body:', res2.body);
  if (res2.status === 200) {
    console.log('  ✅ PASSED (200 as expected)');
    passed++;
  } else {
    console.log('  ❌ FAILED (expected 200, got', res2.status + ')');
    failed++;
  }
  
  console.log('\n---\n');
  
  // Test 3: Sign-out WITH wrong X-CSRF-Token header (should fail with 403)
  console.log('TEST 3: Sign-out WITH wrong CSRF header');
  const auth3 = await login();
  console.log('  session_token:', auth3.session_token ? 'YES' : 'NO');
  console.log('  csrf_token:', auth3.csrf_token ? 'YES' : 'NO');
  
  const res3 = await makeRequest(
    'POST',
    '/api/auth',
    { action: 'sign-out' },
    {
      'Cookie': `session_token=${auth3.session_token}; csrf_token=${auth3.csrf_token}`,
      'X-CSRF-Token': 'wrong_token_value_12345',
    }
  );
  console.log('  Response status:', res3.status);
  console.log('  Response body:', res3.body);
  if (res3.status === 403) {
    console.log('  ✅ PASSED (403 as expected)');
    passed++;
  } else {
    console.log('  ❌ FAILED (expected 403, got', res3.status + ')');
    failed++;
  }
  
  console.log('\n=== TEST SUITE COMPLETE ===');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
