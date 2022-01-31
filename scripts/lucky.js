'use strict';
module.exports = {
  config: {
    name: 'lucky',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Game đoán số may mắn từ 0 đến 5.',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  var data = await Users.getData(event.senderID);
  var money = data.money
  var i = 500;
  var number = getRandomInt(0, 5)
  if (money < 5) api.sendMessage("Bạn không đủ tiền !", event.threadID, event.messageID)
  else {
    if (!args[0]) api.sendMessage("Không có số dự đoán.", event.threadID, event.messageID)
    else {
      if (args[0] > 10) api.sendMessage("Dự đoán không được lớn hơn 5.", event.threadID, event.messageID)
      else {
        if (args[0] == number) {
          api.sendMessage(number + " chính là con số may mắn, bạn đã nhận được 200 đô.", event.threadID, () => Users.setMoney(event.senderID, { increase: parseInt(i) }), event.messageID);
        }
        else api.sendMessage("Con số may mắn là " + number + "\n" + "Chúc bạn may mắn lần sau nhaaa !\n====Lưu ý====\nSau mỗi lần đoán sai, bạn sẽ bị trừ 50 đô, nếu bạn đúng bạn sẽ nhận lại 200 đô.", event.threadID, () => Users.setMoney(event.senderID, { deduction: 50 }), event.messageID);
      }
    }
  }
};