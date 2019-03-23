const express = require('express');
const router = express.Router();
const {performance} = require('perf_hooks');
const request = require('request');
const cheerio = require('cheerio');

//flat details
let opis = "";
let powierzchnia = "";
let firstPage = 'https://www.otodom.pl/wynajem/mieszkanie/wroclaw/';
let page = firstPage;
let liczbaPokoi = "";
let rodzajZabudowy = "";
let pietro = "";
let liczbaPieter = "";
let okna = "";
let stanWykonczenia = "";
let materialBudynku = "";
let rokBudowy = "";
let zdjecia = [];


let announcements = [];
function getAnnouncementsURLs() {
    return new Promise(function (resolve, reject) {
        let announcementURLs = [];
        request(page, function (error, response, html) {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html, {decodeEntities: false});
                //Wycinamy pierwsze trzy bo są to polecane, później się powtarzają
                $('.row .section-listing__row-content article').slice(3).each(function (i) {
                    const announcements = $(this);
                    announcementURLs.push(announcements.attr('data-url'));
                });
                page = $('.pager-next a').attr('href');
                console.log("page2: " + page);
                console.log("number of announcements on this page: " + announcementURLs.length);
                console.log(announcementURLs);
                resolve(announcementURLs);
            }  else reject(html);
        });
    });
}

function getAnnouncementInfo (announcementURLs, index) {
    return new Promise(function (resolve, reject) {
        request(announcementURLs[index], function (error, response, html) {
            if (!error && response.statusCode === 200) {
                const url = announcementURLs[index];
                const $ = cheerio.load(html, {decodeEntities: false});

                //OPIS
                opis = $('.section-description p').text();

                //ZDJĘCIA
                $('.slick-list picture img').each(function (i) {
                    let picture = $(this);
                    picture = picture.attr("src");
                    zdjecia.push(picture);
                });
                //SZCZEGÓŁY
                $('.section-overview div li').each(function (i) {
                    const card = $(this);
                    let value = $(card).text();
                    value = value.split(':');

                    if (value[0] === "Powierzchnia") {
                        powierzchnia = value[1];
                    }
                    if (value[0] === "Liczba pokoi") {
                        liczbaPokoi = value[1];
                    }
                    if (value[0] === "Rodzaj zabudowy") {
                        rodzajZabudowy = value[1];
                    }
                    if (value[0] === "Piętro") {
                        pietro = value[1];
                    }
                    if (value[0] === "Liczba pięter") {
                        liczbaPieter = value[1];
                    }
                    if (value[0] === "Okna") {
                        okna = value[1];
                    }
                    if (value[0] === "Stan wykończenia") {
                        stanWykonczenia = value[1];
                    }
                    if (value[0] === "Materiał budynku") {
                        materialBudynku = value[1];
                    }
                    if (value[0] === "Rok budyowy") {
                        rokBudowy = value[1];
                    }
                });
                let announcementInfo = {
                    powierzchnia: powierzchnia,
                    liczbaPokoi: liczbaPokoi,
                    rodzajZabudowy: rodzajZabudowy,
                    pietro: pietro,
                    liczbaPieter: liczbaPieter,
                    materialBudynku: materialBudynku,
                    okna: okna,
                    stanWykonczenia: stanWykonczenia,
                    materialBudynku: materialBudynku,
                    rokBudowy: rokBudowy,
                    opis: opis,
                    zdjecia: zdjecia
                };
                console.log("getAnnouncementInfo: " + announcementURLs[index]);
                console.log("URL index: " + index);
                resolve(announcementInfo);
            } else reject("request error = "+error);
        });
    });
}

async function crawlOnePage (announcementURLs) {
    //console.log("crawlOnePage");
    for (let index = 0; index < announcementURLs.length; ++index) {
        console.log("for loop index: ", index);
        //await getAnnouncementInfo(announcementURLs, index);
        let result = await getAnnouncementInfo(announcementURLs, index);
        announcements.push(result);
    }
}

function process() {
    console.log("start");
    getAnnouncementsURLs().then(
        function (announcementURLs) {
            //console.log("promise.then");
            //console.log("nextPage: " + nextPage);
            console.log(announcementURLs[0]);
            return crawlOnePage(announcementURLs);
        },
        function(){

        })
        .then(
            function () {
                //console.log(announcementInfoArr);
                console.log("page zaraz przed końcem: " + page);
                if (page !== undefined) {
                    process();
                } else console.log(announcements);
                let t1 = performance.now();
                console.log("Time: " + (t1 - t0) / 1000 + " seconds.")
            },
            function(){

            });
}
let t0 = performance.now();
process();


module.exports = router;
