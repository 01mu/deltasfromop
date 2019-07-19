/*
 * deltasfromop.herokuapp.com
 * github.com/01mu
 */

function showResultID(https, url, res, params, page) {
    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var response = JSON.parse(data)[0].Response;

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

function showResult(https, url, res, params, page) {
    https.get(url, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            res.render(page, {response: JSON.parse(data), params: params});
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

module.exports.showResult = showResult;
module.exports.showResultID = showResultID;
