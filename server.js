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
      //pixels is an 'ndarray' --> pixels.data = converts to 1d array
      console.log("got pixels", pixels.data);
      console.log(pixels.data[0]);
      var palette = quantizer.quantize(pixels.data, 8).palette();
      console.log(palette);
    });
  });

});
