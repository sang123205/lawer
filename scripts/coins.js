'use strict';
module.exports = {
  config: {
    name: 'coins',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Xem số tiền của bản thân.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  var userData, money, mention;
  if (event.type == "message_reply") {
    userData = await Users.getData(event.messageReply.senderID);
    return api.sendMessage('Số tiền hiện tại của ' + userData.name + ' là ' + userData.money + '$', event.threadID, event.messageID);
  }
  else if (Object.keys(event.mentions).length != 0) {
    mention = Object.keys(event.mentions);
    userData = await Users.getData(mention);
    return api.sendMessage('Số tiền hiện tại của ' + userData.name + 'là ' + userData.money + '$', event.threadID, event.messageID);
  }
  else {
    userData = await Users.getData(event.senderID);
    return api.sendMessage('Số tiền hiện tại của bạn là ' + userData.money + '$', event.threadID, event.messageID);
  }
}
