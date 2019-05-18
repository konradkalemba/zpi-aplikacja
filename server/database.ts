import fs from 'fs'
import { createConnection } from 'typeorm'
import { Ad, Street, Photo } from './entities'
import { TlsOptions } from 'tls'

const { DB_USER, DB_NAME, DB_PASS, DB_HOST, DB_CA_FILE } = process.env

const entities = [
    Ad, Street, Photo
]

export function connect () {
    let ssl: TlsOptions | undefined
    
    if (DB_CA_FILE) {
        ssl = {
            rejectUnauthorized: true,
            ca: fs.readFileSync(DB_CA_FILE)
        }
    }

    return createConnection({
        type: 'postgres',
        host: DB_HOST,
        port: 5432,
        username: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        entities,
        ssl
    })
}