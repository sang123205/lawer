'use strict';
module.exports = {
  config: {
    name: 'adduser',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Thêm thành viên bằng url hoặc uid.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};

async function out({ event, api, global, Config, message, Threads, Users, args, body, is }) {
  let uid;
  const botID = api.getCurrentUserID();
  const fbtools = require("fb-downloads");
  if (isNaN(args[0])) {
    try {
      uid = await fbtools.findUid(args[0]);
    }
    catch (err) {
      return message.reply(`Đã xảy ra lỗi khi lấy id người dùng`);
    }
  }
  else uid = args[0];

  const threadInfo = await api.getThreadInfo(event.threadID);

  if (threadInfo.participantIDs.includes(uid)) return message.reply("Người này đã có trong nhóm của bạn");

  api.addUserToGroup(uid, event.threadID, (err) => {
    if (err) return message.reply(`Không thể thêm người dùng vào cuộc trò chuyện. Vui lòng thử lại sau.`);
    else if (threadInfo.approvalMode && !threadInfo.adminIDs.includes(botID)) return message.reply("Đã thêm người này vào danh sách phê duyệt");
    else return message.reply("Thêm thành viên mới thành công! ");
  });
}
