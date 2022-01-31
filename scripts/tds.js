'use strict';
module.exports = {
  config: {
    name: 'tds',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Kiểm tra số xu traodoisub của bạn.',
    location: __filename,
    timestamps: 5
  }
};
module.exports.onMessage = async function({ api, event, args, Currencies, utils,Users,Threads }) {
  let axios = require('axios')
  let { threadID, senderID, messageID } = event;
  if(args.length == 0) api.sendMessage("Thiếu token tds ?",threadID,messageID)
  else{
  let res = await axios.get(encodeURI(`https://traodoisub.com/api/?fields=profile&access_token=${args[0]}`));
  console.log(res.data)
  var i = res.data;
  var ii = i.data;
  var msg = `🧑‍⚖️Tên tài khoản: ${ii.user}\n💳Xu: ${ii.xu}\r\n[!] Dữ liệu được lấy từ traodoisub !`
  api.sendMessage(msg,threadID,messageID)
 }
}