import { AdData } from './AdData';
import { BaseScraper } from './BaseScraper';
import { URL } from 'url';
import request from 'request';
import cheerio from 'cheerio';

export class OlxScraper extends BaseScraper {
    private _pageURL: URL = new URL('https://www.olx.pl/nieruchomosci/mieszkania/wynajem/wroclaw/');

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
					
					$('.content #offers_table tbody .wrap .title-cell .lheight22 .link').each((index, element) => {
						const ad: Cheerio = $(element);
						const adURL: URL = new URL(ad.attr('href'));
						const pageName: string = adURL.href.split('.')[1];

						if (pageName !== 'otodom') {
							adsURLs.push(adURL);
						}
					});
					
					if ($('.next a').attr('href')) {
						this._pageURL = new URL($('.next a').attr('href'));
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

			request(options, (error, response, html) => {
				if (!error && response.statusCode === 200) {		
					const $: CheerioStatic = cheerio.load(html, { decodeEntities: false });
					
					let adData: AdData = {
						description: $('#textContent').text(),
						photos: []
					};
						
					$('.offerdescription .img-item img').each((index, element) => {
						const photo: Cheerio = $(element);

						adData.photos.push(photo.attr('src'));
					});

					$('.descriptioncontent table tbody tr td tr').each((index, element) => {
						const card: Cheerio = $(element);
						const value: string = card.children('th').text();

						if (value === 'Powierzchnia') {
							adData.area = card.children('.value').text().trim();
						}

						if (value === 'Liczba pokoi') {
							const roomsNumber = card.children('.value').text().trim();

							if (roomsNumber == 'kawalerka') {
								adData.roomsNumber = 1;
							} else {
								adData.roomsNumber = roomsNumber.replace(/\D/g, '');
							}
						}

						if (value === 'Rodzaj zabudowy') {
							adData.buildingType = card.children('.value').text().trim();
						}

						if (value === 'Piętro') {
							adData.floor = card.children('.value').text().toLowerCase().trim();
						}

						if (value === 'Liczba pięter') {
							adData.floorsNumber = card.children('.value').text().toLowerCase().trim();
						}

						if (value === 'Okna') {
							adData.windows = card.children('.value').text().toLowerCase().trim();
						}

						if (value === 'Stan wykończenia') {
							adData.finishing = card.children('.value').text().trim();
						}

						if (value === 'Materiał budynku') {
							adData.buildingMaterial = card.children('.value').text().trim();
						}

						if (value === 'Rok budowy') {
							adData.buildingYear = card.children('.value').text().toLowerCase().trim();
						}
					});
					
					console.log(adData)
					resolve(adData);
				} else {
					reject('request error = ' + error);
				}
			});
		});
    }
}