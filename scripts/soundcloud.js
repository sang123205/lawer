'use strict';
module.exports = {
  config: {
    name: 'soundcloud',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Phát nhạc thông qua liên kết soundcloud',
    location: __filename,
    timestamps: 5,
    envConfig: {
      "SOUNDCLOUD_API": "M4TSyS6eV0AcMynXkA3qQASGcOFQTWub"
    }
  },
  onMessage: on
};
async function on({ event, api, args, global, is }) {
  const scdl = require("soundcloud-downloader").default;
  const { createReadStream, createWriteStream, unlinkSync, statSync } = require("fs-extra");
  const { SOUNDCLOUD_API } = global.envConfig("soundcloud");

  if (args.length == 0 || !args) return api.sendMessage('Vui lòng nhập link nhạc soundcloud!', event.threadID, event.messageID);
  const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;

  if (scRegex.test(args[0])) {
    let body;
    try {
      var songInfo = await scdl.getInfo(args[0], SOUNDCLOUD_API);
      var timePlay = Math.ceil(songInfo.duration / 1000);
      body = `Tiêu đề: ${songInfo.title} | ${(timePlay - (timePlay %= 60)) / 60 + (9 < timePlay ? ':' : ':0') + timePlay}]`;
    }
    catch (error) {
      if (error.statusCode == "404") return api.sendMessage("Không tìm thấy bài nhạc của bạn thông qua link trên ;w;", event.threadID, event.messageID);
      api.sendMessage("Không thể xử lý request do dã phát sinh lỗi: " + error.message, event.threadID, event.messageID);
    }
    try {
      await scdl.downloadFormat(args[0], scdl.FORMATS.OPUS, SOUNDCLOUD_API ? SOUNDCLOUD_API : undefined).then(songs => songs.pipe(createWriteStream(__dirname + `/cache/${event.senderID}-sndclound.mp3`)).on("close", () => api.sendMessage({ body, attachment: createReadStream(__dirname + `/cache/${event.senderID}-sndclound.mp3`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${event.senderID}-sndclound.mp3`), event.messageID)));
    }
    catch (error) {
      await scdl.downloadFormat(args[0], scdl.FORMATS.MP3, SOUNDCLOUD_API ? SOUNDCLOUD_API : undefined).then(songs => songs.pipe(createWriteStream(__dirname + `/cache/${event.senderID}-sndclound.mp3`)).on("close", () => api.sendMessage({ body, attachment: createReadStream(__dirname + `/cache/${event.senderID}-sndclound.mp3`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${event.senderID}-sndclound.mp3`), event.messageID)));
    }
  }
}
