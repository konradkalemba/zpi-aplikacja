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

                    const price = $('.css-7ryazv-AdHeader-className').text()
                    //console.log("Price = "+price.trim())
                    ad.price = parseFloat(price)

                    $('.section-overview div li').each((index, element) => {
                        const card: Cheerio = $(element)
                        const value: string = card.text()

                        if (value[0] === 'Powierzchnia') {
                            ad.area = parseFloat(value[1])
                        }


                        if (value[0] === 'Liczba pokoi') {
                            const roomsNumber = value[1]

                            if (roomsNumber == 'kawalerka') {
                                ad.roomsNumber = 1
                            } else {
                                ad.roomsNumber = parseInt(roomsNumber.replace(/\D/g, ''))
                            }
                        }

                        if (value[0] === 'Rodzaj zabudowy') {
                            ad.buildingType = value[1]
                        }

                        if (value[0] === 'Piętro') {
                            ad.floor = value[1]
                        }

                        if (value[0] === 'Liczba pięter') {
                            ad.floorsNumber = parseInt(value[1])
                        }

                        if (value[0] === 'Okna') {
                            ad.windows = value[1]
                        }

                        if (value[0] === 'Stan wykończenia') {
                            ad.finishing = value[1]
                        }

                        if (value[0] === 'Materiał budynku') {
                            ad.buildingMaterial = value[1]
                        }

                        if (value[0] === 'Rok budowy') {
                            ad.buildingYear = value[1]
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


