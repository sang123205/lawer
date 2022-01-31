'use strict';
module.exports = {
  config: {
    name: 'random',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Số ngẫu nhiên theo giới hạn tối thiểu tối đa.',
    location: __filename,
    timestamps: 5
  }
}

module.exports.onMessage = async ({ api, event, args }) => {
  const random = require("random");
  if (!args.join("") != " ") return api.sendMessage(`Vui lòng nhập tham số./n/nEx: random 0 100`, event.threadID, event.messageID);
  else
    var x = args[0];
  var y = args[args.length - 1];
  var rd = Math.floor(Math.random() * Number(y)) + Number(x)
  return api.sendMessage(String(rd), event.threadID, event.messageID)
}