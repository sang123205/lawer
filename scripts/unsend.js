'use strict';
module.exports = {
    config: {
        name: 'unsend',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Gỡ tin nhắn của bot.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    if (event.messageReply.messageID == undefined) return;
    if (event.type != "message_reply") return api.sendMessage(`❌ Vui lòng reply tin nhắn cần gỡ`, event.threadID, event.messageID);
    if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(`Không thể gỡ tin nhắn của người khác`, event.threadID, event.messageID);
    return api.unsendMessage(event.messageReply.messageID);
}