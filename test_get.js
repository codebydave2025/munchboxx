const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/menu',
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('BODY:', body.substring(0, 100));
    });
});

req.on('error', (e) => console.error(`ERROR: ${e.message}`));
req.end();
