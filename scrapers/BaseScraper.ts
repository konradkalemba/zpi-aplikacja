import { AdData } from './AdData';

export interface Scraper {
    process(): void;
}

export abstract class BaseScraper implements Scraper {
    protected _ads: AdData[] = [];
    protected _pageURL: URL;
    
    protected abstract getAdsURLs(): Promise<URL[]>;
    protected abstract getAdDataFromURL(url: URL): Promise<AdData>;

    protected async crawlURLs(urls: URL[]): Promise<void> {
        for (let url of urls) {
            this._ads.push(await this.getAdDataFromURL(url));
        }
    }

    process(): void {
        this
            .getAdsURLs()
            .then(adsURLs => this.crawlURLs(adsURLs))
            .then(() => {
                if (this._pageURL) {
                    this.process();
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
}