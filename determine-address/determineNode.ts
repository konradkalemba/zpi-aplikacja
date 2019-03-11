import { AddressQuery } from "./addressQuery";
import { pool } from "./pg";
import { District, Street, Address } from "./address";
import { filterWordsForStreet } from "./common";

let Lev = require('js-levenshtein')

export async function determineNode(q: AddressQuery): Promise<Address> {
    return new Address(await determineDistrict(q.district), await determineStreet(q.description))
}

async function determineStreet(description: string, city: string = 'Wrocław'): Promise<Street | null> {
    let results = new Array()
    let words = description.split(/\s+/)
    words = filterWordsForStreet(words)
    let streets = await pool.query(`

            select u.nazwa, u.id_teryt
            from ulice u 
            inner join miasta m on m.id_teryt = u.miasto_id_teryt
            where m.nazwa = $1;

        `, [city])
    var minLev = 5000000;
    var street: Street | null = null;
    for (var i = 0; i < words.length; i++) {
        for (var j = 0; j < streets.rowCount; j++) {
            let l = Lev(streets.rows[j].nazwa, words[i])
            if (l < minLev) {
                minLev = l;
                street = new Street(streets.rows[j].id_teryt, streets.rows[j].nazwa)
            }
        }
    }
    return street
}



async function determineDistrict(district: string, city: string = 'Wrocław'): Promise<District | null> {
    let res = await pool.query(`

        select d.id_teryt, d.nazwa
        from dzielnice d 
        inner join miasta m on m.id_teryt = d.miasto_id_teryt
        where m.nazwa = $1;
       
        `, [city])
    var minLev = 5000000;
    var distr: District | null = null;
    for (var j = 0; j < res.rowCount; j++) {
        let l = Lev(res.rows[j].nazwa, district)
        if (l < minLev) {
            minLev = l;
            distr = new District(res.rows[j].id_teryt, res.rows[j].nazwa)
        }
    }
    return distr

}