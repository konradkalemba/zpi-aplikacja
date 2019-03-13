import { District, Street, Address } from './address'
import { AddressQuery } from './addressQuery'
import { AddressMatcher } from './addressMatcher'
import { pool } from './pg'
import { QueryResult } from 'pg'
import { filterWordsForStreet } from './common'
import Levenshtein from 'js-levenshtein'

const MIN_LEV = 5000000

export default class NodeAddressMatcher implements AddressMatcher {
  private static streets: QueryResult

  constructor () {
  }

  match(q: AddressQuery): Promise<Address> {
    return new Promise(async (resolve, reject) => {
      const streets = await this.getStreets()
      const words = filterWordsForStreet(q.description.split(/\s+/))

      let resultStreet: Street | null = null
      let minLev = MIN_LEV

      for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < streets.rowCount; j++) {
          const l = Levenshtein(streets.rows[j].nazwa, words[i])
          
          if (l < minLev) {
            minLev = l
            resultStreet = new Street(streets.rows[j].id_teryt, streets.rows[j].nazwa)
          }
        }
      }

      if (resultStreet) {
        resolve(new Address(null, resultStreet))
      } else {
        reject(new Error())
      }
    })
  }

  async getStreets() {
    if (!NodeAddressMatcher.streets) {
      NodeAddressMatcher.streets = await pool.query(`
        select u.nazwa, u.id_teryt
        from ulice u 
        inner join miasta m on m.id_teryt = u.miasto_id_teryt
        where m.nazwa = $1;
      `, ['Wrocław'])
    }

    return NodeAddressMatcher.streets
  }
}