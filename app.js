'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const score = require('./services/score');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200)
        .send('Running!')
        .end();
});

app.post('/score', (req, res) => {

    console.log(req.body);

    res.send({ score: score.getScore(req.body) });
});

// init server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

module.exports = app;
