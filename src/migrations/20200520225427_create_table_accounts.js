// node_modules/.bin/knex migrate:make create_table_accounts --env test
// node_modules/.bin/knex migrate:latest --env test
exports.up = (knex) => {
    return knex.schema.createTable('accounts', (t) => {
        t.increments('id').primary();
        t.string('name').notNull();
        t.integer('user_id')
            .references('id')
            .inTable('users')
            .notNull();
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('accounts');
};
