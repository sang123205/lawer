'use strict';
module.exports = {
    config: {
        name: 'cadao',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Ca dao Vietnam.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};

async function out({ event, api }) {
    const axios = require('axios');
    const request = require('request');
    const fs = require("fs-extra");
    const { data } = await axios.get(`https://manhict.tech/cadaovn`);
    const rdCadao = data.result.rdCadao;
    // api.sendMessage(`» Ca dao Vietnam\n\n${rdCadao} `, event.threadID, event.messageID)

    var gai = data.result.image.substring(data.result.image.lastIndexOf(".") + 1);
    let callback = function() {
        return api.sendMessage({
            body: `» Vietnamese Ca Dao\n\n${rdCadao} `,
            attachment: fs.createReadStream(__dirname + `/cache/gaicadao.${gai}`)
        }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/gaicadao.${gai}`), event.messageID);
    };
    request(data.result.image).pipe(fs.createWriteStream(__dirname + `/cache/gaicadao.${gai}`)).on("close", callback);

}