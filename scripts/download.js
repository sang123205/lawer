'use strict';
module.exports = {
  config: {
    name: 'download',
    ver: '1.0.0',
    role: 3,
    author: ['Lawer Team'],
    description: 'download <link> || download <path> <link>.',
    location: __filename,
    timestamps: 5
  }
};
module.exports.onMessage = async function({ api, event, Threads, args }) {
  const axios = require('axios');
  const rq = require('request');
  const fs = require("fs-extra");
  if (args.length == 0) return api.sendMessage(`Bạn có thể dùng:\ndownload <link>\n hoặc\ndownload <path> <link>`, event.threadID, event.messageID);
  if (!args[1]) {
    var path = __dirname + '';
    var link = args.slice(0).join("");
  }
  else {
    var path = __dirname + '/' + args[0];
    var link = args.slice(1).join("");
  };
  var format = rq.get(link);
  var namefile = format.uri.pathname;
  var path = path + '/' + (namefile.slice(namefile.lastIndexOf("/") + 1));
  let getimg = (await axios.get(link, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(path, Buffer.from(getimg, "utf-8"));
  return api.sendMessage("Đã lưu file vào thư mục " + path, event.threadID, event.messageID);
}