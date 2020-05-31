const request = require('supertest')
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/users';
var USER;

const email = `airton.${ Date.now() }@wesoft.com.br`;

jest.setTimeout(3000000);

//-------------------------------------------------------------------------------

beforeAll(async () => {
    let params = { name: 'Airton Lima', email: `airton.${ Date.now() }@wesoft.com.br`, passwd: '1234' };
    const res = await app.services.users.save(params);
    USER = { ...res[0] };
    USER.token = jwt.encode(USER, 'Segredo!');
});


test('#00 - Deve listar todos os usuários', async () => {
    const res = await request(app).get(MAIN_ROUTE).set('authorization', `bearer ${ USER.token }`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
});

// test.skip
// test.only
test('#01 - Deve inserir usuário com sucesso', () => {
    return request(app).post(MAIN_ROUTE)
        .send({ name: 'Airton Lima', email, passwd: '1234' })
        .set('authorization', `bearer ${ USER.token }`)
        .then((res) => {
            expect(res.status).toBe(201); // HTTP RC=201 -> resource was created.
            expect(res.body.name).toBe('Airton Lima');
            expect(res.body).not.toHaveProperty('passwd');
        });
});

// forma 1 com return... retorna para o jest q se encarrega de gerenciar o retorno da execução.
test('#02 - Não deve inserir usuário sem nome', () => {
    return request(app).post(MAIN_ROUTE)
        .send({ email: `airton.${ Date.now() }@wesoft.com.br`, passwd: '1234' })
        .set('authorization', `bearer ${ USER.token }`)
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('nome é um atributo obrigatório');
        });
});

// forma 2 async await
test('#03 - Não deve inserir usuário sem email', async () => {

    const res = await request(app).post(MAIN_ROUTE)
        .send({ name: 'Airton Lima', passwd: '1234' })
        .set('authorization', `bearer ${ USER.token }`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('email é um atributo obrigatório');
});

// forma 3 com done
test('#04 - Não deve inserir um usuário sem senha', (done) => {
    return request(app).post(MAIN_ROUTE)
        .send({ name: 'Airton Lima', email: `airton.${ Date.now() }@wesoft.com.br` })
        .set('authorization', `bearer ${ USER.token }`)
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('senha é um atributo obrigatório');
            done();
        })
        .catch(err => done.fail(err)); 
});


test('#05 - Não deve inserir usuário com email já existente', () => {
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${ USER.token }`)
        .send({ name: 'Airton Lima', email, passwd: '123456' })
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Já existe um usuário com esse email');
        });
});

test('#06 - Deve armazenar a senha criptografada', async () => {

    let param = { name: 'Airton Lima', email: `airton.${ Date.now() }@wesoft.com.br`, passwd: '1234' };
    const res = await request(app).post(MAIN_ROUTE).send(param).set('authorization', `bearer ${ USER.token }`);
    expect(res.status).toBe(201);

    const { id } = res.body;
    const usrDb = await app.services.users.findOne({ id });
    expect(usrDb.passwd).not.toBeUndefined();
    expect(usrDb.passwd).not.toBe('1234');
    expect(usrDb.passwd.length).toBeGreaterThan(param.passwd.length);
});