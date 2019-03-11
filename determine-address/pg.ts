import * as Pg from 'pg';
import * as Fs from 'fs';

class PgCon {
    constructor(
        public host: string,
        public db: string,
        public user: string,
        public pass: string,
        public caFile: string
    ) { }
}

function makeConfig(): Pg.ClientConfig {
    let confJson = Fs.readFileSync('./pg-con.json', 'utf-8')
    let conf: PgCon = JSON.parse(confJson)
    return {
        user: conf.user,
        database: conf.db,
        password: conf.pass,
        host: conf.host,
        ssl: {
            rejectUnauthorized: true,
            ca: Fs.readFileSync(conf.caFile)
        }
    }
}

function makePool() {
    return new Pg.Pool(makeConfig())
}

export let pool = makePool();


