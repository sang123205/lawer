'use strict';
module.exports = {
    config: {
        name: 'shortlink',
        ver: '1.0.0',
        role: 0,
        author: ['MạnhG'],
        description: 'Shorten url.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, args }) {
    const BitlyClient = require("bitly").BitlyClient;
    const bitly = new BitlyClient('150ef1bc3af86500796d645c86f56766e4802566');
    var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if (!regex.test(args[0])) return api.sendMessage("Must be a shortened url!", event.threadID);
    if (args[0].indexOf("http" || "https") === -1) args[0] = "https://" + args[0];
    const res = await bitly.shorten(args[0]);
    return api.sendMessage("" + res.id, event.threadID, event.messageID);
}