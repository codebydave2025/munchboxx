const http = require('http');

const orderData = JSON.stringify({
    id: "TEST-SINGLE-" + Date.now(),
    customer: {
        name: "Tester",
        phone: "123",
        address: "Veritas",
        notes: "Test"
    },
    items: [],
    fees: { takeaway: 0, delivery: 0 },
    total: 0,
    status: "pending",
    date: new Date().toISOString()
});

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/orders',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': orderData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (e) => console.error(`ERROR: ${e.message}`));
req.write(orderData);
req.end();
