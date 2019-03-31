const express = require('express');
const router = express.Router();
const {performance} = require('perf_hooks');
const request = require('request');
const cheerio = require('cheerio');

let firstPage = 'https://gratka.pl/nieruchomosci/mieszkania/wroclaw/wynajem';
let page = firstPage;
//flat details
let opis = "";
let oplaty = "";
let powierzchnia = "";
let liczbaPokoi = "";
let pietro = "";
let rokBudowy = "";
let rodzajZabudowy = "";
let liczbaPieter = "";
let okna = "";
let stanWykonczenia = "";
let materialBudynku = "";
let zdjecia = [];
let lokalizacja = "";


let announcements = [];
function getAnnouncementsURLs() {
    return new Promise(function (resolve, reject) {
        let announcementURLs = [];
        request(page, function (error, response, html) {
            if (!error && response.statusCode === 200) {
                const $ = cheerio.load(html, {decodeEntities: false});
                //Wycinamy pierwsze trzy bo są to polecane, później się powtarzają
                $('#leftColumn article').each(function () {
                    const announcement = $(this);
                    announcementURLs.push(announcement.attr('data-href'));
                });
                page = $('.pagination__nextPage').attr('href');
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
                opis = $('.description__rolled').text();
                // console.log(opis);

                //ZDJĘCIA
                $('.gallery__rotator li').each(function () {
                    let li = $(this);
                    console.log(li);
                    // picture = picture.attr("src");
                    // console.log(picture);
                    // zdjecia.push(picture);
                });
                //SZCZEGÓŁY
                $('.parameters__rolled li').each(function () {
                    const parameter = $(this);
                    const parameterName = parameter.children('span').text();
                    const parameterValue = parameter.children('b').text().trim();
                    // console.log("parameterName: ", parameterName);
                    // console.log("parameterValue: ", parameterValue);

                    if (parameterName === "Opłaty (czynsz administracyjny, media)") {
                        oplaty = parameterValue;
                    }
                    if (parameterName === "Powierzchnia w m2") {
                        powierzchnia = parameterValue;
                    }
                    if (parameterName === "Liczba pokoi") {
                        liczbaPokoi = parameterValue;
                    }
                    if (parameterName === "Piętro") {
                        pietro = parameterValue;
                    }
                    if (parameterName === "Rok budowy") {
                        rokBudowy = parameterValue;
                    }
                    if (parameterName === "Liczba pięter w budynku") {
                        liczbaPieter = parameterValue;
                    }
                    if (parameterName === "Rodzaj zabudowy") {
                        rodzajZabudowy = parameterValue;
                    }
                    if (parameterName === "Okna") {
                        okna = parameterValue;
                    }
                    if (parameterName === "Stan wykończenia") {
                        stanWykonczenia = parameterValue;
                    }
                    if (parameterName === "Materiał budynku") {
                        materialBudynku = parameterValue;
                    }
                });
                //LOKALIZACJA
                lokalizacja = $('.offerMap__address').children().first().text();
                console.log(lokalizacja);

                let announcementInfo = {
                    powierzchnia: powierzchnia,
                    liczbaPokoi: liczbaPokoi,
                    rodzajZabudowy: rodzajZabudowy,
                    pietro: pietro,
                    liczbaPieter: liczbaPieter,
                    materialBudynku: materialBudynku,
                    okna: okna,
                    stanWykonczenia: stanWykonczenia,
                    rokBudowy: rokBudowy,
                    opis: opis,
                    zdjecia: zdjecia
                };
                console.log("getAnnouncementInfo: " + announcementURLs[index]);
                console.log("URL index: " + index);
                console.log(announcementInfo);
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
