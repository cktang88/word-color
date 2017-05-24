var request = require('request');
/**
 * Get the image src for all links, options.keyword is required.
 */
var getBingImages = function(options) {
  //var self = this;
  var results = [];

  if (!options || !options.keyword) {
    return undefined;
  }
  var default_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
  //'&view=detailv2' enlarges pic
  var roptions = {
    'url': 'https://www.bing.com/images/search?q=%&view=detailv2'.replace('%', encodeURIComponent(options.keyword)),
    'User-Agent': default_agent
  };

  //sample clean url: https://www.bing.com/images/search?q=dogs&view=detailv2&selectedindex=5

  //return extract(roptions.url, num);
  var fullurl, pic;
  for (var i = 0; i < options.num; i++) {
    fullurl = roptions.url + '&selectedindex=' + i.toString();
    console.log(fullurl);
    pic = extract(fullurl, default_agent);
    if (pic) {
      results.push(pic);
    }
  }
  return results;
}

var extract = function(url, agent) {
  request(url, function(err, res, body) {
    if (err)
      console.log(err);
    else {
      if (res.statusCode !== 200)
        console.log(res);
      else
        console.log(body);
    }
  });
}

var Scraper = module.exports;
Scraper.extract = extract;
Scraper.getBingImages = getBingImages;
