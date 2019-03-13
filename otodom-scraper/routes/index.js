const express = require('express');
const router = express.Router();

const {
  performance,
} = require('perf_hooks');
const request = require('request');
const cheerio = require('cheerio');
let powierzchnia="";
let firstPage = 'https://www.otodom.pl/wynajem/mieszkanie/wroclaw/';
let page = firstPage;



let announcements = [];
let getAnnouncementsURLs = function () {
  return new Promise(function (resolve, reject) {
    let announcementURLs = [];
    request(page, function (error, response, html) {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html, {decodeEntities: false});
        $('.row .section-listing__row-content article').each(function (i) {
          const announcements = $(this);
          announcementURLs.push(announcements.attr('data-url'));
        });
        console.log("page przed przypisaniem: " + page);
        page = $('.pager-next a').attr('href');
        console.log(announcementURLs.length);
        resolve(announcementURLs);
      } else reject("err");
    });
  });
};
let getAnnouncementInfo = function (announcementURLs, index) {
  return new Promise(function (resolve, reject) {
    request(announcementURLs[index], function (error, response, html) {
      if (!error && response.statusCode === 200) {
        const url = announcementURLs[index];
        const $ = cheerio.load(html, {decodeEntities: false});

        //SZCZEGÓŁY
        $('.section-overview div li').each(function (i) {
          const card = $(this);
          let value = $(card).text();
          value = value.split(':');

          if (value[0] === "Powierzchnia") {
            powierzchnia = value[1];
          }
        });
        let announcementInfo = {
          powierzchnia: powierzchnia,
        };
        //console.log(announcementInfo);
        resolve(announcementInfo);
      }
      else reject("request error");
    });
  });
};
let crawlOnePage = function (announcementURLs) {
  console.log("crawlOnePage");
  let promises = [];
  for (let index = 0; index < announcementURLs.length; ++index) {
    promises.push(getAnnouncementInfo(announcementURLs, index));
    getAnnouncementInfo(announcementURLs, index).then(
        function (result) {
          announcements.push(result);
        },
        function (err) {
          console.log("loguje: " + err);
        }
    )
  }
  return Promise.all(promises);
};

let process = function() {
  console.log("start");
  getAnnouncementsURLs().then(
      function (announcementURLs) {
        console.log("promise.then");
        //console.log("nextPage: " + nextPage);
        console.log(announcementURLs[0]);
        return crawlOnePage(announcementURLs);
      },)
      .then(function (announcementInfoArr) {
            //console.log(announcementInfoArr);
            console.log("page zaraz przed końcem: " + page);
            if (page !== undefined) {
              process();
            }
            else console.log(announcements);
            let t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0)/1000 + " seconds.")
          }
      );
};
let t0 = performance.now();
process();


module.exports = router;
