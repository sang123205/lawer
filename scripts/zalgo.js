'use strict';
module.exports = {
  config: {
    name: 'zalgo',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Converts your text to Zalgo.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ api, event, global, args }) {
  var zalgo = require('to-zalgo')
  return api.sendMessage(zalgo(args.join(" ")), event.threadID, event.messageID);
}
