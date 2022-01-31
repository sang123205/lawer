'use strict';
module.exports = {
  config: {
    name: 'say',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Make the bot return google audio file via text.',
    location: __filename,
    timestamps: 15
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const request = require("request");
  const fs = require("fs-extra");
  const axios = require("axios");
  process.on('unhandledRejection', (error, p) => {
      return;
    });
  var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
  var languageToSay = (["ru", "en", "ko", "ja"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : 'vi';
  var msg = (languageToSay != 'vi') ? content.slice(3, content.length) : content;
  let sound = (await axios.get(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`, { responseType: "arraybuffer" }))
    .data;
  fs.writeFileSync(__dirname + `/cache/${event.senderID}-say.mp3`, Buffer.from(sound, "utf-8"));
  api.sendMessage({ body: "", attachment: fs.createReadStream(__dirname + `/cache/${event.senderID}-say.mp3`) }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}-say.mp3`));
}
