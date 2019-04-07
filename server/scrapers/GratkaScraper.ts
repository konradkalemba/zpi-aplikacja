import {AdData} from './AdData';
import {BaseScraper} from './BaseScraper';
import {URL} from 'url';
import request from 'request';
import cheerio from 'cheerio';

export class GratkaScraper extends BaseScraper {
    private _pageURL: URL = new URL('https://gratka.pl/nieruchomosci/mieszkania/wroclaw/wynajem');

    getAdsURLs(): Promise<URL[]> {
        return new Promise<URL[]>((resolve, reject) => {
            let adsURLs: URL[] = [];

            request(this._pageURL.href, (error, response, html) => {
                if (!error && response.statusCode === 200) {

                    const $: CheerioStatic = cheerio.load(html, {decodeEntities: false});

                    $('#leftColumn article').each(function (index, element) {
                        const ad: Cheerio = $(element);
                        const adURL: URL = new URL(ad.attr('data-href'));
                        const pageName: string = $('.pagination__nextPage').attr('href');

                        adsURLs.push(adURL);
                    });
                    if ($('.pagination__nextPage').attr('href')) {
                        this._pageURL = new URL($('.pagination__nextPage').attr('href'));
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
    protected getOwnerName($: CheerioStatic): string {
        var scripts = $('script').get();
        let name: string = '';
        scripts.forEach(function (element, index) {
            if (element.children[0] !== undefined) {
                var reg = /context: \'contactForm\'/;
                if (element.children[0].data.match(reg) !== null) {
                    let scriptString = element.children[0].data;
                    let nameRegex = /"person": ".+"/;
                    let found = scriptString.match(nameRegex)[0];
                    name = found.slice(11, found.length - 1);
                }
            }
        });
        return name;
    }

    protected getAdDataFromURL(url: URL): Promise<AdData> {
        return new Promise<AdData>((resolve, reject) => {
            request(url.href, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $: CheerioStatic = cheerio.load(html, { normalizeWhitespace: false, xmlMode: false, decodeEntities: true });
                    let adData: AdData = {
                        url: url.href,
                        description: $('.description__rolled').text(),
                        price: $('.priceInfo__value').text().trim().replace(/\s/g, ""),
                        ownerName: this.getOwnerName($),
                    };

                    $('.parameters__rolled li').each(function (index, element) {
                        const parameter: Cheerio = $(element);
                        const parameterName: string = parameter.children('span').text();
                        const parameterValue: string = parameter.children('b').text().trim();

                        if (parameterName === "Opłaty (czynsz administracyjny, media)") {
                            adData.additionalFees = parameterValue;
                        }
                        if (parameterName === "Powierzchnia w m2") {
                            adData.area = parameterValue;
                        }
                        if (parameterName === "Liczba pokoi") {
                            adData.roomsNumber = parameterValue;
                        }
                        if (parameterName === "Piętro") {
                            adData.floor = parameterValue;
                        }
                        if (parameterName === "Rok budowy") {
                            adData.buildingYear = parameterValue;
                        }
                        if (parameterName === "Liczba pięter w budynku") {
                            adData.floorsNumber = parameterValue;
                        }
                        if (parameterName === "Rodzaj zabudowy") {
                            adData.buildingType = parameterValue;
                        }
                        if (parameterName === "Okna") {
                            adData.windows = parameterValue;
                        }
                        if (parameterName === "Stan wykończenia") {
                            adData.finishing = parameterValue;
                        }
                        if (parameterName === "Materiał budynku") {
                            adData.buildingMaterial = parameterValue;
                        }
                    });
                    console.log(adData);
                    resolve(adData);
                } else {
                    reject('request error = ' + error);
                }
            })
        })
    }
}