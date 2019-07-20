/*
 * deltasfromop.herokuapp.com
 * github.com/01mu
 */

const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');

const request = require('request');
const axios = require('axios');


const PORT = process.env.PORT || 5000;

const app = express();

const resInclude = require('./res');

const baseURL = 'https://smallfolio.bitnamiapp.com/deltasfromop/';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


app.get('/view/:id?', function (req, res, next) {
    var id = req.params.id;
    var end = 'single.php?id=' + id;
    var url = baseURL + end;

    if(id == null) {
        res.render('pages/not_found');
    } else {
        resInclude.showResultID(https, url, res, {}, 'pages/single');
    }
});

app.get('/', function (req, res, next) {
    var sort = req.query.sort;
    var order = req.query.order;
    var limit = req.query.limit;

    if(sort == null) {
        sort = 'desc';
    }

    if (order == null) {
        order = 'date';
    }

    if (limit == null) {
        limit = '50';
    }

    var end = 'get_posts.php?limit=' + limit +
        '&order=' + order + '&start=0&sort=' + sort;

    var url = baseURL + end;
    var params = {limit: limit, order: order, start: 0, sort: sort};

    request(url, { json: true, secureProtocol: 'TLSv1_method'}, (err, res2, body) => {
        if (err) { return console.log(err); }

        res.render('pages/index', {response: body, params: params});
    });

    /*axios.get(url)
      .then(response => {
        res.render('pages/index', {response: response.data, params: params});
      })
      .catch(error => {
        console.log(error);
      });*/

   // resInclude.showResult(https, url, res, params, 'pages/index', request);
});

app.get('/search', function (req, res, next) {
    var query = req.query.query;
    var end = 'search_posts.php?query=' + query + '&limit=50&start=0';
    var url = baseURL + end;

    if(query == null) {
        res.render('pages/not_found');
    } else {
        resInclude.showResult(https, url, res, {}, 'pages/index');
    }
});

app.get('*', function(req, res) {
    res.render('pages/not_found');
});

