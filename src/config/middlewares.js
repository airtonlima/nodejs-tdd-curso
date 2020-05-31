const bodyParser = require('body-parser');
// const knexLogger = require('knex-logger');

module.exports = (app) => {
    
    app.use(bodyParser.json())
    // logger
    // app.use(knexLogger(app.db));
}