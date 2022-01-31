'use strict';
module.exports = {
    config: {
        name: 'slink',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Lấy url rút gọn, download từ video, audio được gửi từ nhóm.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out
};
async function out({ event, api }) {
    let { messageReply, threadID } = event;
    if (event.type !== "message_reply") return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", event.threadID, event.messageID);
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", event.threadID, event.messageID);
    else {
        let msg = `${messageReply.attachments.length}\n\n`
        var shortLink = await require("tinyurl").shorten(messageReply.attachments[0].url);
        api.sendMessage(shortLink, threadID);
    }
}