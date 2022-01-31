'use strict';
module.exports = {
  config: {
    name: 'cony',
    ver: '1.0.0',
    role: 0,
    author: ['ManhG'],
    description: 'Dự đoán tỉ lệ có Ny của bạn trong năm nay.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ event, api, Users }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  var tl = ['21%', '67%', '19%', '37%', '17%', '96%', '52%', '62%', '76%', '83%', '100%', '99%', "0%", "48%", `1%`, `10%`, `99,9%`];
  var tle = tl[Math.floor(Math.random() * tl.length)];
  let name = (await Users.getData(event.senderID)).name;
  let img = (await axios.get('https://manhkhac.github.io/data/gif/dethuong.gif', {
    responseType: "arraybuffer"
  })).data;
  fs.writeFileSync(__dirname + "/cache/cony.gif", Buffer.from(img, "utf-8"));
  var reply = {
    body: `Chúc mừng bạn ${name}.\nBot đã dự đoán tỉ lệ có người yêu của bạn trong năm nay là ${tle} ❤❤`,
    attachment: fs.createReadStream(__dirname + "/cache/cony.gif")
  }
  api.sendMessage(reply, event.threadID, () => { fs.unlinkSync(__dirname + "/cache/cony.gif") }, event.messageID);
}