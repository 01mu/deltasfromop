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

app.get('/view/:id?', function (req, res, next) {
    var id = req.params.id;
    var end = 'single.php?id=' + id;
    var url = baseURL + end;

    if(id == null) {
        res.render('pages/not_found');
    } else {
        showResultID(url, res, {}, 'pages/single');
    }
});

app.get('/search', function (req, res, next) {
    var query = req.query.query;
    var end = 'search_posts.php?query=' + query + '&limit=50&start=0';
    var url = baseURL + end;

    if(query == null) {
        res.render('pages/not_found');
    } else {
        showResult(url, res, {}, 'pages/index');
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
    showResult(url, res, params, 'pages/index');
});

app.get('*', function(req, res) {
    res.render('pages/not_found');
});

function showResultID(url, res, params, page) {
    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var response = JSON.parse(data)[0].Response;
            console.log(JSON.parse(data));
            if(response !== 'Error') {
                res.render(page, {response: JSON.parse(data), params: params});
            } else {
                res.render('pages/not_found');
            }
        });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
    });
}

function showResult(url, res, params, page) {
    https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
          //console.log(JSON.parse(data));
        res.render(page, {response: JSON.parse(data), params: params});
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
}
