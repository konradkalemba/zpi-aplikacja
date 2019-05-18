import {BaseScraper} from './BaseScraper'
import {URL} from 'url'
import request from 'request'
import cheerio from 'cheerio'
import { AddressMatcher } from '../determine-address'
import { Ad, Photo } from './../entities'
import { AdSource } from '../entities/Ad'

export class GratkaScraper extends BaseScraper {
    private _pageURL: URL = new URL('https://gratka.pl/nieruchomosci/mieszkania/wroclaw/wynajem')

    getAdsURLs(): Promise<URL[]> {
        return new Promise<URL[]>((resolve, reject) => {
            let adsURLs: URL[] = []

            request(this._pageURL.href, (error, response, html) => {
                if (!error && response.statusCode === 200) {

                    const $: CheerioStatic = cheerio.load(html, {decodeEntities: false})

                    $('#leftColumn article').each(function (index, element) {
                        const ad: Cheerio = $(element)
                        const adURL: URL = new URL(ad.attr('data-href'))
                        const pageName: string = $('.pagination__nextPage').attr('href')

                        adsURLs.push(adURL)
                    })
                    if ($('.pagination__nextPage').attr('href')) {
                        this._pageURL = new URL($('.pagination__nextPage').attr('href'))
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
    protected getOwnerName($: CheerioStatic): string {
        var scripts = $('script').get()
        let name: string = ''
        scripts.forEach(function (element, index) {
            if (element.children[0] !== undefined) {
                var reg = /context: \'contactForm\'/
                if (element.children[0].data.match(reg) !== null) {
                    let scriptString = element.children[0].data
                    let nameRegex = /"person": ".+"/
                    let found = scriptString.match(nameRegex)
                    if (found) {
                        name = found[0].slice(11, found[0].length - 1)
                    }
                }
            }
        })
        return name
    }

    protected getAdFromURL(url: URL): Promise<Ad> {
        return new Promise<Ad>((resolve, reject) => {
            request(url.href, async (error, response, html) => {
                if (!error && response.statusCode === 200) {
                    const $: CheerioStatic = cheerio.load(html, { normalizeWhitespace: false, xmlMode: false, decodeEntities: true })
                    let ad = new Ad()

                    ad.source = AdSource.Gratka
                    ad.photos = []
                    ad.url = url.href
                    ad.description = $('.description__rolled').text().trim()
                    ad.price = parseFloat($('.priceInfo__value').text().trim().replace(/\s/g, ''))
                    ad.ownerName = this.getOwnerName($)

                    $("meta[property='og:image']").each((index, element) => {
                        const photoMetaTag: Cheerio = $(element)
                        const photo = new Photo()
                        photo.path = photoMetaTag.attr("content")

                        ad.photos.push(photo)
                    })

                    const addressMatched = await AddressMatcher.match(ad.description).catch(e => null)
                    if (addressMatched) {
                        ad.street = addressMatched
                    }

                    $('.parameters__rolled li').each(function (index, element) {
                        const parameter: Cheerio = $(element)
                        const parameterName: string = parameter.children('span').text()
                        const parameterValue: string = parameter.children('b').text().trim()

                        if (parameterName === "Opłaty (czynsz administracyjny, media)") {
                            ad.additionalFees = parseFloat(parameterValue)
                        }
                        if (parameterName === "Powierzchnia w m2") {
                            ad.area = parseFloat(parameterValue)
                        }
                        if (parameterName === "Liczba pokoi") {
                            ad.roomsNumber = parseInt(parameterValue)
                        }
                        if (parameterName === "Piętro") {
                            ad.floor = parameterValue
                        }
                        if (parameterName === "Rok budowy") {
                            ad.buildingYear = parameterValue
                        }
                        if (parameterName === "Liczba pięter w budynku") {
                            ad.floorsNumber = parseInt(parameterValue)
                        }
                        if (parameterName === "Rodzaj zabudowy") {
                            ad.buildingType = parameterValue
                        }
                        if (parameterName === "Okna") {
                            ad.windows = parameterValue
                        }
                        if (parameterName === "Stan wykończenia") {
                            ad.finishing = parameterValue
                        }
                        if (parameterName === "Materiał budynku") {
                            ad.buildingMaterial = parameterValue
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