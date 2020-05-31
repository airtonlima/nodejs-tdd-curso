
module.exports = {

    test: {
        client: 'pg',
        version: '9.6',
        connection: {
            host: 'ec2-3-231-16-122.compute-1.amazonaws.com',
            user: 'mxqxtvfksunlzu',
            password: '77d31d275b6a3c73267b138736ea3dad1c87cc16220967efc41eda40204e7bfa',
            database: 'd8vjt8bdgiemou',
            port: 5432,
            ssl: {
                rejectUnauthorized: false
            }
        },
        migrations: {
            directory: 'src/migrations'
        }
    }
};

// heroku config:get DATABASE_URL --app app-dev-study