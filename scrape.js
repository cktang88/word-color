var request = require('request');
const cheerio = require('cheerio');
/**
 * Get the image src for all links, options.keyword is required.
 */
var getBingImages = function(searchword) {
  var urls = [];
  //sample clean url: https://www.bing.com/images/search?q=dogs&view=detailv2&selectedindex=5
  var url = 'https://www.bing.com/images/search?q=%&view=detailv2'.replace('%', encodeURIComponent(searchword)) + '&selectedindex=0';
  console.log(url);
  urls = extractPicUrls(url);
  return results;
}

//extract all pic urls
var extractPicUrls = function(url) {
  var urls = [];
  request(url, function(err, res, body) {
    if (err)
      console.log(err);
    else {
      if (res.statusCode !== 200)
        console.log(res);
      else {

        console.log('okay: body');
        const $ = cheerio.load(body);
        var images = $('img');
        for (var i = 0; i < images.length; i++) {
          var link = $(images[i]).attr('src');
          if (link.substr(0, 4) !== 'http')
            continue;
          urls.push(link);
        }
        console.log(urls);
      }
    }
  });
}

var Scraper = module.exports;
Scraper.getBingImages = getBingImages;
