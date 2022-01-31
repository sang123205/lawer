'use strict';
module.exports = {
  config: {
    name: 'resend',
    ver: '1.0.0',
    role: 0,
    author: ['?_MạnhG'],
    description: 'Xem lại tin nhắn bị gỡ.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out,
  onEvent: onEvent,
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body }) {
  const { threadID, messageID, isGroup } = event;
  var dataResend = (await Threads.getData(threadID)).data;
  if(!dataResend) return;
  if (dataResend.resend == false) {
    dataResend.resend = true;
    Threads.setData(threadID, { data: dataResend });
    return api.sendMessage("» Bật resend.", threadID, messageID);
  } else {
    dataResend.resend = false;
    Threads.setData(threadID, { data: dataResend });
    return api.sendMessage("» Tắt resend.", threadID, messageID);
  }
}

async function onEvent({ event, api, Config, global, Threads, Users }) {
  const request = require("request");
  const axios = require("axios");
  const { writeFileSync, createReadStream } = require("fs-extra");
  let { messageID, senderID, threadID, body: content } = event;
  if (!global.logMessage) global.logMessage = new Map();
  try {
	if(!isGroup) return;
    if (global.allThreadID.find(e => e == threadID)) {
      const dataResend = (await Threads.getData(threadID)).data;
      if (!dataResend.resend) {
        dataResend.resend = false;
        await Threads.setData(threadID, { data: dataResend })
      }
      if (dataResend.resend == false) return;
      if (senderID == api.getCurrentUserID()) return;
    }
    if (event.type != "message_unsend") global.logMessage.set(messageID, {
      msgBody: content,
      attachment: event.attachments
    })
    if (event.type == "message_unsend") {
      var getMsg = global.logMessage.get(messageID);
      if (!getMsg) return;
      let name = (await Users.getData(senderID)).name;
      if (getMsg.attachment[0] == undefined) return api.sendMessage(`${name} đã gỡ 1 tin nhắn\nNội dung: ${getMsg.msgBody}`, threadID)
      else {
        let num = 0
        let msg = {
          body: `${name} vừa gỡ ${getMsg.attachment.length} tệp đính kèm.${(getMsg.msgBody != "") ? `\n\nNội dung: ${getMsg.msgBody}` : ""}`,
          attachment: [],
          mentions: { tag: name, id: senderID }
        }
        for (var i of getMsg.attachment) {
          num += 1;
          var getURL = await request.get(i.url);
          var pathname = getURL.uri.pathname;
          var ext = pathname.substring(pathname.lastIndexOf(".") + 1);
          var path = __dirname + `/cache/${num}.${ext}`;
          var data = (await axios.get(i.url, { responseType: 'arraybuffer' })).data;
          writeFileSync(path, Buffer.from(data, "utf-8"));
          msg.attachment.push(createReadStream(path));
        }
        api.sendMessage(msg, threadID);
      }

    }
  } catch (err) {
    return
  }
}