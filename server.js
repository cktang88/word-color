const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

// for promises
// const Promises = require('bluebird');

const bodyParser = require('body-parser');
const getImages = require('./scrape.js');
const getPixels = require('get-pixels');
const quantizer = require('./quantize.js');

const server = require('http').Server(app);
// const io = require('socket.io').listen(server);

// serves all static files in /public
// app.use(express.static(`${__dirname}/public`));

// for post
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json({
  extended: false,
}));


server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// io.set('transports', ['polling']);
// io.set("polling duration", 10);

/*
io.on('connection', (socket) => {
  console.log('new connection.');
  // emit an event to the socket
  // socket.emit('request', data);
  // emit an event to all connected sockets
  // io.emit('broadcast', data);
  // listen to the event
  socket.on('newword', (word) => {
    console.log(word);
    processWord(word, socket);
  });
  socket.on('disconnect', (e) => {
    console.log('user disconnected.');
  });
});
*/

server.on('/', 'POST', (req)=>{
  console.log(word)
  processWord(word, socket);
})

function processWord(word, socket) {
  getImages(word).then((urls) => {
    console.log(`${urls.length} images found.`);
    const num = Math.min(20, urls.length);
    for (let i = 0; i < num; i++) {
      processImage(urls[i], socket, i);
    }
  });
}

// this wrapper function is necessary to get 'i' in scope
function processImage(url, socket, i) {
  getPixels(url, (err, pixels) => {
    if (err) {
      console.log('Bad image path');
      return;
    }
    const p = pixels.data;
    // pixels is an 'ndarray' --> pixels.data = converts to 1d array
    // [r1, g1, b1, a1, r2, g2, b2, a2, ...]
    // convert 1d array to array of arrays
    const finalpixels = [];
    for (let k = 0; k < p.length; k += 4) {
      finalpixels.push(p.slice(k, k + 4));
    }
    // console.log('%s final pixels.', finalpixels.length);
    const palette = quantizer.quantize(finalpixels, 8).palette();
    // console.log(palette);
    // add to palettes
    socket.emit('data', {
      num: i,
      palette,
    });
  });
}