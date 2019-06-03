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
            // id wrocławia - teryt
            ad.cityId = 986283;
            this._ads.push(ad)
            console.log(ad)
            if (await Ad.findOne({ source: ad.source, sourceId: ad.sourceId }) == null) {
                await ad.save()
                for (const photo of ad.photos) {
                    photo.ad = ad
                    await photo.save()
                }
            } else console.log('pomijam istniejące:  ' + JSON.stringify(ad))
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