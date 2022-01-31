'use strict';
module.exports = {
  config: {
    name: 'daily',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Nhận quà báo danh hằng ngày.',
    location: __filename,
    timestamps: 5,
    envConfig: {
      rewardDay1: {
        coin: 100,
        exp: 10
      }
    },
  },
  onMessage: out
};

async function out({ event, api, global, Config, message, Threads, Users, args, body, is }) {
  const moment = require("moment-timezone");

  const reward = global.envConfig("daily").rewardDay1;
  if (args[0] == "info") {
    const rewardAll = global.envConfig("daily");
    let msg = "";
    let i = 1;
    for (let i = 1; i < 8; i++) {
      const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
      const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((i == 0 ? 7 : i) - 1));
      msg += `${i == 7 ? "Chủ Nhật" : "Thứ " + (i + 1)}: ${getCoin} coin và ${getExp} exp\n`;
    }
    return message.reply(msg);
  }

  const dateTime = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
  const date = new Date();
  let current_day = date.getDay(); // Lấy số thứ tự của ngày hiện tại
  const { senderID } = event;

  const userData = await Users.getData(senderID);
  const data = userData.data;
  if (!data.lastTimeGetReward) {
    data.lastTimeGetReward = null;
    await Users.setData(senderID, { data: data })
  }
  if (data.lastTimeGetReward === dateTime) return message.reply("Bạn đã nhận phần quà báo danh của ngày hôm nay rồi, vui lòng quay lại vào ngày mai")

  const getCoin = Math.floor(reward.coin * (1 + 20 / 100) ** ((current_day == 0 ? 7 : current_day) - 1));
  const getExp = Math.floor(reward.exp * (1 + 20 / 100) ** ((current_day == 0 ? 7 : current_day) - 1));

  userData.money = userData.money + getCoin,
    userData.exp = userData.exp + getExp,
    data.lastTimeGetReward = dateTime
  await Users.setData(senderID, { data: data }, (err, data) => {
    if (err) return message.reply(`Đã xảy ra lỗi`);
    message.reply(`Bạn đã nhận được ${getCoin} coin và ${getExp} exp`);
  });
}