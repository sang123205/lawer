'use strict';
module.exports = {
  config: {
    name: 'rname',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Random Japanese nickname.',
    location: __filename,
    timestamps: 5
  }
}

module.exports.onMessage = async ({ api, event, global }) => {
  return require("request")(`https://www.behindthename.com/api/random.json?usage=jap&gender=f&key=mi451266190`, (err, response, body) => {
    const data = JSON.parse(body);
    api.changeNickname(`${data.names[0]} ${data.names[1]}`, event.threadID, event.senderID);
  });
}