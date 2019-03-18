import { District, Street, Address } from './address'
import { AddressQuery } from './addressQuery'
import { AddressMatcher } from './addressMatcher'
import { pool } from './pg'
import { QueryResult } from 'pg'
import { compareTwoStrings } from 'string-similarity'

export default class NodeAddressMatcher implements AddressMatcher {
  private static streets: QueryResult

  constructor () {
  }

  match(q: AddressQuery): Promise<Address> {
    return new Promise(async (resolve, reject) => {
      const streets = await this.getStreets()
      const regex = /(ul\.|ulica|ulicy|osiedlu przy ul\.|osiedlu|osiedla|osiedle|al\.|alei|aleje|pl\.|plac)\s(.+?(?=\s+we\s+|\s+w\s+|\s+na\s+|[.|,|0-9|;|\\|/|\(|\)]|\n))/img

      let bestMatch
      let match
      
      if ((match = regex.exec(q.description)) !== null) {
        for (let j = 0; j < streets.rowCount; j++) {
          const score = compareTwoStrings(streets.rows[j].nazwa, match[2].trim())
          
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = {
              index: j,
              score
            }
          }
        }
      }

      if (bestMatch) {
        resolve(
          new Address(
            null,
            new Street(
              streets.rows[bestMatch.index].id_teryt,
              streets.rows[bestMatch.index].nazwa
            )
          )
        )
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