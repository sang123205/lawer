'use strict';
module.exports = {
  config: {
    name: 'sendmsg',
    ver: '1.0.0',
    role: 0,
    author: ['MạnhG'],
    description: 'Gửi tin nhắn đến Thread/user bằng ID.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  var idbox = args[0], reason = args.slice(1);
  if (args.length == 0 || reason == "") api.sendMessage(`Syntax error, Use: ${Config.prefix}sendmsg ID_BOX [lời nhắn]`, event.threadID, event.messageID);
  else
    api.sendMessage("» Thông tin từ Admin «\n\n" + reason.join(" "), idbox, () =>
      api.sendMessage(`${api.getCurrentUserID()}`, () =>
        api.sendMessage("Đã gửi lời nhắn: " + reason.join(" "), event.threadID)));
}