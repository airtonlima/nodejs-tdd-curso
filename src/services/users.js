const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {

    const findAll = (filter = {}) => {
        return app.db('users').where(filter).select(['id', 'name', 'email']);
    };

    const findOne = (filter = {}) => {
        return app.db('users').where(filter).first();
    };

    const getPasswdHash = (passwd) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(passwd, salt);
    }

    const save = async (user) => {
        
        if (!user.name) throw new ValidationError(`nome é um atributo obrigatório`);
        if (!user.email) throw new ValidationError(`email é um atributo obrigatório`);
        if (!user.passwd) throw new ValidationError(`senha é um atributo obrigatório`);

        const userDb = await findOne({ email: user.email });

        if (userDb) throw new ValidationError('Já existe um usuário com esse email');

        const newUser  = { ...user };
        newUser.passwd = getPasswdHash(user.passwd);
        
        try 
        {
            const result = app.db('users').insert(newUser, ['id', 'name', 'email']); // * => campos que serão retornados.... (select * from ....)
            
            return result;
        }
        catch(err) {
            throw new ValidationError(err.message);
        }
    };

    return { findAll, findOne, save, getPasswdHash };
};