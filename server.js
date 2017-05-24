var express = require('express'),
  app = express(),
  port = 8000;

var bodyParser = require('body-parser');
var Scraper = require('./scrape.js'),
  getPixels = require('get-pixels'),
  quantizer = require('./quantize.js');

var server = require('http').Server(app);

//serves all static files in /public
app.use(express.static(__dirname + '/public'));

//for post
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json({
  extended: false
}));


server.listen(port, function() {
  console.log('Listening on port ' + port);
});

app.post('/', function(req, res) {
  var word = req.body.word;
  console.log(word);
  Scraper.getImages(word, function(urls) {
    //res.json({picurls: urls});
    console.log(urls.length + ' images found.');

    getPixels(urls[3], function(err, pixels) {
      if (err) {
        console.log("Bad image path")
        return;
      }
      var p = pixels.data;
      //pixels is an 'ndarray' --> pixels.data = converts to 1d array
      //[r1, g1, b1, a1, r2, g2, b2, a2, ...]
      //convert 1d array to array of arrays
      var finalpixels = [];
      for (var i = 0; i < p.length; i += 4) {
        finalpixels.push(p.slice(i, i + 4));
      }
      console.log('%s final pixels.', finalpixels.length);
      var palette = quantizer.quantize(finalpixels, 8).palette();
      console.log(palette);
    });
  });

});
