var express = require('express'),
  app = express(),
  port = process.env.PORT || 8000;

//for promises
var Promises = require('bluebird');

var bodyParser = require('body-parser');
var Scraper = require('./scrape.js'),
  getPixels = require('get-pixels'),
  quantizer = require('./quantize.js');

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

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

io.set("transports", ["polling"]);
//io.set("polling duration", 10);


io.on('connection', function(socket) {
  console.log('new connection.');
  // emit an event to the socket
  //socket.emit('request', data);
  // emit an event to all connected sockets
  //io.emit('broadcast', data);
  // listen to the event
  socket.on('newword', function(word) {
    console.log(word);
    processWord(word, socket);
  });
  socket.on('disconnect', function(e) {
    console.log('user disconnected.');
  })
});

function processWord(word, socket) {
  Scraper.getImages(word, function(urls) {
    console.log(urls.length + ' images found.');
    var num = Math.min(20, urls.length);
    for (var i = 0; i < num; i++) {
      processImage(urls[i], socket, i);
    }
  });
}

//this wrapper function is necessary to get 'i' in scope
function processImage(url, socket, i) {
  getPixels(url, function pixelscb(err, pixels) {
    if (err) {
      console.log("Bad image path")
      return;
    }
    var p = pixels.data;
    //pixels is an 'ndarray' --> pixels.data = converts to 1d array
    //[r1, g1, b1, a1, r2, g2, b2, a2, ...]
    //convert 1d array to array of arrays
    var finalpixels = [];
    for (var k = 0; k < p.length; k += 4) {
      finalpixels.push(p.slice(k, k + 4));
    }
    //console.log('%s final pixels.', finalpixels.length);
    var palette = quantizer.quantize(finalpixels, 8).palette();
    //console.log(palette);
    //add to palettes
    socket.emit('data', {
      num: i,
      palette: palette
    });
  });
}
