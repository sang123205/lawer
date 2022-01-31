'use strict';
module.exports = {
  config: {
    name: 'chemeb',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Cân bằng phương trình với tốc độ nhanh hơn so với việc người yêu cũ quay lưng lại với bạn.',
    location: __filename,
    timestamps: 5
  }
}
module.exports.onMessage = function({ api, event, args, global }) {
  const chemeb = require("chem-eb");
  if (event.type == "message_reply") {
    var msg = event.messageReply.body;
    if (msg.includes('(') && msg.includes(')')) return api.sendMessage('notSupportXYz\n\nEx: chemeb H2+O2=H2O', event.threadID, event.messageID);
    var balanced = chemeb(msg);
    return api.sendMessage(`=> ${balanced.outChem}`, event.threadID, event.messageID);
  }
  else
    var msg = args.join(" ");
  if (msg.includes('(') && msg.includes(')')) return api.sendMessage('notSupportXYz\n\nEx: chemeb H2+O2=H2O', event.threadID, event.messageID);
  var balanced = chemeb(msg);
  return api.sendMessage(`=> ${balanced.outChem}`, event.threadID, event.messageID);
}