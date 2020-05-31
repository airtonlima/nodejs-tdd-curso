const express = require('express');


module.exports = (app) => {

    const router = express.Router();


    router.get('/', (req, res, next) => {
        app.services.users.findAll()
            .then(result => res.status(200).json(result))
            .catch(err => next(err));
    });
    
    router.post('/', (req, res, next) => {
        app.services.users.save(req.body)
            .then(result => res.status(201).json(result[0]))
            .catch(err => next(err));
    });


    return router;
}