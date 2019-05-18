import { BaseScraper } from './BaseScraper'
import { URL } from 'url'
import request from 'request'
import cheerio from 'cheerio'
import { AddressMatcher } from './../determine-address'
import { Ad, Photo } from '../entities'
import { AdSource } from '../entities/Ad'

export class OlxScraper extends BaseScraper {
    private _pageURL: URL = new URL('https://www.olx.pl/nieruchomosci/mieszkania/wynajem/wroclaw/')

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
                    
                    $('.content #offers_table tbody .wrap .title-cell .lheight22 .link').each((index, element) => {
                        const ad: Cheerio = $(element)
                        const adURL: URL = new URL(ad.attr('href'))
                        const pageName: string = adURL.href.split('.')[1]

                        if (pageName !== 'otodom') {
                            adsURLs.push(adURL)
                        }
                    })
                    
                    if ($('.next a').attr('href')) {
                        this._pageURL = new URL($('.next a').attr('href'))
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
                    ad.description = $('#textContent').text().trim()
                    ad.source = AdSource.Olx

                    const addressMatched = await AddressMatcher.match(ad.description).catch(e => null)
                    if (addressMatched) {
                        ad.street = addressMatched
                    }

                    $('.offerdescription .img-item img').each((index, element) => {
                        const imgTag: Cheerio = $(element)
                        const photo = new Photo()
                        photo.path = imgTag.attr('src')

                        ad.photos.push(photo)
                    })

                    $('.descriptioncontent table tbody tr td tr').each((index, element) => {
                        const card: Cheerio = $(element)
                        const value: string = card.children('th').text()

                        if (value === 'Powierzchnia') {
                            ad.area = parseFloat(card.children('.value').text().trim())
                        }

                        if (value === 'Liczba pokoi') {
                            const roomsNumber = card.children('.value').text().trim()

                            if (roomsNumber == 'kawalerka' || roomsNumber == 'Kawalerka') {
                                ad.roomsNumber = 1
                            } else {
                                ad.roomsNumber = parseInt(roomsNumber.replace(/\D/g, ''))
                            }
                        }

                        if (value === 'Rodzaj zabudowy') {
                            ad.buildingType = card.children('.value').text().trim()
                        }

                        if (value === 'Poziom') {
                            ad.floor = card.children('.value').text().toLowerCase().trim()
                        }

                        if (value === 'Liczba pięter') {
                            ad.floorsNumber = parseInt(card.children('.value').text().toLowerCase().trim())
                        }

                        if (value === 'Okna') {
                            ad.windows = card.children('.value').text().toLowerCase().trim()
                        }

                        if (value === 'Stan wykończenia') {
                            ad.finishing = card.children('.value').text().trim()
                        }

                        if (value === 'Materiał budynku') {
                            ad.buildingMaterial = card.children('.value').text().trim()
                        }

                        if (value === 'Rok budowy') {
                            ad.buildingYear = card.children('.value').text().toLowerCase().trim()
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