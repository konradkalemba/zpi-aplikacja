import { config as loadDotEnvVariables } from 'dotenv'

// Load enviroment variables from `.env` file
loadDotEnvVariables()

import { connect as databaseConnect } from './database'
import { OlxScraper } from './scrapers/OlxScraper'
import { GratkaScraper } from "./scrapers/GratkaScraper"
import { OtodomScraper } from "./scrapers/OtodomScraper"

databaseConnect().then(() => {
    const otodomScraper: OtodomScraper = new OtodomScraper()
    //otodomScraper.process()
    const olxScraper: OlxScraper = new OlxScraper()
    olxScraper.process()
    const gratkaScraper: GratkaScraper = new GratkaScraper()
    //gratkaScraper.process()
}).catch(error => console.error(error))