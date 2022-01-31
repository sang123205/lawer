'use strict';
module.exports = {
  config: {
    name: 'ms',
    ver: '1.0.0',
    role: 3,
    author: ['Lawer Team'],
    description: 'Kiểm tra ping',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};
async function out({ event, api, args }) {
  const moment = require("moment-timezone");
  var time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
  const timeStart = Date.now();
  return api.sendMessage('OK !', event.threadID, (err, info) => {
    setTimeout(() => {
      api.sendMessage(`Ping: ${(Date.now() - timeStart)}ms \n(TimeStart: ${time})`, event.threadID, event.messageID);
    }, 200);
  }, event.messageID);
}