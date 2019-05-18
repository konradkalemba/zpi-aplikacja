import { BaseScraper } from './BaseScraper'
import { URL } from 'url'
import request from 'request'
import cheerio from 'cheerio'
import { AddressMatcher } from '../determine-address'
import { Ad, Photo } from '../entities';

export class OtodomScraper extends BaseScraper {
    private _pageURL: URL = new URL('https://www.otodom.pl/wynajem/mieszkanie/wroclaw/')

    getAdsURLs(): Promise<URL[]> {
        return new Promise<URL[]>((resolve, reject) => {
            let adsURLs: URL[] = []
            let options = {
                url: this._pageURL.href,
                headers: {
                    'User-Agent': 'ok'
                }
            }

            request(options, (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $: CheerioStatic = cheerio.load(html, { decodeEntities: false })

                    $('.row .section-listing__row-content article').each((index, element) => {
                        const ad: Cheerio = $(element)
                        const adURL: URL = new URL(ad.attr('data-url'))
                        adsURLs.push(adURL)
                    })

                    if ($('.pager-next a').attr('href')) {
                        this._pageURL = new URL($('.pager-next a').attr('href'))
                    } else {
                        this._hasNextPage = false
                    }
                    resolve(adsURLs)
                } else {
                    reject(html)
                }
            })
        })
    }

    getAdFromURL(url: URL): Promise<Ad> {
        return new Promise<Ad>((resolve, reject) => {
            const options = {
                url: url.href,
                headers: {
                    'User-Agent': 'ok'
                }
            }

            request(options, async (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $: CheerioStatic = cheerio.load(html, { decodeEntities: false })

                    let ad = new Ad()
                    
                    ad.photos = []
                    ad.url = url.href
                    ad.description = $('.section-description p').text().trim()
                    
                    const addressMatched = await AddressMatcher.match(ad.description).catch(e => null)
                    if (addressMatched) {
                        ad.street = addressMatched
                    }

                    $('.slick-list picture img').each((index, element) => {
                        const imgTag: Cheerio = $(element)
                        const photo = new Photo()
                        photo.path = imgTag.attr('src')

                        ad.photos.push(photo)
                    })

                    const price = $('.css-c0ipkw-AdHeader').text();
                    //remove all non-numeric characters
                    ad.price = parseFloat(price.replace(/\D/g,''));

                    $('.section-overview div li').each((index, element) => {
                        const parameter: Cheerio = $(element);
                        const parameterName: string = parameter.text().substring(0, parameter.text().indexOf(':')+1);
                        const parameterValue: string = parameter.text().substring(parameter.text().indexOf(':')+1);

                        if (parameterName === 'Powierzchnia:') {
                            ad.area = parseFloat(parameterValue.trim())
                        }


                        if (parameterName === 'Liczba pokoi:') {
                            const roomsNumber = parameterValue.trim();

                            if (roomsNumber == 'kawalerka') {
                                ad.roomsNumber = 1
                            } else {
                                ad.roomsNumber = parseInt(roomsNumber.replace(/\D/g, ''))
                            }
                        }

                        if (parameterName === 'Rodzaj zabudowy:') {
                            ad.buildingType = parameterValue.trim()
                        }

                        if (parameterName === 'Piętro:') {
                            ad.floor = parameterValue.trim()
                        }

                        if (value[0] === 'Liczba pięter') {
                            ad.floorsNumber = parseInt(value[1])
                        }

                        if (parameterName === 'Okna:') {
                            ad.windows = parameterValue.trim()
                        }

                        // if (parameterName === 'Stan wykończenia:') {
                        //     ad.finishing = parameterValue
                        // }

                        if (parameterName === 'Materiał budynku:') {
                            ad.buildingMaterial = parameterValue.trim()
                        }

                        if (parameterName === 'Rok budowy:') {
                            ad.buildingYear = parameterValue.trim()
                        }
                    })

                    resolve(ad)
                } else {
                    reject('request error = ' + error)
                }
            })
        })
    }
}


