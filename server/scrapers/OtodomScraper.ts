import { AdData } from './AdData';
import { BaseScraper } from './BaseScraper';
import { URL } from 'url';
import request from 'request';
import cheerio from 'cheerio';
import { AddressMatcher } from '../determine-address';

export class OtodomScraper extends BaseScraper {
    private _pageURL: URL = new URL('https://www.otodom.pl/wynajem/mieszkanie/wroclaw/');

    getAdsURLs(): Promise<URL[]> {
        return new Promise<URL[]>((resolve, reject) => {
            let adsURLs: URL[] = [];
            let options = {
                url: this._pageURL.href,
                headers: {
                    'User-Agent': 'ok'
                }
            };

            request(options, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $: CheerioStatic = cheerio.load(html, { decodeEntities: false });

                    $('.row .section-listing__row-content article').each((index, element) => {
                        const ad: Cheerio = $(element);
                        const adURL: URL = new URL(ad.attr('data-url'));
                        adsURLs.push(adURL);
                    });

                    if ($('.pager-next a').attr('href')) {
                        this._pageURL = new URL($('.pager-next a').attr('href'));
                    } else {
                        this._hasNextPage = false;
                    }
                    resolve(adsURLs);
                } else {
                    reject(html);
                }
            });
        });
    }

    getAdDataFromURL(url: URL): Promise<AdData> {
        return new Promise<AdData>((resolve, reject) => {
            const options = {
                url: url.href,
                headers: {
                    'User-Agent': 'ok'
                }
            };

            request(options, async (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $: CheerioStatic = cheerio.load(html, { decodeEntities: false });

                    let adData: AdData = {
                        description: $('.section-description p').text(),
                        photos: []
                    };
                    
                    const addressMatched = await AddressMatcher.match(adData.description).catch(e => null);
                    if (addressMatched) {
                        adData.address = addressMatched;
                    }

                    $('.slick-list picture img').each((index, element) => {
                        const photo: Cheerio = $(element);

                        adData.photos.push(photo.attr('src'));
                    });

                    $('.section-overview div li').each((index, element) => {
                        const card: Cheerio = $(element);
                        const value: string = card.text();

                        if (value[0] === 'Powierzchnia') {
                            adData.area = value[1];
                        }

                        if (value[0] === 'Liczba pokoi') {
                            const roomsNumber = value[1];

                            if (roomsNumber == 'kawalerka') {
                                adData.roomsNumber = 1;
                            } else {
                                adData.roomsNumber = roomsNumber.replace(/\D/g, '');
                            }
                        }

                        if (value[0] === 'Rodzaj zabudowy') {
                            adData.buildingType = value[1];
                        }

                        if (value[0] === 'Piętro') {
                            adData.floor = value[1];
                        }

                        if (value[0] === 'Liczba pięter') {
                            adData.floorsNumber = value[1];
                        }

                        if (value[0] === 'Okna') {
                            adData.windows = value[1];
                        }

                        if (value[0] === 'Stan wykończenia') {
                            adData.finishing = value[1];
                        }

                        if (value[0] === 'Materiał budynku') {
                            adData.buildingMaterial = value[1];
                        }

                        if (value[0] === 'Rok budowy') {
                            adData.buildingYear = value[1];
                        }
                    });

                    console.log(adData);
                    resolve(adData);
                } else {
                    reject('request error = ' + error);
                }
            });
        });
    }
}

/*
componentDidMount() {
    axios.get('http://localhost:3000/orders')
        .then(
            (result) => {
                console.log(result.data);
                this.setState({
                    isLoaded: true,
                    orders: result.data
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )

}*/
