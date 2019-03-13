import { District, Street, Address } from './address'
import { AddressQuery } from './addressQuery'
import { AddressMatcher } from './addressMatcher'
import { pool } from './pg'
import { QueryResult } from 'pg'
import { filterWordsForStreet, minSimilarity } from './common'

export default class PostgresAddressMatcher implements AddressMatcher {
  constructor () {
  }

  match(q: AddressQuery): Promise<Address> {
    return new Promise(async (resolve, reject) => {
      const words = filterWordsForStreet(q.description.split(/\s+/))
      let results = new Array()

      for (var i = 0; i < words.length; i++) {
        let r = await pool.query(`
          select u.id_teryt, u.nazwa, similarity(u.nazwa, $1) as sim
          from ulice u 
          inner join miasta m on m.id_teryt = u.miasto_id_teryt
          where m.nazwa = $2
          order by similarity(u.nazwa, $1) desc
          limit 1;
        `, [words[i], 'Wrocław'])
        let row = r.rows[0]
        if (row.sim > minSimilarity) {
          results.push({
            sim: row.sim,
            idTeryt: row.id_teryt,
            nazwa: row.nazwa
          })
        }
      } 
      let sorted = results.sort((r1, r2) => r2.sim > r1.sim ? 1 : (r2.sim == r1.sim ? 0 : -1))
      if (sorted.length > 0) {
        resolve(new Address(null, new Street(sorted[0].idTeryt, sorted[0].nazwa)))
      } else {
        reject(new Error())        
      }
    })
  }
}