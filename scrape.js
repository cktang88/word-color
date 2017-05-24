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
    //console.log(fullurl);
    pic = extract(fullurl, default_agent);
    if (pic) {
      results.push(pic);
    }
  }
}

var extract = function(url, agent) {
  $.ajax({
    url: url,
    headers: {
      'User-Agent': agent
    },
    success: function(res) {
      console.log(res);
      return res;
    }
  });
}

/*
var extract = function(url, num) {
  var result = [];
  return new Promise(function(resolve) {
    roptions.url = url;
    request(roptions, function(err, response, body) {
      if (!err && response.statusCode === 200) {
        // extract all items, go to next page if exist
        var $ = cheerio.load(body);
        $('.item a[class="thumb"]').each(function(el) {
          var item = $(this).attr('href');

          var detail = $(this).parent().find('.fileInfo').text();
          item = {
            url: item,
            thumb: $(this).find('img').attr('src'),
            width: detail.split(' ')[0],
            height: detail.split(' ')[2],
            format: detail.split(' ')[3],
            size: detail.split(' ')[4],
            unit: detail.split(' ')[5]
          };

          self.emit('result', item);
          result.push(item);
        });

        if (num && result.length > num) {
          var out = result.slice(0, num);
          self.emit('end', out);
          return resolve(result.slice(0, num));
        }

        // search for current page and select next one
        var page = $('li a[class="sb_pagS"]').parent().next().find('a').attr('href');
        if (page) {
          resolve(extract('http://www.bing.com' + page + '&view=detailv2'));
        } else {
          self.emit('end', result);
          resolve(result);
        }

      } else {
        self.emit('end', result);
        resolve(result)
      }
    });
  });
};
*/
