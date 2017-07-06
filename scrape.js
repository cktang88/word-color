const rp = require('request-promise');
const cheerio = require('cheerio');
const Promise = require('bluebird')
/**
 * Get the image src for all links, options.keyword is required.
 */
const getImages = (searchword) => {
  // sample clean url: https://www.bing.com/images/search?q=dogs&view=detailv2&selectedindex=5
  const baseurl = 'https://www.bing.com/images/search?q=%&view=detailv2';
  const url = `${baseurl.replace('%', encodeURIComponent(searchword))}&selectedindex=0`;

  const options = {
    uri: url,
    headers: {
      // spoof user-agent
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
    }
  };

  // console.log(url);
  return extractPicUrls(options);
};

// extract all pic urls
const extractPicUrls = options => rp(options)
  .then(body => {
    console.log('finding image urls...');
    const $ = cheerio.load(body);
    // array of images returned
    console.log($('img'))
    return $('img');
  })
  .map((img) => {
    const link = $(img).attr('src');
    return (link.substr(0, 4) === 'http') ? link : undefined;
  })
  .filter(url => url !== undefined)
  .catch(err => {
    console.log(err);
  });

// TODO: simplify
const Scraper = module.exports;
Scraper.getImages = getImages;