const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

const ValidationError = require('../errors/ValidationError');

const secret = 'Segredo!';


module.exports = (app) => {

    const router = express.Router();


    router.post('/signin', (req, res, next) => {

        app.services.users.findOne({ email: req.body.email }).then((user) => {

            if (!user) throw new ValidationError('Usuário não existe');

            if (bcrypt.compareSync(req.body.passwd, user.passwd)) 
            {
                const payload = { id: user.id, name: user.name, email: user.email }

                const token = jwt.encode(payload, secret);
                
                res.status(200).json({ token });
            }
            else throw new ValidationError('Usuário/Senha inválidos!');
        })
        .catch(err =>  next(err));
    });

    router.post('/signup', (req, res, next) => {
        app.services.users.save(req.body)
            .then(result => res.status(201).json(result[0]))
            .catch(err => next(err));
    });

    return router;
};