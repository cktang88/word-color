this.word = '';
this.picArray = [];



//submit button
var submitWord = function() {
  this.word = $('#wordinput').val();
  //moveProgressBar();
  $.post('/', {
    word: this.word
  }, function(res) {
    console.log(res.numImages);
  });
  //wait for server a bit
  setInterval(refreshColors, 2000);
  //getImages(this.word);
}

function refreshColors() {
  var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');
  $.getJSON('/palettes', function(res) {
    //console.log(res.data);
    if (!res.data || res.data === [])
      return;

    //dynamically resize canvas
    canvas.width = res.data.length * 40;
    canvas.height = res.data[0].length * 40;

    //get the palettes
    var arr, c;
    for (var i = 0; i < res.data.length; i++) {
      arr = res.data[i];
      if (!arr)
        continue;
      //get the colors from each palette
      for (var j = 0; j < arr.length; j++) {
        //console.log(arr[j]);
        //sort roughly by darkness
        arr.sort(function(a, b) {
          var dr = a[0] - b[0],
            dg = a[1] - b[1],
            db = a[2] - b[2];
          //var lumdist = Math.abs(luminosity(a) - luminosity(b));
          /*
                    if (Math.abs(greenness(a) - greenness(b)) > 128)
                      return -greenness(a) + greenness(b);
                    if (Math.abs(redness(a) - redness(b)) > 128)
                      return -redness(a) + redness(b);
                    if (Math.abs(blueness(a) - blueness(b)) > 128)
                      return -blueness(a) + blueness(b);
          */
          //default
          return -luminosity(a) + luminosity(b);
          //if (lumdist > .5)
          //return -(dr + dg + db);
          //else
          //return sortkeyOf(a)[0] - sortkeyOf(b)[0];
        });
        c = arr[j];
        ctx.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
        //console.log(ctx.fillStyle);
        ctx.fillRect(i * 40, j * 40, 40, 40);
        ctx.fill();
      }
    }

  });
}

function greenness(pixel) {
  var r = pixel[0];
  var g = pixel[1];
  var b = pixel[2];

  return g - r - b;
}

function redness(pixel) {
  var r = pixel[0];
  var g = pixel[1];
  var b = pixel[2];

  return r - g - b;
}

function blueness(pixel) {
  var r = pixel[0];
  var g = pixel[1];
  var b = pixel[2];

  return b - g - r;
}

//get luminosity from RGB, 0 to 1
function luminosity(pixel) {
  return Math.sqrt(.241 * pixel[0] + .691 * pixel[1] + .068 * pixel[2]);
}

//inspired by http://www.alanzucconi.com/2015/09/30/colour-sorting/
function sortkeyOf(pixel) {
  var repetitions = 8;
  var r = pixel[0];
  var g = pixel[1];
  var b = pixel[2];

  var lum = luminosity(pixel);

  var hsv = rgb2hsv(r, g, b);
  var h = hsv[0],
    s = hsv[1],
    v = hsv[2];

  var h2 = Math.floor(h * repetitions);
  var lum2 = Math.floor(lum * repetitions);
  var v2 = Math.floor(v * repetitions);

  if (h2 % 2 === 1)
    v2 = repetitions - v2;
  lum = repetitions - lum;

  return [h2, lum, v2];
}

function rgb2hsv(r, g, b) {
  var computedH = 0;
  var computedS = 0;
  var computedV = 0;

  //remove spaces from input RGB values, convert to int
  var r = parseInt(('' + r).replace(/\s/g, ''), 10);
  var g = parseInt(('' + g).replace(/\s/g, ''), 10);
  var b = parseInt(('' + b).replace(/\s/g, ''), 10);

  if (r == null || g == null || b == null ||
    isNaN(r) || isNaN(g) || isNaN(b)) {
    alert('Please enter numeric RGB values!');
    return;
  }
  if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
    alert('RGB values must be in the range 0 to 255.');
    return;
  }
  r = r / 255;
  g = g / 255;
  b = b / 255;
  var minRGB = Math.min(r, Math.min(g, b));
  var maxRGB = Math.max(r, Math.max(g, b));

  // Black-gray-white
  if (minRGB == maxRGB) {
    computedV = minRGB;
    return [0, 0, computedV];
  }

  // Colors other than black-gray-white:
  var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
  var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
  computedH = 60 * (h - d / (maxRGB - minRGB));
  computedS = (maxRGB - minRGB) / maxRGB;
  computedV = maxRGB;
  return [computedH, computedS, computedV];
}

// progress bar
function moveProgressBar() {
  var getPercent = ($('.progress-wrap').attr('progress-percent') / 100);
  console.log(getPercent);
  var getProgressWrapWidth = $('.progress-wrap').width();
  var progressTotal = getPercent * getProgressWrapWidth;
  var animationLength = 1500;

  // on page load, animate percentage bar to data percentage length
  // .stop() used to prevent animation queueing
  console.log($('.progress-bar'));
  $('.progress-bar').animate({
    left: progressTotal
  }, animationLength);
}
