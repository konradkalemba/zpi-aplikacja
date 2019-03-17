import { District, Street, Address } from './address'
import { AddressQuery } from './addressQuery'
import { AddressMatcher } from './addressMatcher'
import { pool } from './pg'
import { QueryResult } from 'pg'
import { filterWordsForStreet, minSimilarity } from './common'
import * as PgCopy from 'pg-copy-streams';
import { Readable } from 'stream';

export default class PostgresAddressMatcher implements AddressMatcher {
  constructor() { }

  async match(q: AddressQuery): Promise<Address> {
    let words = filterWordsForStreet(q.description.split(/\s+/))
    let c = await pool.connect()
    await c.query('begin; create temp table ul_temp(nazwa text) on commit drop;')
    let s = await c.query(PgCopy.from('copy ul_temp from stdin;'))
    let r = new Readable
    for (var i = 0; i < words.length; i++) {
      r.push(words[i])
      r.push('\n')
    }
    r.push(null)
    r.pipe(s)
    await new Promise((res, rej) => {
      r.on('end', () => res()).on('error', (err) => rej(err))
    })
    let res = await c.query(`
          select u.id_teryt, u.nazwa, similarity(u.nazwa, u2.nazwa) as sim
          from ulice u 
          cross join ul_temp u2
          inner join miasta m on m.id_teryt = u.miasto_id_teryt
          where m.nazwa = $1
          order by u.nazwa <-> u2.nazwa
          limit 1;
        `, ['Wrocław'])
    return Promise.resolve(new Address(null, new Street(res.rows[0].idTeryt, res.rows[0].nazwa)))
  }
}
