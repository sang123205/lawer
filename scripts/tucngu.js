'use strict';
module.exports = {
    config: {
        name: 'tucngu',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Tục ngữ Vietnam.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};

async function out({ event, api }) {
    const axios = require('axios');
    const request = require('request');
    const fs = require("fs-extra");
    const { data } = await axios.get(`https://manhict.tech/tucngu`);
    const rdtucngu = data.result.tucngu;
    return api.sendMessage(`» Tục ngữ Vietnam\n\n${rdtucngu} `, event.threadID, event.messageID)

    var gai = data.result.image.substring(data.result.image.lastIndexOf(".") + 1);
    let callback = function() {
        api.sendMessage({
            body: `» Vietnamese Ca Dao\n\n${rdCadao} `,
            attachment: fs.createReadStream(__dirname + `/cache/gaicadao.${gai}`)
        }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/gaicadao.${gai}`), event.messageID);
    };
    request(data.result.image).pipe(fs.createWriteStream(__dirname + `/cache/gaicadao.${gai}`)).on("close", callback);
    return;
}