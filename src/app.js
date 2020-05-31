const app = require('express')();
const consign = require('consign');

const knex = require('knex');
const knexfile = require('../knexfile');

// TODO criar chaveamento dinâmico
app.db = knex(knexfile.test);

consign({ cwd: 'src', verbose: false })
    .include('./config/passport.js')
    .include('./config/middlewares.js')
    .include('./services')
    .include('./routes')
    .then('./config/router.js')
    .into(app);
 
app.get('/', (req, res) => {
    
    res.status(200).send();
});

app.use((err, req, res, next) => {

    const { name, message, stack } = err;

    if (name === 'ValidationError') res.status(400).json({ error: message });

    //else res.json({ name, message, stack });

    next(err);
});


// eventos db --> bom para debugar. 

// app.db.on('query', (query) => {
//     console.log({ 
//         sql: query.sql, 
//         bindings: query.bindings ? query.bindings.join(', ') : ''
//     });
// })
// .on('query-response', (res) => console.log(res))
// .on('error', err => console.log(err));


module.exports = app;
