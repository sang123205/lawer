'use strict';
module.exports = {
    config: {
        name: 'girl',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Random ảnh girl.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body }) {
    const { threadID, messageID } = event;
    var reply = {
        body: "",
        attachment: (await require('axios')({
            url: (await require('axios')('https://imgs-api.herokuapp.com/girl/?apikey=ManhG')).data.url,
            method: "GET",
            responseType: "stream"
        })).data
    }
    return api.sendMessage(reply, threadID, messageID);
}