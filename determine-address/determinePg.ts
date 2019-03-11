import { AddressQuery } from "./addressQuery";
import { pool } from "./pg";
import { District, Street, Address } from "./address";
import { filterWordsForStreet, minSimilarity } from "./common";

export async function determinePg(q: AddressQuery): Promise<Address> {
    return new Address(await determineDistrict(q.district), await determineStreet(q.description))
}

async function determineStreet(description: string, city: string = 'Wrocław'): Promise<Street | null> {
    let results = new Array()
    let words = description.split(/\s+/)
    words = filterWordsForStreet(words)
    for (var i = 0; i < words.length; i++) {
        let r = await pool.query(`

            select u.id_teryt, u.nazwa, similarity(u.nazwa, $1) as sim
            from ulice u 
            inner join miasta m on m.id_teryt = u.miasto_id_teryt
            where m.nazwa = $2
            order by similarity(u.nazwa, $1) desc
            limit 1;

        `, [words[i], city])
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
    if (sorted.length > 0)
        return new Street(sorted[0].idTeryt, sorted[0].nazwa)
    else return null
}



async function determineDistrict(district: string, city: string = 'Wrocław'): Promise<District | null> {
    let res = await pool.query(`

        select d.id_teryt, d.nazwa, similarity(d.nazwa, $1) as sim
        from dzielnice d 
        inner join miasta m on m.id_teryt = d.miasto_id_teryt
        where m.nazwa = $2
        order by similarity(d.nazwa, $1) desc
        limit 1;`, [district, city])

    if (res.rows[0].similarity < minSimilarity)
        return null
    else {
        return new District(res.rows[0].id_teryt, res.rows[0].nazwa)
    }
}