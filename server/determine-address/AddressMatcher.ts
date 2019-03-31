import { Address } from './address';
import { pool } from './pg';
import { QueryResult } from 'pg';
import { compareTwoStrings } from 'string-similarity';

const LAST_PART_MIN_SCORE: number = 0.9;

type Match = {
    address: Address,
    score: number
}

export class AddressMatcher {
    private static streets: QueryResult;

    static match(description: string): Promise<Address> {
        return new Promise<Address>(async (resolve, reject) => {
            const streets: QueryResult = await AddressMatcher.getStreets();
            const regex = /(ul\.|ulica|ulicy|osiedlu przy ul\.|osiedlu|osiedla|osiedle|al\.|alei|aleje|pl\.|plac)\s*(.+?(?=\s+we\s+|\s+w\s+|\s+na\s+|\s+\-\s+|[.|,|0-9|;|\\|/|\(|\)]|\n|$))/img;

            let bestMatch: Match | undefined;
            let regexMatch;

            if ((regexMatch = regex.exec(description)) !== null) {
                const guess: string = regexMatch[2].trim();

                for (let j = 0; j < streets.rowCount; j++) {
                    const row = streets.rows[j];
                    const parts: string[] = row['nazwa'].split(' ');
                    let score: number = 0;

                    if (parts.length > 1 && guess.indexOf(' ') < 0) {
                        score = compareTwoStrings(parts[parts.length - 1], guess);

                        if (score < LAST_PART_MIN_SCORE) {
                            score = compareTwoStrings(row['nazwa'], guess);
                        }
                    } else {
                        score = compareTwoStrings(row['nazwa'], guess);
                    }
                
                    if (!bestMatch || score > bestMatch.score) {
                        bestMatch = {
                            address: {
                                id: row['id_teryt'],
                                name: row['nazwa']
                            },
                            score
                        };
                    }
                }
            }

            if (bestMatch) {
                resolve(bestMatch.address);
            } else {
                reject(new Error());
            }
        })
    }

    static async getStreets() {
        if (!AddressMatcher.streets) {
            AddressMatcher.streets = await pool.query(`
                select u.nazwa, u.id_teryt
                from ulice u 
                inner join miasta m on m.id_teryt = u.miasto_id_teryt
                where m.nazwa = $1;
            `, ['Wrocław']);
        }

        return AddressMatcher.streets;
    }
};