'use strict';
module.exports = {
  config: {
    name: 'vnex',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Báo vnex!.',
    location: __filename,
    timestamps: 5
  }
}
module.exports.onMessage = function({ api, event, args, global }) {
  const cheerio = require("cheerio");
  const request = require("request");
  var chovui = request.get('https://vnexpress.net/tin-tuc-24h', (error, response, html) => {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var thoigian = $('.time-count');
      var tieude = $('.thumb-art');
      var noidung = $('.description');
      var time = thoigian.find('span').attr('datetime');
      var title = tieude.find('a').attr('title');
      var des = noidung.find('a').text();
      var link = noidung.find('a').attr('href');
      var description = des.split('.');

      return api.sendMessage(`Tin tức mới nhất\r\nThời gian đăng: ${time}\r\nTiêu đề: ${title}\r\n\nNội dung: ${description[0]}\r\nLiên kết: ${link}\r\n\n`, event.threadID, event.messageID)
    }
  })
}