const request = require('request');
const cheerio = require('cheerio');
/**
 * Get the image src for all links, options.keyword is required.
 */
const getImages = function (searchword, callback) {
  // sample clean url: https://www.bing.com/images/search?q=dogs&view=detailv2&selectedindex=5
  const url = `${'https://www.bing.com/images/search?q=%&view=detailv2'.replace('%', encodeURIComponent(searchword))}&selectedindex=0`;
  // console.log(url);
  return extractPicUrls(url, callback);
};

// extract all pic urls
var extractPicUrls = function (url, callback) {
  const urls = [];
  request(url, (err, res, body) => {
    if (err) { console.log(err); } else if (res.statusCode !== 200) { console.log(res); } else {
      console.log('finding image urls...');
      const $ = cheerio.load(body);
      const images = $('img');
      for (let i = 0; i < images.length; i++) {
        const link = $(images[i]).attr('src');
        if (link.substr(0, 4) !== 'http') { continue; }
        urls.push(link);
      }
      return callback(urls);
    }
  });
};

const Scraper = module.exports;
Scraper.getImages = getImages;
