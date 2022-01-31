'use strict';
module.exports = {
    config: {
        name: 'naughty',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'image',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, args }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    const request = require("request");
    const data = (await axios.get('https://imgs-api.herokuapp.com/naughty/?apikey=ManhG')).data;
    var link = data.url;
    let img = (await axios.get(link, {
        responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(__dirname + "/cache/naughty.png", Buffer.from(img, "utf-8"));
    return api.sendMessage({
            attachment: fs.createReadStream(__dirname + "/cache/naughty.png")
        }, event.threadID,
        (err, info) => {
            fs.unlinkSync(__dirname + "/cache/naughty.png")
            setTimeout(() => {
                api.unsendMessage(info.messageID);
            }, 10000)
        }, event.messageID);
}