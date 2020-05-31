// node_modules/.bin/knex migrate:make create_table_users --env test
// node_modules/.bin/knex migrate:latest --env test
exports.up = (knex) => {
    return knex.schema.createTable('users', (t) => {
        t.increments('id').primary();
        t.string('name').notNull();
        t.string('email').notNull().unique();
        t.string('passwd').notNull();
    });
};

exports.down = (knex) => {
    return knex.schema.dropTable('users');
};
