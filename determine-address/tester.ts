require('dotenv').config()

import parseCsv from 'csv-parse/lib/sync'
import fs from 'fs'
import NodeAddressMatcher from './NodeAddressMatcher'
import PostgresAddressMatcher from './PostgresAddressMatcher'
import { AddressQuery } from './addressQuery'
import { AddressMatcher } from './addressMatcher';

// Ładowanie pliku z danymi i przetwarzanie go do tablicy obiektów
const fileContents = fs.readFileSync('./dataset.csv')
const testItems = parseCsv(fileContents.toString(), {
  'columns': true,
  'skip_empty_lines': true
})

const nodeAddressMatcher = new NodeAddressMatcher()
const postgresAddressMatcher = new PostgresAddressMatcher()

const addressMatchers: AddressMatcher[] = [
  nodeAddressMatcher,
  postgresAddressMatcher
];

(async () => {
  for (const addressMatcher of addressMatchers) {
    let correct = 0
    let totalTime = 0
    
    console.log(addressMatcher.constructor.name)

    for (const { description, streetName } of testItems) {
      const start = process.hrtime()
      let result = await addressMatcher.match(new AddressQuery('null', description))
      totalTime += process.hrtime(start)[1]

      if (result.street) {
        if (result.street['nazwa'] == streetName) {
          correct++
        } else {
          console.log(`\tBłąd: ${result.street['nazwa']} != ${streetName}`)
        }
      }
    }

    console.log(`Poprawność: ${(correct/testItems.length)*100}%\nŚredni czas: ${totalTime/testItems.length/1000000}ms\n\n`)
  }
})()