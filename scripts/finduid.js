'use strict';
module.exports = {
  config: {
    name: 'finduid',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Tìm kiếm Uid bằng link url.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ api, event, global, args, body }) {
  var { threadID, messageID } = event;
  var tool = require("fb-downloads");
  try {
    if (args.length == 0) return api.sendMessage("Please enter profile url !", threadID, messageID);
    var id = await tool.findUid(args[0] || event.messageReply.body);
    return api.sendMessage(id, event.threadID, event.messageID)
  }
  catch (e) {
    return api.sendMessage("Người dùng không tồn tại!", event.threadID, event.messageID)
  }
}
