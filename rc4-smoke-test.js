const http = require('http');

const HOST = 'localhost';
const PORT = 3000;

// ─── Helpers ───

function request(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
        ...headers,
      },
    }, (res) => {
      let responseBody = '';
      const rawHeaders = [...res.rawHeaders];
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        rawHeaders,
        body: responseBody,
        json: () => { try { return JSON.parse(responseBody); } catch { return null; } },
      }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    if (data) req.write(data);
    req.end();
  });
}

function parseCookies(rawHeaders) {
  const cookies = {};
  for (let i = 0; i < rawHeaders.length; i += 2) {
    if (rawHeaders[i].toLowerCase() === 'set-cookie') {
      const [nameValue] = rawHeaders[i + 1].split(';');
      const eqIdx = nameValue.indexOf('=');
      if (eqIdx > 0) {
        cookies[nameValue.substring(0, eqIdx).trim()] = nameValue.substring(eqIdx + 1).trim();
      }
    }
  }
  return cookies;
}

function cookieHeader(cookies) {
  return Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
}

function getHeader(rawHeaders, name) {
  for (let i = 0; i < rawHeaders.length; i += 2) {
    if (rawHeaders[i].toLowerCase() === name.toLowerCase()) {
      return rawHeaders[i + 1];
    }
  }
  return null;
}

// ─── Wait for Server ───

async function waitForServer(maxRetries = 60) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await request('GET', '/api/health', null);
      if (res.status === 200) return true;
    } catch { /* not ready */ }
    process.stdout.write(`\r  Waiting for server... ${i}/${maxRetries}`);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('\n  ❌ Server not ready after 60s');
  return false;
}

// ─── Tests ───

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ ${message}`);
    passed++;
  } else {
    console.log(`  ❌ ${message}`);
    failed++;
  }
}

async function testHealthCheck() {
  console.log('\n1/5 Health check');
  const res = await request('GET', '/api/health', null);
  assert(res.status === 200, `Status: ${res.status}`);
  const body = res.json();
  assert(body && body.status === 'healthy', `Status: ${body?.status}`);
}

async function testSecurityHeaders() {
  console.log('\n2/5 Security headers');
  const res = await request('GET', '/api/health', null);
  assert(getHeader(res.rawHeaders, 'x-frame-options') === 'DENY', 'X-Frame-Options: DENY');
  assert(getHeader(res.rawHeaders, 'x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff');
  const hsts = getHeader(res.rawHeaders, 'strict-transport-security');
  assert(hsts && hsts.includes('max-age=31536000'), `HSTS present: ${hsts ? 'yes' : 'no'}`);
  const csp = getHeader(res.rawHeaders, 'content-security-policy');
  assert(csp && csp.includes("default-src 'self'"), `CSP present: ${csp ? 'yes' : 'no'}`);
  const pp = getHeader(res.rawHeaders, 'permissions-policy');
  assert(pp && pp.includes('camera=()'), `Permissions-Policy present: ${pp ? 'yes' : 'no'}`);
}

async function testLoginAndCookies() {
  console.log('\n3/5 Login + cookie validation');
  const res = await request('POST', '/api/auth', { action: 'demo-login' });
  assert(res.status === 200, `Status: ${res.status}`);
  
  const body = res.json();
  assert(body && body.user && body.user.username === 'guardian', `User: ${body?.user?.username}`);
  assert(body && body.csrfToken, `CSRF token in body: ${body?.csrfToken ? 'yes' : 'no'}`);
  
  const cookies = parseCookies(res.rawHeaders);
  assert(cookies.session_token, `session_token cookie: ${cookies.session_token ? 'yes' : 'no'}`);
  assert(cookies.csrf_token, `csrf_token cookie: ${cookies.csrf_token ? 'yes' : 'no'}`);
  
  // Verify separate Set-Cookie headers (not merged)
  let setCookieCount = 0;
  for (let i = 0; i < res.rawHeaders.length; i += 2) {
    if (res.rawHeaders[i].toLowerCase() === 'set-cookie') setCookieCount++;
  }
  assert(setCookieCount >= 2, `Separate Set-Cookie headers: ${setCookieCount}`);
  
  return { cookies, csrfToken: body.csrfToken };
}

async function testCsrfWithoutHeader(auth) {
  console.log('\n4/5 CSRF: sign-out WITHOUT header → expect 403');
  const res = await request('POST', '/api/auth', { action: 'sign-out' }, {
    'Cookie': cookieHeader(auth.cookies),
  });
  assert(res.status === 403, `Status: ${res.status} (expected 403)`);
  const body = res.json();
  assert(body && body.error === 'CSRF validation failed', `Error: ${body?.error}`);
}

async function testCsrfWithHeader(auth) {
  console.log('\n5/5 CSRF: sign-out WITH header → expect 200');
  // Need fresh session since previous test didn't sign out
  const loginRes = await request('POST', '/api/auth', { action: 'demo-login' });
  const loginBody = loginRes.json();
  const freshCookies = parseCookies(loginRes.rawHeaders);
  
  const res = await request('POST', '/api/auth', { action: 'sign-out' }, {
    'Cookie': cookieHeader(freshCookies),
    'X-CSRF-Token': loginBody.csrfToken,
  });
  assert(res.status === 200, `Status: ${res.status} (expected 200)`);
  const body = res.json();
  assert(body && body.success === true, `Success: ${body?.success}`);
}

// ─── Main ───

async function main() {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║       RC-4 PRODUCTION SMOKE TEST      ║');
  console.log('╚═══════════════════════════════════════╝');
  
  const ready = await waitForServer();
  if (!ready) process.exit(1);
  console.log('\n  ✅ Server ready\n');
  
  await testHealthCheck();
  await testSecurityHeaders();
  const auth = await testLoginAndCookies();
  await testCsrfWithoutHeader(auth);
  await testCsrfWithHeader(auth);
  
  console.log('\n═══════════════════════════════════════');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════');
  
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
