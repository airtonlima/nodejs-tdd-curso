const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';
var USER ;
var USER_2 ;


//-------------------------------------------------------------------------------

// beforeAll -> executa 1x antes DE TODOS OS TESTES.
// beforeEach -> executa 1x antes DE CADA TESTE.

beforeEach(async () => {
    const res = await app.services.users.save({ name: 'User Account 1', email: `${ Date.now() }@wesoft.com.br`, passwd: '123456' });
    USER = { ...res[0]} // desestruturação. clonou objeto de posição 0.
    USER.token = jwt.encode(USER, 'Segredo!');
    
    const res2 = await app.services.users.save({ name: 'User Account 2', email: `${ Date.now() }@wesoft.com.br`, passwd: '123456' });
    USER_2 = { ...res2[0]}
});

// test('#00 - Deve incluir conta com sucesso', () => {
//     return request(app).post(MAIN_ROUTE)
//         .send({ name: 'Acc #1' })
//         .set('authorization', `bearer ${ USER.token }`)
//         .then((res) => {
//             expect(res.status).toBe(201);
//             expect(res.body.name).toBe('Acc #1');
//         })
//         .catch(err => console.log(err.stack))
// });

// test('#01 - Deve listar todas as contas', () => {
//     return app.db('accounts')
//         .insert({ name: 'Acc list', user_id: USER.id })
//         .then(() => {
//             request(app).get(MAIN_ROUTE)
//             .set('authorization', `bearer ${ USER.token }`)
//             .then((res) => {
//                 expect(res.status).toBe(200);
//                 expect(res.body.length).toBeGreaterThan(0);
//             });
//         });
// });

// test('#02 - Deve retornar uma conta por ID', () => {
//     return app.db('accounts')
//         .insert({ name: 'Acc By Id', user_id: USER.id }, ['id'])
//         .then((acc) => {
//             request(app).get(`${ MAIN_ROUTE }/${ acc[0].id }`)
//             .set('authorization', `bearer ${ USER.token }`)
//             .set('Content-Type', 'application/json')
//             .then((res) => {
//                 expect(res.status).toBe(200);
//                 expect(res.body.user_id).toBe(USER.id);
//             })
//             .catch(err => console.log(err.stack));
//         })
//         .catch(err => console.log(err.stack));
// });

// test('#03 - Deve alterar uma conta', () => {
//     return app.db('accounts')
//         .insert({ name: 'Acc to Update', user_id: USER.id }, ['id'])
//         .then(acc => {   
            
//             request(app).put(`${ MAIN_ROUTE }/${ acc[0].id }`)
//                 .set('authorization', `bearer ${ USER.token }`)
//                 .set('Content-type', 'application/json')
//                 .send({ name: 'Acc Updated' })
//                 .then((res)=> {
//                     expect(res.status).toBe(200)
//                     expect(res.body.name).toBe('Acc Updated')
//                 })
//                 .catch(err => console.log(err.stack));
//         })
//         .catch(err => console.log(err.stack));
// });

// test('#04 - Deve remover uma conta', () => {
//     return app.db('accounts')
//         .insert({ name: 'Acc to remove', user_id: USER.id }, ['id'])
//         .then(acc => {
//             request(app).delete(`${ MAIN_ROUTE }/${ acc[0].id }`)
//             .set('authorization', `bearer ${ USER.token }`)
//             .then(res => expect(res.status).toBe(204));
//         });
// });

// test('#05 - Não deve inserir uma conta sem nome', () => {

//     return request(app).post(MAIN_ROUTE)
//         .send({})
//         .set('authorization', `bearer ${ USER.token }`)
//         .then((res) => {
//             expect(res.status).toBe(400);
//             expect(res.body.error).toBe('Nome é um atributo obrigatório');
//         });
// });

// test('#06 - Deve listar somente as contas do usuário', () => {
//     return app.db('accounts').insert([
//             { name: 'Acc User #1', user_id: USER.id }, 
//             { name: 'Acc User #2', user_id: USER_2.id }
//         ])
//         .then(() => {
//             request(app).get(MAIN_ROUTE)
//                 .set('authorization', `bearer ${ USER.token }`)
//                 .then((res) => {
//                     expect(res.status).toBe(200);
//                     expect(res.body.length).toBe(1);
//                     expect(res.body[0].name).toBe('Acc User #1');
//             });
//         });
// });

test('#07 - Não deve inserir uma conta de nome duplicado, para o mesmo usuário', () => {
    return app.db('accounts')
        .insert({ name: 'Acc duplicada', user_id: USER.id })
        .then(() => {
            request(app).post(MAIN_ROUTE)
                .send({ name: 'Acc dupplicada' })
                .set('authorization', `bearer ${ USER.token }`)
                .set('Content-type', 'application/json')
                .then((res) => {
                    expect(res.status).toBe(400)
                    expect(res.body.error).toBe('Já existe um usuário com esse nome')
                })
                .catch(err => console.log(err.stack));
        })
        .catch(err => console.log(err.stack));
});

// test('#08 - Não deve retornar uma conta de outro usuário', () => {
//     return app.db('accounts')
//         .insert({ name: 'Acc User #2', user_id: USER_2.id }, ['id'])
//         .then(acc => {

//             request(app).get(`${ MAIN_ROUTE }/${ acc[0].id }`)
//                 .set('authorization', `bearer ${ USER.token }`)
//                 .then((res) => {
//                     expect(res.status).toBe(403);
//                     expect(res.body.error).toBe('Este recurso não pertence ao usuário');
//                 })
//                 .catch(err => console.log(err.stack));
//         })
//         .catch(err => console.log(err.stack));
// });

// test.skip('Não deve remover uma conta de outro usuário', () => {
// });



