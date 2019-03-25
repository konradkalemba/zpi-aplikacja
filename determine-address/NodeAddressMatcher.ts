import { District, Street, Address } from './address'
import { AddressQuery } from './addressQuery'
import { AddressMatcher } from './addressMatcher'
import { pool } from './pg'
import { QueryResult } from 'pg'
import { compareTwoStrings } from 'string-similarity'

const LAST_PART_MIN_SCORE = 1

export default class NodeAddressMatcher implements AddressMatcher {
  private static streets: QueryResult

  constructor () {
  }

  match(q: AddressQuery): Promise<Address> {
    return new Promise(async (resolve, reject) => {
      const streets = await this.getStreets()
      const regex = /(ul\.|ulica|ulicy|osiedlu przy ul\.|osiedlu|osiedla|osiedle|al\.|alei|aleje|pl\.|plac)\s*(.+?(?=\s+we\s+|\s+w\s+|\s+na\s+|\s+\-\s+|[.|,|0-9|;|\\|/|\(|\)]|\n|$))/img

      let bestMatch
      let match
      
      if ((match = regex.exec(q.description)) !== null) {
        const guess = match[2].trim()
        for (let j = 0; j < streets.rowCount; j++) {
          const streetName = streets.rows[j].nazwa
          const parts = streetName.split(' ')
          let score = 0

          if (parts.length > 1 && guess.indexOf(' ') < 0) {
            score = compareTwoStrings(parts[parts.length - 1], guess)
            if (score < LAST_PART_MIN_SCORE) {
              score = compareTwoStrings(streetName, guess)
            }
          } else {
            score = compareTwoStrings(streetName, guess)
          }
          
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