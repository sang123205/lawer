'use strict';
module.exports = {
    config: {
        name: 'autounban',
        ver: '1.0.0',
        role: "0/1",
        author: ['Lawer Team'],
        description: 'Tự động gỡ cấm người dùng bị ban bot.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onEvent: onEvent
};
async function out({ event, api, args }) {
    return api.sendMessage(`Tự động gỡ cấm người dùng spambot bot sau 2h.`, event.threadID, event.messageID);
}
async function onEvent({ global, event, api, Config, logger, Threads, Users }) {
    const { senderID, messageID, threadID } = event;
    if (senderID == api.getCurrentUserID()) return;

    let userBanned = global.userBanned;
    for (let idBan of userBanned) {
        //console.log(idBan)
        setTimeout(async function() {
            const banned = (await Users.getData(idBan)).banned;
            banned.status = false;
            banned.reason = null;
            banned.timeDate = null;
            await Users.setData(idBan, { banned: banned });
            userBanned.splice(userBanned.indexOf(idBan), 1);
        }, 120 * 60);
    }
}