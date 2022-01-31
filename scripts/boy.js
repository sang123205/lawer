'use strict';
module.exports = {
  config: {
    name: 'boy',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Random boy photo.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const axios = require("axios");
    const request = require("request");
    const fs = require("fs-extra")
    axios.get('https://api.vinhbeat.ga/trai.php').then(res => {
        let ext = res.data.data.substring(res.data.data.lastIndexOf(".") + 1);
        let callback = function() {
            api.sendMessage({
                attachment: fs.createReadStream(__dirname + `/cache/${event.senderID}.${ext}`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}.${ext}`), event.messageID);
        };
        request(res.data.data).pipe(fs.createWriteStream(__dirname + `/cache/${event.senderID}.${ext}`)).on("close", callback);
    })
}