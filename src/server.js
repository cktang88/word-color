const getImages = require('./scrape.js');
const getPixels = require('get-pixels');
const quantizer = require('./quantize.js');

// whenever word submitted
let onSubmit = (word) => {
  processWord(word);
}

function processWord(word) {
  getImages(word).then((urls) => {
    console.log(`${urls.length} images found.`);
    const num = Math.min(20, urls.length);
    for (let i = 0; i < num; i++) {
      processImage(urls[i], i);
    }
  });
}

// this wrapper function is necessary to get 'i' in scope
function processImage(url, i) {
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
    // TODO: fix
    emit('data', {
      num: i,
      palette,
    });
  });
}