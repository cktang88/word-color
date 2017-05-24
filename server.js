var express = require('express'),
  app = express(),
  port = 8000;

var bodyParser = require('body-parser');
var Scraper = require('./scrape.js');

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
  var picArray = getImages(word);
});

//get google images
var getImages = function(searchword) {
  return Scraper.getBingImages(searchword);
}
