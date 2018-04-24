import needle from 'needle';
// const cheerio = require('cheerio');
// import Promise from 'bluebird';
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
const extractPicUrls = url => needle.get(url)
  .then((err, {body}) => {
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

export default getImages;
