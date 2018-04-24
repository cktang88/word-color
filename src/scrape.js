const rp = require('request-promise');
const cheerio = require('cheerio');
const Promise = require('bluebird');
/**
 * Get the image src for all links, options.keyword is required.
 */
const getImages = (searchword) => {
  // sample clean url: https://www.bing.com/images/search?q=dogs&view=detailv2&selectedindex=5
  const baseurl = 'https://www.bing.com/images/search?q=%&view=detailv2';
  // NOTE: DO NOT use headers --> spoofing headers makes extracting pics go haywire
  const url = `${baseurl.replace('%', encodeURIComponent(searchword))}&selectedindex=0`
  return extractPicUrls(url);
};

// private helper method
// extract all pic urls from url
const extractPicUrls = url => rp(url)
  .then((body) => {
    // console.log('finding image urls...');
    const $ = cheerio.load(body);
    // array of images returned
    return $('img').toArray();
  })
  .map((elem) => {
    const link = elem.attribs.src;
    return (link.substr(0, 4) === 'http') ? link : undefined;
  })
  .filter((url) =>  url !== undefined)
  .catch((err) => {
    console.log(err);
  });

// TODO: simplify
module.exports = getImages;
