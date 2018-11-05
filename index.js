const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const app = express();

const baseURL = 'https://smallfolio.bitnamiapp.com/deltasfromop/';

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

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

    console.log('sort ' + sort + ' order ' + order + ' limit ' + limit);

    var end = 'get_posts.php?limit=' + limit +
        '&order=' + order + '&start=0&sort=' + sort;

    var url = baseURL + end;
    var params = {limit: limit, order: order, start: 0, sort: sort};
    showResult(url, res, params);
});

function showResult(url, res, params) {
    https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        res.render('pages/index', {response: JSON.parse(data), params: params});
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}
