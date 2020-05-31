const request = require('supertest');

const app = require('../src/app');

test('#00 - Deve responder na raiz', async () => {
    const res = await request(app).get('/');
    return expect(res.status).toBe(200);
});