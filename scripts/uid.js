'use strict';
module.exports = {
    config: {
        name: 'uid',
        ver: '1.0.0',
        role: '0/2',
        author: ['Lawer Team'],
        description: 'Lấy ID người dùng bằng cách reply hoặc tag.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    if (event.type == "message_reply") {
        var uid = event.messageReply.senderID;
        return api.sendMessage(`${uid}`, event.threadID, event.messageID);
    } else if (Object.keys(event.mentions) == 0) return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
    else {
        for (var i = 0; i < Object.keys(event.mentions).length; i++) api.sendMessage(`${Object.values(event.mentions)[i].replace('@', '')}: ${Object.keys(event.mentions)[i]}`, event.threadID);
        return;
    }
}