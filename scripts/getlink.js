'use strict';
module.exports = {
  config: {
    name: 'getlink',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Lấy url download từ video, audio được gửi từ nhóm.',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  if (event.type !== "message_reply") return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", event.threadID, event.messageID);
	if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", event.threadID, event.messageID);
	if (event.messageReply.attachments.length > 1) return api.sendMessage(`Vui lòng reply chỉ một audio, video, ảnh!`, event.threadID, event.messageID);
	return api.sendMessage(event.messageReply.attachments[0].url, event.threadID, event.messageID);
}
