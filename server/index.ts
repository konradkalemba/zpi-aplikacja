import { OlxScraper } from './scrapers/OlxScraper';
import {GratkaScraper} from "./scrapers/GratkaScraper";

const olxScraper: OlxScraper = new OlxScraper();
olxScraper.process();

const gratkaScraper: GratkaScraper = new GratkaScraper();
gratkaScraper.process();