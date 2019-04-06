require('dotenv').config();

import parseCsv from 'csv-parse/lib/sync';
import fs from 'fs';
import { Address } from './Address';
import { AddressMatcher } from './AddressMatcher';

// Ładowanie pliku z danymi i przetwarzanie go do tablicy obiektów
const fileContents: Buffer = fs.readFileSync('./determine-address/dataset.csv');
const testItems = parseCsv(fileContents.toString(), {
    'columns': true,
    'skip_empty_lines': true
});

(async () => {
    let correct: number = 0;
    let totalTime: number = 0;
    
    for (const { description, streetName } of testItems) {
        const start = process.hrtime();
        let result: Address = await AddressMatcher.match(description);
        totalTime += process.hrtime(start)[1];

        if (result) {
            if (result.name == streetName) {
                correct++;
            } else {
                console.log(`\tBłąd: ${result.name} != ${streetName}`);
            }
        }
    }

    console.log(`Poprawność: ${(correct/testItems.length)*100}%\nŚredni czas: ${totalTime/testItems.length/1000000}ms\n\n`)
})();