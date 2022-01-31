'use strict';
module.exports = {
  config: {
    name: 'kick',
    ver: '1.0.0',
    role: 1,
    author: ['Lawer Team'],
    description: 'Kick người dùng ra khỏi nhóm bằng cách tag/reply.',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  if (args.join().indexOf('@') !== -1) {
    var mention = Object.keys(event.mentions);
    for (let o in mention) {
      setTimeout(() => {
        return api.removeUserFromGroup(mention[o], event.threadID, async function(err) {
          if (err) return api.sendMessage("» Bot cần quyền quản trị viên để kick", event.threadID, event.messageID);
          return
        })
      }, 1000)
    }
  } else {
    if (event.type == "message_reply") {
      return api.removeUserFromGroup(event.messageReply.senderID, event.threadID, async function(err) {
        if (err) return api.sendMessage("» Bot cần quyền quản trị viên để kick", event.threadID, event.messageID);
        return
      })
    } else {
      if (!args[0]) return api.sendMessage(`» Vui lòng tag hoặc reply người cần kick`, event.threadID, event.messageID)
    }
  }
}
