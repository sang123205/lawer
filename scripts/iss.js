'use strict';
module.exports = {
  config: {
    name: 'iss',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Vị trí hiện tại của Trạm vũ trụ quốc tế.',
    location: __filename,
    timestamps: 5
  }
};
module.exports.onMessage = async ({ event, api, args, Users }) => {
  const request = require('request')
  return request(`http://api.open-notify.org/iss-now.json`, (err, response, body) => {
    if (err) throw err;
    var jsonData = JSON.parse(body);
    api.sendMessage(`Vị trí hiện tại của Trạm vũ trụ quốc tế 🌌🌠🌃\n- Latitude: ${jsonData.iss_position.latitude}\n- Longitude: ${jsonData.iss_position.longitude}`, event.threadID, event.messageID);
  });
}