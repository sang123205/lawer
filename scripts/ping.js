'use strict';
module.exports = {
    config: {
        name: 'ping',
        ver: '1.0.0',
        role: 0,
        author: ['MạnhG'],
        description: 'Ping tất cả các thành viên.',
        timestamps: 5
    },
    onMessage: out
};

async function out({ event, api, args, body }) {
    const botID = api.getCurrentUserID();
    const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
    const lengthAllUser = listUserID.length;
    const mentions = [];
    var body = args.join(" ") || "@all";
    var lengthbody = body.length;
    let i = 0;
    for (let uid of listUserID) {
        let fromIndex = 0;
        if (lengthbody < lengthAllUser) {
            body += body[lengthbody - 1];
            lengthbody++;
        }
        if (body.slice(0, i).lastIndexOf(body[i]) != -1) fromIndex = i;
        mentions.push({ tag: body[i], id: uid, fromIndex });
        i++;
    }
    return api.sendMessage({ body, mentions }, event.threadID, event.messageID);
}