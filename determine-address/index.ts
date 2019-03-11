import * as Pg from 'pg';
import * as Fs from 'fs';
import * as PgCopy from 'pg-copy-streams'

export class PgCon {
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

export async function tryConnect() {
    let conf = makeConfig()
    let client = new Pg.Client(conf)
    await client.connect()
    let q = await client.query("select 'hello postgres!' as hello;")
    console.log(q.rows[0].hello)
    
}

tryConnect().then(() => console.log('success!')).catch(err => console.log(err))
