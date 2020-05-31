const request = require('supertest');
const app = require('../../src/app');

test('#00 - Deve criar usuário via signup', () => {

    return request(app).post('/auth/signup')
        .send({ name: 'Walter', email: `${ Date.now() }@wesoft.com.br`, passwd: '1234' })
        .then((res) => {
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Walter');
            expect(res.body).toHaveProperty('email');
            expect(res.body).not.toHaveProperty('passwd');
        });
});

test('#01 - Deve receber token ao logar', () => {

    let email = `damaris.${ Date.now() }@wesoft.com.br`;

    return app.services.users.save({ name: 'Damaris Moura', email, passwd: '123456' })
        .then(() => request(app).post('/auth/signin').send({ email, passwd: '123456' }))
        .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });
});

test('#02 - Não deve autenticar com senha errada', () => {

    let email = `damaris.${ Date.now() }@wesoft.com.br`;

    return app.services.users.save({ name: 'Damaris Moura', email, passwd: '123456' })
        .then(() => request(app).post('/auth/signin').send({ email, passwd: '123' }))
        .then((res) => {
            expect(res.status).toBe(400); // erro esperado.
            expect(res.body.error).toBe('Usuário/Senha inválidos!') // mensagem esperada.
        });
});

test('#03 - Não deve autenticar usuário que não está cadastrado', () => {

    let email = `damaris.${ Date.now() }@wesoft.com.br`;

    return request(app).post('/auth/signin').send({ email, passwd: '123123' }).then((res) => {
            expect(res.status).toBe(400); // erro esperado.
            expect(res.body.error).toBe('Usuário não existe') // mensagem esperada.
    });
});

test('#04 - Não deve acessar uma rota protegida sem um token válido', () => {

    return request(app).get('/v1/users').then((res) => {
        expect(res.status).toBe(401)
    });
});