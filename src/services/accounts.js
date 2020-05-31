const ValidationError = require('../errors/ValidationError');

module.exports = (app) => {

    const findById = async (userId) => {

        try {

            const result = await app.db('accounts').where({ user_id: userId }).select();

            return result;
        }
        catch(err) {
            throw new ValidationError(err.message);
        }

    }

    const find = async (filter = {}) => {

        try {

            const result = await app.db('accounts').where(filter).first();

            return result;
        }
        catch (err) {
            throw new ValidationError(err.message);
        }
    }

    const save = async (account) => {

        if (!account.name) throw new ValidationError('Nome é um atributo obrigatório');

        console.log({ name: account.name, user_id: account.user_id })

        const acc_db = await find({ name: account.name, user_id: account.user_id });

        if (acc_db) throw new ValidationError('Já existe uma conta com esse nome');

        try {

            const result = await app.db('accounts').insert(account, '*');

            return result;
        } 
        catch(err) {
            throw new ValidationError(err.message)
        }
    }

    const update = async (id, account) => {

        try {
            
            const result = await app.db('accounts').where({ id }).update(account, '*');

            return result;
        } 
        catch(err) {
            throw new ValidationError(err.message)
        }
    }

    const remove = async (id) => {

        try {
            
            const result = await app.db('accounts').where({ id }).del();

            return result;
        } 
        catch(err) {
            throw new ValidationError(err.message)
        }
    }

    return { find, findById, save, update, remove };
}