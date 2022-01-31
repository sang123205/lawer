'use strict';
module.exports = {
    config: {
        name: 'update',
        ver: '1.0.0',
        role: 2,
        author: ['Lawer Team'],
        description: 'update database',
        location: __filename,
        timestamps: 0
    },
    onMessage: out
};
async function out({ event, api, args, Threads, Users, Config }) {
    const { threadID, messageID, senderID } = event;
    if (event.senderID != Config.admin[0]) return api.sendMessage("» You are not allowed to use this command", event.threadID, event.messageID);
    if (args[0] == 'thread' && !args[1]) {
        await Threads.refreshInfo(threadID);
        return api.sendMessage('Done.', threadID, messageID);
    } else if (args[0] == 'thread' && args[1]) {
        await Threads.refreshInfo(args[1]);
        return api.sendMessage('Done.', threadID, messageID);
    }
    if (args[0] == 'user' && !args[1]) {
        if (event.type == 'message_reply') {
            await Users.refreshInfo(event.messageReply.senderID);
            return api.sendMessage('Done.', threadID, messageID);
        } else {
            await Users.refreshInfo(senderID);
            return api.sendMessage('Done.', threadID, messageID);
        }
    } else if (Object.keys(event.mentions).length >= 0) {
        for (var i of Object.keys(event.mentions)) {
            await Users.refreshInfo(i);
        }
        return api.sendMessage('Done.', threadID, messageID);
    }
}