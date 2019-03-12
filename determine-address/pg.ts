import * as Pg from 'pg';
import * as Fs from 'fs';

function makeConfig(): Pg.ClientConfig {
    let config: Pg.ClientConfig = {
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST
    }

    if (process.env.DB_CA_FILE) {
        config.ssl = {
            rejectUnauthorized: true,
            ca: Fs.readFileSync(process.env.DB_CA_FILE)
        }
    }

    return config
}

function makePool() {
    return new Pg.Pool(makeConfig())
}

export let pool = makePool();


