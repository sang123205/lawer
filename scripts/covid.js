'use strict';
module.exports = {
  config: {
    name: 'covid',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Xem thông tin covid.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const axios_1 = require("axios");
  const moment = require("moment-timezone");
  var time = moment.tz("Asia/Ho_Chi_Minh").format("YYYY");
  let fetchdata = await axios_1.get("https://static.pipezero.com/covid/data.json");
  var jsondata = (await fetchdata.data).total;
  var vn = (await fetchdata.data).overview[6];
  var year = vn.date + '-' + time;
  var world = jsondata.world,
    nhiemtg = world.cases,
    chettg = world.death,
    hoiphuctg = world.recovered,
    //////////////////////////////
    nhiemvn = vn.cases,
    chetvn = vn.death,
    hoiphucvn = vn.recovered,
    dieutrivn = vn.treating,
    //////////////////////////////
    nhiemvn7days = vn.avgCases7day,
    hoiphucvn7days = vn.avgRecovered7day,
    chetvn7days = vn.avgDeath7day,
    //////////////////////////////
    ptchetvn = Math.round((chetvn * 100) / nhiemvn),
    pthoiphucvn = Math.round((hoiphucvn * 100) / nhiemvn),
    ptchettg = Math.round((chettg * 100) / nhiemtg),
    pthoiphuctg = Math.round((hoiphuctg * 100) / nhiemtg),
    pthoiphucvn = pthoiphucvn.toString().split(".")[0],
    ptdieutrivn = (100 - pthoiphucvn - ptchetvn).toString().split(".")[0];
  /////////////////////////////////
  ptchetvn = ptchetvn.toString().split(".")[0];
  pthoiphuctg = pthoiphuctg.toString().split(".")[0];
  ptchettg = ptchettg.toString().split(".")[0];
  return api.sendMessage(
    "====== Thế Giới ======\n" +
    `😷 Nhiễm: ${nhiemtg}\n` +
    `💚 Hồi phục: ${hoiphuctg} (${pthoiphuctg}%)\n` +
    `💀 Tử vong: ${chettg} (${ptchettg}%)\n` +
    "====== Việt Nam ======\n" +
    `😷 Nhiễm: ${nhiemvn}\n` +
    `💉 Đang điều trị: ${dieutrivn} (${ptdieutrivn}%)\n` +
    `💚 Hồi phục: ${hoiphucvn} (${pthoiphucvn}%)\n` +
    `💀 Tử vong: ${chetvn} (${ptchetvn}%)\n` +
    `🤨 Nhiễm 7 ngày: ${nhiemvn7days}\n` +
    `❤ Hồi phục 7 ngày: ${hoiphucvn7days}\n` +
    `☠️ Tử vong 7 ngày: ${chetvn7days}\n\n` +
    //`Tin tức: ${news.vietnam}\n` +
    `Cập nhật: ${year}`,
    event.threadID, event.messageID
  );
}
