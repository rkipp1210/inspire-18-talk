const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));

const predict = (data, done) => {
  const body = data;
  const url = 'http://localhost/ross/models/ShotPredictor/predict';
  const options = {
    url: url,
    method: 'post',
    body: body,
    json: true,
    auth: {
      user: 'USER',
      pass: 'API_KEY'
    }
  };
  request(options, (err, res, body) => {
    done(err, body);
  });
}

app.post('/predict', (req, res) => {
  predict(req.body, (err, response) => {
  res.json({
    status: "OK",
    prediction: response.result.shot_prob,
  });
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(process.env.PORT || 8787, () => console.log('Running on port 8787!'));
