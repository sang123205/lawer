'use strict';
module.exports = {
  config: {
    name: 'setbox',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Chỉnh sửa các cài đặt trong nhóm.',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const fs = require("fs-extra");
  const axios = require("axios");

  /////////////////////////////////////////////////////

  if (args[0] == "name") {
    const nameJoin = args.join(" ").slice(args[0].length)
    api.setTitle(nameJoin, event.threadID, async function(err) {
      if (err) return api.sendMessage("» Đã xảy ra lỗi!!", event.threadID, event.messageID);
      return api.sendMessage(`» Đã đổi tên nhóm thành ${nameJoin}`, event.threadID, event.messageID);
    });
  }
  else if (args[0] == "emoji" || args[0] == "emj" || args[0] == "icon") {
    const iconBox = args[1];
    api.changeThreadEmoji(iconBox, event.threadID, async function(err) {
      if (err) return api.sendMessage("» Đã xảy ra lỗi!!", event.threadID, event.messageID);
      return api.sendMessage(`» Đã đổi emoji box thành ${iconBox}`, event.threadID, event.messageID);
    });
  }
  else if (args[0] == "avatar" || args[0] == "avt" || args[0] == "img") {

    const urlImage = event.messageReply.attachments[0].url || args.join(" ").slice(args[0].length)
    if (!urlImage) return api.sendMessage("» Vui lòng reply hoặc dán link 1 ảnh", event.threadID, event.messageID);
    let Avatar = (await axios.get(`${urlImage}`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/avatar${event.threadID}.png`, Buffer.from(Avatar, "utf-8"));
    api.changeGroupImage(fs.createReadStream(__dirname + `/avatar${event.threadID}.png`), event.threadID, async function(err) {
      if (err) return api.sendMessage("» Đã xảy ra lỗi!!", event.threadID, event.messageID);
      fs.unlinkSync(__dirname + `/avatar${event.threadID}.png`);
      return api.sendMessage("» Thay đổi ảnh nhóm thành công", event.threadID, event.messageID);
    });
  }
  else if (args[0] == "ad" || args[0] == 'admin') {
    if (!args[1]) return api.sendMessage(`» Vui lòng thêm các tag: [add/remove] [reply/tag] để thay đổi vai trò của người đó`, event.threadID, event.messageID);
    if (args[1] == 'add') {
      if (event.type == "message_reply") {
        var uid = event.messageReply.senderID
        var name = await Users.getName(uid)
        api.changeAdminStatus(event.threadID, uid, true, editAdminsCallback)
        function editAdminsCallback(err) {
          if (err) return api.sendMessage("» Bot không đủ quyền hạn để thêm quản trị viên", event.threadID, event.messageID);
          return api.sendMessage(`» Đã thêm ${name} làm quản trị viên nhóm`, event.threadID, event.messageID);
        }
      }
      if (args.join().indexOf('@') !== -1) {
        var mentions = Object.keys(event.mentions)
        var name = await Users.getName(mentions)
        api.changeAdminStatus(event.threadID, mentions, true, editAdminsCallback)
        function editAdminsCallback(err) {
          if (err) return api.sendMessage("» Bot không đủ quyền hạn để thêm quản trị viên", event.threadID, event.messageID);
          return api.sendMessage(`» Đã thêm ${name} làm quản trị viên nhóm`, event.threadID, event.messageID);
        }
      } else return
    } else if (args[1] == 'rm' || args[1] == 'remove' || args[1] == 'del') {
      if (event.type == "message_reply") {
        var uid = event.messageReply.senderID
        var name = await Users.getName(uid)
        api.changeAdminStatus(event.threadID, uid, false, editAdminsCallback)
        function editAdminsCallback(err) {
          if (err) return api.sendMessage("» Bot không đủ quyền hạn để gỡ quản trị viên hoặc người dùng chưa là quản trị viên", event.threadID, event.messageID);
          return api.sendMessage(`» Đã gỡ vai trò quản trị viên của ${name} `, event.threadID, event.messageID);
        }
      }
      if (args.join().indexOf('@') !== -1) {
        var mentions = Object.keys(event.mentions)
        var name = await Users.getName(mentions)
        api.changeAdminStatus(event.threadID, mentions, false, editAdminsCallback)
        function editAdminsCallback(err) {
          if (err) return api.sendMessage("» Bot không đủ quyền hạn để gỡ quản trị viên hoặc người dùng chưa là quản trị viên", event.threadID, event.messageID);
          return api.sendMessage(`» Đã gỡ vai trò quản trị viên của ${name} `, event.threadID, event.messageID);
        }
      }
      else return
    }
  }
  else return api.sendMessage(`
» Cài đặt các tính năng trong nhóm:
1. setbox name | thay  đổi tên box
2. setbox emoji/icon | thay đổi emoji box
3. setbox avt/img | thay đổi ảnh box
4. setbox admin/ad add/remove | thêm hoặc xóa quản trị viên`
    , event.threadID, event.messageID);
}
