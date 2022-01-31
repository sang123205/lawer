'use strict';
module.exports = {
  config: {
    name: 'tile',
    ver: '1.0.0',
    role: 0,
    author: ['ManhG'],
    description: 'Xem tỉ lệ hợp đôi giữa 2 người.',
    location: __filename,
    timestamps: 5
  }
};
module.exports.onMessage = async function ({ api, args, Users, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  var mention = Object.keys(event.mentions)[0];
  if (!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn xem tỉ lệ hợp nhau", event.threadID);
  var name = (await Users.getData(mention)).name
  var namee = (await Users.getData(event.senderID)).name
  var tle = Math.floor(Math.random() * 101);

  var arraytag = [];
  arraytag.push({ id: mention, tag: name });
  arraytag.push({ id: event.senderID, tag: namee });
  var mentions = Object.keys(event.mentions)

  let Avatar = (await axios.get(`https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/tile2.png", Buffer.from(Avatar, "utf-8"));
  let Avatar2 = (await axios.get(`https://graph.facebook.com/${event.senderID}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(__dirname + "/cache/tile1.png", Buffer.from(Avatar2, "utf-8"));

  var imglove = [];

  imglove.push(fs.createReadStream(__dirname + "/cache/tile1.png"));
  imglove.push(fs.createReadStream(__dirname + "/cache/tile2.png"));
  var msg = { body: `Tỉ lệ hợp đôi giữa ${namee} và ${name} là ${tle}% 🥰`, mentions: arraytag, attachment: imglove }
  return api.sendMessage(msg, event.threadID, event.messageID)
}