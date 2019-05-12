import { compareTwoStrings } from 'string-similarity'

import { Street } from './../entities'

const LAST_PART_MIN_SCORE: number = 1

type Match = {
    street: Street,
    score: number
}

export class AddressMatcher {
    private static streets: Street[]

    static match(description: string): Promise<Street> {
        return new Promise<Street>(async (resolve, reject) => {
            const streets: Street[] = await AddressMatcher.getStreets()
            const regex = /(ul\.|\s+ul\s+|\s+u\.|\s+ulica[^.]|\s+ulicy[^.]|\s+bloku na[^.]|\s+osiedlu przy ul\.|osiedlu[^.]|\s+osiedla[^.]|\s+osiedle[^.]|al\.|alei|aleje|pl\.|plac(?=[^.])\s+(?=(?!zabaw))|\s+at.(?=Street))\s*(.+?(?=\s+we\s+|\s+w\s+|\s+na\s+|\s+\-\s+|Street|(?<=[^.]{3})\.|[,|0-9|;|\\|/|\(|\)]|\n|$))/img

            let bestMatch: Match | undefined
            let regexMatch

            if ((regexMatch = regex.exec(description)) !== null) {
                const guess: string = regexMatch[2].trim()

                for (const street of streets) {
                    const parts: string[] = street.name.split(' ')
                    let score: number = 0

                    if (parts.length > 1 && guess.indexOf(' ') < 0) {
                        score = compareTwoStrings(parts[parts.length - 1], guess)

                        if (score < LAST_PART_MIN_SCORE) {
                            score = compareTwoStrings(street.name, guess)
                        }
                    } else {
                        score = compareTwoStrings(street.name, guess)
                    }
                
                    if (!bestMatch || score > bestMatch.score) {
                        bestMatch = {
                            street,
                            score
                        }
                    }
                }
            }

            if (bestMatch) {
                resolve(bestMatch.street)
            } else {
                reject(new Error())
            }
        })
    }

    static async getStreets() {
        if (!AddressMatcher.streets) {
            AddressMatcher.streets = await Street.find({ cityId: 986283 })
            // AddressMatcher.streets = await pool.query(`
            //     select u.nazwa, u.id_teryt
            //     from ulice u 
            //     inner join miasta m on m.id_teryt = u.miasto_id_teryt
            //     where m.nazwa = $1
            // `, ['Wrocław'])
        }

        return AddressMatcher.streets
    }
}