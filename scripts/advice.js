'use strict';
module.exports = {
  config: {
    name: 'advice',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Ngẫu nhiên cho bạn 1 lời khuyên.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const srod = require('srod-v2');
  const request = require('request');
  const Data = (await srod.GetAdvice()).embed.description;
  
  return request(encodeURI(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${Data}`), (err, response, body) => {
		if (err) return api.sendMessage("An error has occurred!", event.threadID, event.messageID);
		var retrieve = JSON.parse(body);
		var text = '';
		retrieve[0].forEach(item => (item[0]) ? text += item[0] : '');
    return api.sendMessage(Data+'\n'+text, event.threadID, event.messageID)
  });
}
