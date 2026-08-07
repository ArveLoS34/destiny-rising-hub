const http = require('http');

const data = JSON.stringify({ action: 'demo-login' });

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
}, (res) => {
  console.log('=== STATUS ===');
  console.log(res.statusCode);

  console.log('\n=== rawHeaders (unmodified) ===');
  // rawHeaders is a flat array: [key1, val1, key2, val2, ...]
  // If Set-Cookie appears twice, there will be TWO separate key-value pairs
  for (let i = 0; i < res.rawHeaders.length; i += 2) {
    const key = res.rawHeaders[i];
    const val = res.rawHeaders[i + 1];
    if (key.toLowerCase() === 'set-cookie') {
      console.log(`SET-COOKIE [${i}]: ${val}`);
    }
  }

  console.log('\n=== All rawHeaders ===');
  for (let i = 0; i < res.rawHeaders.length; i += 2) {
    console.log(`  ${res.rawHeaders[i]}: ${res.rawHeaders[i + 1].substring(0, 120)}`);
  }

  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('\n=== Body ===');
    console.log(body.substring(0, 200));
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();
