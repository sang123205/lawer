'use strict';
module.exports = {
  config: {
    name: 'search',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Kết quả tìm kiếm trên google!.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, is }) {
    let textNeedSearch = "";
    const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;
    (event.type == "message_reply") ? textNeedSearch = event.messageReply.attachments[0].url: textNeedSearch = args.join(" ");
    (regex.test(textNeedSearch)) ? api.sendMessage(`https://www.google.com/searchbyimage?&image_url=${textNeedSearch}`, event.threadID, event.messageID): api.sendMessage(`https://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`, event.threadID, event.messageID);
}