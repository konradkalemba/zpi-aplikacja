const express = require('express');
const router = express.Router();
const {performance} = require('perf_hooks');
const request = require('request');
const cheerio = require('cheerio');

//flat details
let opis = "";
let powierzchnia = "";
let firstPage = 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/wroclaw/';
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
let otodomCouter = 0;


let announcements = [];
function getAnnouncementsURLs() {
  return new Promise(function (resolve, reject) {
    let announcementURLs = [];
    let options = {
      url: page,
      headers: {
        'User-Agent': 'ok'
      }
    };
    request(options, function (error, response, html) {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html, {decodeEntities: false});
        $('.content #offers_table tbody .wrap .title-cell .lheight22 .link').each(function (i) {
          const announcements = $(this);
          announcementURLs.push(announcements.attr('href'));
        });
        console.log("page: " + page);
        page = $('.next a').attr('href');
        console.log("page 2 : " + page);
        console.log("number of announcements on this page: " + announcementURLs.length);
        console.log(announcementURLs);
        resolve(announcementURLs);
      }  else reject(html);
    });
  });
}

function scrapOlx(html){
  const $ = cheerio.load(html, {decodeEntities: false});

  //OPIS
  opis = $('#textContent').text();

  //ZDJĘCIA
  $('.offerdescription .img-item img').each(function (i) {
    let picture = $(this);
    picture = picture.attr("src");
    zdjecia.push(picture);
  });
  //SZCZEGÓŁY
  $('.descriptioncontent table tbody tr td tr').each(function (i) {
    const card = $(this);
    let value = $(card).children("th").text();
    //console.log("Value = "+value);
    if (value === "Powierzchnia") {
      powierzchnia = $(card).children(".value").text();
      powierzchnia = powierzchnia.trim();
      console.log("Powierzchnia = "+ powierzchnia);
    }
    if (value === "Liczba pokoi") {
      liczbaPokoi= $(card).children(".value").text();
      liczbaPokoi = liczbaPokoi.trim();
      if(liczbaPokoi == "kawalerka"){
        liczbaPokoi = 1;
      }else {
        liczbaPokoi = liczbaPokoi.replace(/\D/g,'');
      }
    }
    if (value === "Rodzaj zabudowy") {
      rodzajZabudowy = $(card).children(".value").text();
      rodzajZabudowy = rodzajZabudowy.trim();
    }
    if (value === "Piętro") {
      pietro = $(card).children(".value").text();
      pietro = pietro.toLowerCase().trim();
    }
    if (value === "Liczba pięter") {
      liczbaPieter = $(card).children(".value").text();
      liczbaPieter = liczbaPieter.toLowerCase().trim();
    }
    if (value === "Okna") {
      okna = $(card).children(".value").text();
      okna = okna.toLowerCase().trim();
    }
    if (value === "Stan wykończenia") {
      stanWykonczenia = $(card).children(".value").text();
      stanWykonczenia = stanWykonczenia.trim();
    }
    if (value === "Materiał budynku") {
      materialBudynku = $(card).children(".value").text();
      materialBudynku = materialBudynku.trim();
    }
    if (value === "Rok budyowy") {
      rokBudowy = $(card).children(".value").text();
      rokBudowy = rokBudowy.toLowerCase().trim();
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
  return announcementInfo;
}

function scrapOtodom(html){
  const $ = cheerio.load(html, {decodeEntities: false});
  otodomCouter += 1;
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
      console.log("Liczba pokoi: " + powierzchnia);

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
  return announcementInfo;
}

function getAnnouncementInfo (announcementURLs, index) {
  return new Promise(function (resolve, reject) {
    const options = {
      url: announcementURLs[index],
      headers: {
        'User-Agent': 'ok'
      }
    };
    request(options, function (error, response, html) {
      if (!error && response.statusCode === 200) {
        const url = announcementURLs[index];
        let nameOfPage = url.split('.')[1];
        if(nameOfPage == "otodom"){
          //console.log("Name of Page: "+nameOfPage);
          let announcementInfo = scrapOtodom(html);
          console.log("getAnnouncementInfo: " + announcementURLs[index]);
          console.log("URL index: " + index);
          resolve(announcementInfo);
        }
        else{
          //console.log("Name of Page: "+nameOfPage);
          let announcementInfo = scrapOlx(html);
          console.log("getAnnouncementInfo: " + announcementURLs[index]);
          console.log("URL index: " + index);

          resolve(announcementInfo);
        }
      } else reject("request error = "+error);
    });
  });
}

async function crawlOnePage (announcementURLs) {
  //console.log("crawlOnePage");
  for (let index = 0; index < announcementURLs.length; ++index) {
    //console.log("for loop index: ", index);
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
            console.log("ogłoszenia z otodom: "+ otodomCouter)
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
