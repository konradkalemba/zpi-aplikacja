import { AddressQuery } from "./addressQuery";
import { determinePg } from "./determinePg";
import { determineNode } from "./determineNode";

let q = new AddressQuery('Wrocław, Dolnośląskie, Fabryczna ', `


2-pok. oddzielna kuchnia, ul. legnicka 49 PIXEL HOUSE/MAGNOLIA
Wrocław, Dolnośląskie, Fabryczna Dodane o 18:12, 11 marca 2019, ID ogłoszenia: 451502429
Wyróżnij to ogłoszenie Odśwież to ogłoszenie
Oferta od 	Osoby prywatnej
	
Poziom 	4
Umeblowane 	Tak
	
Rodzaj zabudowy 	Apartamentowiec
Powierzchnia 	48 m²
	
Liczba pokoi 	2 pokoje
Czynsz (dodatkowo) 	400 zł
	 
2-pokojowe mieszkanie w nowym budownictwie w pełnym rozkładzie 48m. plus 2 loggie ponad 6m.

NIERUCHOMOŚĆ
Lokal położony jest na 3-tym piętrze 9-kondygnacyjnego nowoczesnego budynku oddanego w 2018 r. Teren jest monitorowany i strzeżony 24/7.
Mieszkanie jest gotowe do zamieszkania oraz w pełni umeblowane i wyposażone w sprzęt AGD. Wszystkie sprzęty jak i meble nowe, podwyższony standard. Bez prowizji od najemcy, ogłoszenie prywatne. Do zamieszkania od 10.04.

-pokój 1
-pokój 2
-łazienka
-przedpokój
-loggia 1
-loggia 2

LOKALIZACJA PIXEL HOUSE
Jest to centralna część miasta i jedna z bardziej pożądanych lokalizacji, m.in ze względu na sprawne połączenie komunikacją miejską z pozostałymi częściami Wrocławia. W okolicy nie brakuje punktów usługowo-handlowych (Galeria Magnolia), restauracji, kawiarni, terenów zielonych (Park Popowicki), basen wejherowska, siłownia mc fit, Kaufland, Tesco, piekarnia, Biedronka, na dole budynku Żabka.

CENA
2300,- czynsz najmu
400,- czynsz administracyjny
+ prąd według zużycia
kaucja 2600 zł.

KONTAKT.
502 - pokaż numer telefonu -


`)

async function bench() {
    let pgTimes = new Array()
    let nodeTimes = new Array()

    for (var i = 0; i < 100; i++) {
        let begin = process.hrtime.bigint()
        var res = await determineNode(q)
        let end = process.hrtime.bigint()
        nodeTimes.push(end - begin)

        begin = process.hrtime.bigint()
        res = await determinePg(q)
        end = process.hrtime.bigint()
        pgTimes.push(end - begin)
    }
    console.log("PG: " + avg(pgTimes) / BigInt(1000000))
    console.log("Node: " + avg(nodeTimes) / BigInt(1000000))
}

function avg(a: bigint[]) {
    let v = BigInt(0)
    for (var i = 0; i < a.length; i++) {
        v += a[i]
    }
    return v / BigInt(a.length)
}

bench().then(() => console.log('done!'))



