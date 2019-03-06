var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const request = require('request-promise');
const cheerio = require('cheerio');
const striptags = require('striptags');
const tabletojson = require('tabletojson');
const HtmlTableToJson = require('html-table-to-json');
let fs = require('fs');
//dane mieszkań
let opis="";
let powierzchnia="";
let liczbaPokoi="";
let rodzajZabudowy="";
let pietro="";
let liczbaPieter="";
let okna="";
let stanWykonczenia="";
let materialBudynku="";
let rokBudowy="";
let zdjecia=[];
let firstPage = 'https://www.otodom.pl/wynajem/mieszkanie/wroclaw/?search%5BCSRFToken%5D=11c8a9993c24aeb8496dad9476ce5220f65bbd4aede9fe2ad6b0c64f00b57d00&search%5Bdist%5D=0&search%5Bsubregion_id%5D=381&search%5Bcity_id%5D=39&CSRFToken=11c8a9993c24aeb8496dad9476ce5220f65bbd4aede9fe2ad6b0c64f00b57d00&page=93';
let page = firstPage;

var myPromise = new Promise(function(resolve, reject){
  request(page, function (error, response, html) {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html, {decodeEntities: false});
      let announcementURLs = [];
      $('.row .section-listing__row-content article').each(function (i) {
        const announcements = $(this);
        announcementURLs.push(announcements.attr('data-url'));
      });

      let announcementData = [];

      for (let index = 0; index < announcementURLs.length; ++index) {

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
                console.log(powierzchnia);
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
          }
        });
        announcementData.push({
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
        });
      }
      page = $('.pager-next a').attr("href");
      console.log(page);
      resolve(page);
    }
  });
});

myPromise.then(
    result => console.log(result),
    error => console.error(error)
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
