import {AdData} from './AdData';
import {BaseScraper} from './BaseScraper';
import {URL} from 'url';
import request from 'request';
import cheerio from 'cheerio';
import { AddressMatcher } from '../determine-address';

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

    protected getAdDataFromURL(url: URL): Promise<AdData> {
        return new Promise<AdData>((resolve, reject) => {
            request(url.href, async (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $: CheerioStatic = cheerio.load(html, {decodeEntities: false});

                    let adData: AdData = {
                        description: $('.description__rolled').text(),
                    };

                    const addressMatched = await AddressMatcher.match(adData.description).catch(e => null);
                    if (addressMatched) {
                        adData.address = addressMatched;
                    }

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