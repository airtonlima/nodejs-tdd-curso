const express = require('express');

module.exports = (app) => {
    
    // Roteador Público

    app.use('/auth', app.routes.auth);
    
 //---------------------------------------------------------------------   

    // Roteador Protegido

    const protectedRouter = express.Router();

    protectedRouter.use('/users', app.routes.users);
    protectedRouter.use('/accounts', app.routes.accounts);

    app.use('/v1', app.config.passport.authenticate(), protectedRouter);
};