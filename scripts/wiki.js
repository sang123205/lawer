'use strict';
module.exports = {
  config: {
    name: 'wiki',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Tìm mọi thông tin cần biết thông qua Wikipedia.',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};
async function out({ api, event, global, args, body }) {
  const wiki = require("wikijs").default;
  let content = args.join(" ");
  let url = 'https://vi.wikipedia.org/w/api.php';
  if (args[0] == "en") {
    url = 'https://en.wikipedia.org/w/api.php';
    content = args.slice(1, args.length);
  }
  if (!content) return api.sendMessage("Nội dung cần tìm kiếm không được để trống!", event.threadID, event.messageID);
  return wiki({ apiUrl: url }).page(content).catch(() => api.sendMessage("Không tìm thấy nội dung bạn cần tìm!", event.threadID, event.messageID)).then(page => (typeof page != 'undefined') ? Promise.resolve(page.summary()).then(val => api.sendMessage(val, event.threadID, event.messageID)) : '');
}
