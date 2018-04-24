import $ from './domhelpers'
import processWord from './processor'

// global variable to keep track of all colors
const numPalettes = 20;
let colors = Array(numPalettes);
window.word = '';
// setup canvas
const canvas = $('#canvas');
canvas.width = numPalettes * 40;
canvas.height = 7 * 40;
const ctx = canvas.getContext('2d');
// mini canvas
const ctx2 = $('#canvas2').getContext('2d');

// draws border given canvas context
const drawBorder = function (context) {
  context.strokeStyle = '#000000';
  context.lineWidth = 3;
  context.rect(0, 0, context.canvas.width, context.canvas.height);
  context.stroke();
};
// drawBorder(ctx2);
// drawBorder(ctx);

// submit word on enter key, prevent multiple submits on one key event
$('#wordinput').onkeyup = (e) => {
  // if enter key pressed
  if (e.which === 10 || e.which === 13) {
    submitWord();
  }
};

// submit button
const submitWord = function () {
  const temp = $('#wordinput').value.trim();
  console.log('Submitted: ' + temp);
  // ensure same word is not submitted multiple times
  if (temp === window.word) { return; }

  window.word = temp;
  processWord(window.word);
  // on complete: draw(data.num, data.palette);
  // socket.emit('newword', window.word);
};

// NOTE: websockets do not guarantee that info arrives in same order it was sent
// nor does server send info in series in order
/*
socket.on('data', (data) => {
  // console.log(data);
  draw(data.num, data.palette);
});
*/

canvas.addEventListener('mousemove', (evt) => {
  const mousePos = getMousePos(canvas, evt);
  const x = mousePos.x;
  const y = mousePos.y;
  const column = colors[Math.floor(x / 40)];
  if (!column) { return; }
  const rgb = column[Math.floor(y / 40)];
  // var message = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  // the 1<<24 takes care of zero-padding as necessary
  // from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb, by Mark Kahn (comment to casablanca's answer)
  const hexColor = `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).substr(1)}`;
  $('#colorinfo').text(hexColor);
  // update color
  ctx2.fillStyle = hexColor;
  ctx2.fillRect(0, 0, 100, 100);
  ctx2.fill();
  // drawBorder(ctx2);
}, false);

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function draw(n, newestPalette) {
  // clear colors for each new word
  if (colors.length > numPalettes) { colors = []; }

  colors[n] = newestPalette;
  let arr,
    c;
  for (let i = 0; i < colors.length; i++) {
    arr = colors[i];
    if (!arr) { continue; }
    sortColors(arr);
    // get the colors from each palette
    for (let j = 0; j < arr.length; j++) {
      // console.log(arr[j]);

      // console.log(arr);
      c = arr[j];
      ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      ctx.fillRect(i * 40, j * 40, 40, 40);
      ctx.fill();
    }
  }
  // drawBorder(ctx);
}

// TODO: replace with color-sort npm package
// https://www.npmjs.com/package/color-sort
function sortColors(pixelArr) {
  // sort roughly by darkness
  pixelArr.sort((a, b) => {
    let dr = a[0] - b[0],
      dg = a[1] - b[1],
      db = a[2] - b[2];
    // var lumdist = Math.abs(luminosity(a) - luminosity(b));
    /*
    if (Math.abs(greenness(a) - greenness(b)) > 128)
      return -greenness(a) + greenness(b);
    if (Math.abs(redness(a) - redness(b)) > 128)
      return -redness(a) + redness(b);
    if (Math.abs(blueness(a) - blueness(b)) > 128)
      return -blueness(a) + blueness(b);
    */
    // default
    return -luminosity(a) + luminosity(b);
    // if (lumdist > .5)
    // return -(dr + dg + db);
    // else
    // return sortkeyOf(a)[0] - sortkeyOf(b)[0];
  });
}

const greenness = ([r, g, b]) => g - r - b;
const redness = ([r, g, b]) => r - g - b;
const blueness = ([r, g, b]) => b - g - r;

// get luminosity from RGB, 0 to 1
function luminosity([r, g, b]) {
  return Math.sqrt(0.241 * r + 0.691 * g + 0.068 * b);
}

// inspired by http://www.alanzucconi.com/2015/09/30/colour-sorting/
// attempts to calculate a sorting key that allows smooth color separations
function sortkeyOf([r, g, b]) {
  const repetitions = 8;

  let lum = luminosity([r, g, b]);

  const hsv = rgb2hsv(r, g, b);
  let h = hsv[0],
    s = hsv[1],
    v = hsv[2];

  const h2 = Math.floor(h * repetitions);
  const lum2 = Math.floor(lum * repetitions);
  let v2 = Math.floor(v * repetitions);

  if (h2 % 2 === 1) { v2 = repetitions - v2; }
  lum = repetitions - lum;

  return [h2, lum, v2];
}

// convert color from RGB to HSV values, used in color sorting
function rgb2hsv(r, g, b) {
  let computedH = 0;
  let computedS = 0;
  let computedV = 0;

  // remove spaces from input RGB values, convert to int
  var r = parseInt((`${r}`).replace(/\s/g, ''), 10);
  var g = parseInt((`${g}`).replace(/\s/g, ''), 10);
  var b = parseInt((`${b}`).replace(/\s/g, ''), 10);

  if (r == null || g == null || b == null ||
    isNaN(r) || isNaN(g) || isNaN(b)) {
    alert('Please enter numeric RGB values!');
    return;
  }
  if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
    alert('RGB values must be in the range 0 to 255.');
    return;
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const minRGB = Math.min(r, Math.min(g, b));
  const maxRGB = Math.max(r, Math.max(g, b));

  // Black-gray-white
  if (minRGB == maxRGB) {
    computedV = minRGB;
    return [0, 0, computedV];
  }

  // Colors other than black-gray-white:
  const d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
  const h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
  computedH = 60 * (h - d / (maxRGB - minRGB));
  computedS = (maxRGB - minRGB) / maxRGB;
  computedV = maxRGB;
  return [computedH, computedS, computedV];
}

// progress bar
function moveProgressBar() {
  const getPercent = ($('.progress-wrap').attr('progress-percent') / 100);
  console.log(getPercent);
  const getProgressWrapWidth = $('.progress-wrap').width();
  const progressTotal = getPercent * getProgressWrapWidth;
  const animationLength = 1500;

  // on page load, animate percentage bar to data percentage length
  // .stop() used to prevent animation queueing
  console.log($('.progress-bar'));
  $('.progress-bar').animate({
    left: progressTotal,
  }, animationLength);
}
