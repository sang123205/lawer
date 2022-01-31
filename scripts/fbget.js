'use strict';
module.exports = {
  config: {
    name: 'fbget',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Get audio/video fb.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const axios = require('axios');
  const fs = require("fs-extra");
  try {
    if (args[0] == 'audio') {
      api.sendMessage(`Đang xử lí audio!!!`, event.threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 20000), event.messageID);
      const path = __dirname + `/cache/${event.senderID}-fbget.mp3`;
      let getPorn = (await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getPorn, "utf-8"));
      return api.sendMessage({
        body: `✅Loaded success✅`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    };
  } catch { return api.sendMessage(`Không thể xử lý yêu cầu`, event.threadID, event.messageID) }
  try {
    if (args[0] == 'video') {
      api.sendMessage(`Đang xử lí video. Vui lòng đợi...!!!`, event.threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 20000), event.messageID);
      const path1 = __dirname + `/cache/${event.senderID}-fbget.mp4`;
      let getPorn = (await axios.get(event.attachments[0].playableUrl, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path1, Buffer.from(getPorn, "utf-8"));
      return api.sendMessage({
        body: `✅Loaded success✅`,
        attachment: fs.createReadStream(path1)
      }, event.threadID, () => fs.unlinkSync(path1), event.messageID);
    };
  } catch { return api.sendMessage(`Không thể xử lý yêu cầu`, event.threadID, event.messageID) }
}
