import { URL } from 'url'
import { Ad } from './../entities'

export interface Scraper {
    process(): void
}

export abstract class BaseScraper implements Scraper {
    protected _ads: Ad[] = []
    protected _hasNextPage: boolean = true

    protected abstract getAdsURLs(): Promise<URL[]>
    protected abstract getAdFromURL(url: URL): Promise<Ad>

    protected async crawlURLs(urls: URL[]): Promise<void> {
        for (let url of urls) {
            const ad = await this.getAdFromURL(url)
            this._ads.push(ad)
            console.log(ad)

            await ad.save()
        }
    }

    process(): void {
        this
            .getAdsURLs()
            .then(adsURLs => this.crawlURLs(adsURLs))
            .then(() => {
                if (this._hasNextPage) {
                    this.process()
                }
            })
            .catch(error => {
                console.error(error)
            })
    }
}