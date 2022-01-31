'use strict';
module.exports = {
  config: {
    name: 'gif',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Nhận hình ảnh gif.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const request = require("request")
  const fs = require("fs-extra")
  var { threadID, messageID } = event;
  var key = "73YIAOY3ACT1";
  if (!args[0]) return api.sendMessage("Không thể tìm thấy thẻ bạn đã nhập!", threadID, messageID);
  return request(`https://api.tenor.com/v1/random?key=${key}&q=${args[0]}&limit=1`, (err, response, body) => {
    if (err) throw err;
    var string = JSON.parse(body);
    var stringURL = string.results[0].media[0].tinygif.url;
    request(stringURL).pipe(fs.createWriteStream(__dirname + `/cache/gif.gif`)).on("close", () => api.sendMessage({ attachment: fs.createReadStream(__dirname + "/cache/gif.gif") }, threadID, () => fs.unlinkSync(__dirname + "/cache/gif.gif"), messageID));
  });
}

