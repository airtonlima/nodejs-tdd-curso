const express = require('express');

module.exports = (app) => {
    
    const router = express.Router();
    
    
    router.get('/', (req, res, next) => {
        app.services.accounts.findById(req.user.id)
            .then(result => res.status(200).json(result))
            .catch(err => next(err));    
    });
    
    router.get('/:id', (req, res, next) => {
        app.services.accounts.find({ id: req.params.id })
            .then((result) => { 
                
                if (result.user_id !== req.params.id) // pode usar objeto params ou user. objeto user é o passport que cria de acordo com token.
                    return res.status(403).json({ error: 'Este recurso não pertence ao usuário' });

                return res.status(200).json(result) 
            })
            .catch(err => next(err));
    });
    
    router.post('/', (req, res, next) => {
        // console.log(req.user) // objeto payload -- gravado pelo middleware passport.
        app.services.accounts.save({ ...req.body, user_id: req.user.id }) // user_id é sobrescrito com valor que está em req.user
            .then((result) => res.status(201).json(result[0]))
            .catch(err => next(err));
    });
    
    router.put('/:id', (req, res, next) => {
        app.services.accounts.update(req.params.id, req.body)
            .then(result => res.status(200).json(result[0]))
            .catch(err => next(err));
    });
    
    router.delete('/:id', (req, res, next) => {
        app.services.accounts.remove(req.params.id)
            .then(() => res.status(204).send())
            .catch(err => next(err));
    });
    
    
    return router;
}
