require('dotenv').config();

import {OlxScraper} from './scrapers/OlxScraper';
import {GratkaScraper} from "./scrapers/GratkaScraper";
import {OtodomScraper} from "./scrapers/OtodomScraper";

const otodomScraper: OtodomScraper = new OtodomScraper();
otodomScraper.process();
const olxScraper: OlxScraper = new OlxScraper();
olxScraper.process();
const gratkaScraper: GratkaScraper = new GratkaScraper();
gratkaScraper.process();