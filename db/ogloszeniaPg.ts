import * as Pg from '../server/determine-address/pg'
import { AdData } from '../server/scrapers/AdData';

export class OgloszeniaPg {
    async exists(id: number, src: 'olx' | 'otodom') {
        let q = src == 'olx' ?
            `
            select true as exists
            from ogloszenia
            where olx_id = $1
        ` :
            `
            select true as exists
            from ogloszenia
            where otodom_id = $1
        `
        let rows = await Pg.pool.query(q, [id])
        return rows[0].exists == true
    }

    async insert(o: AdData, ulicaId: number, dzielnicaId: number) {
        let row = await Pg.pool.query(`
        
            insert into ogloszenia(
                otodom_id,
                olx_id,
                opis,
                powierzchnia,
                dodatkowe_oplaty,
                liczba_pokoi,
                rodzaj_zabudowy,
                pietro,
                poziom_opis,
                liczba_pieter,
                okna,
                material_budynku,
                rok_budowy,
                autor
                nr_telefonu,
                umeblowanie,
                czynsz,
                ulica_id,
                miasto_id,
                dzielnica_id
            ) values (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
                $13,$14,$15,$16,$17,$18,$19,$20
            ) returning id;
        `, [
            null,
            null,
            o.description,
            o.area,
            o.additionalFees,
            o.roomsNumber,
            o.buildingType,
            o.floor,
            null,
            o.floorsNumber,
            o.windows,
            o.buildingMaterial,
            o.buildingYear,
            o.ownerName,
            o.phoneNumber,
            o.finishing,
            o.price,
            ulicaId,
            dzielnicaId
        ])
    }
}