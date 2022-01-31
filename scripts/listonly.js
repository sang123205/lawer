'use strict';
module.exports = {
    config: {
        name: 'listonly',
        ver: '1.0.0',
        role: 0,
        author: ['MạnhG'],
        description: 'Xem danh sách box activate.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};

async function out({ event, api, global, Config, message, Threads, Users, args, body, is }) {
    const { threadID, senderID, isGroup } = event;
    const { ADMIN, EXCEPTION, DEVMODE, personalOnly, adminOnly, boxOnly, listBoxOnly, allQTVOnly, LANGUAGE_SCRIPTS } = Config;
    const listAdmin = senderID != ADMIN.find(item => item == senderID);
    let allListBoxOnly = listBoxOnly.threadID.find(item => item == threadID);
    var msg = [],
        pushID = [],
        i = 1;
    let idBoxOnly = listBoxOnly.threadID;
    for (let idbox of idBoxOnly) {
        const nameBox = (await Threads.getData(idbox)).name;
        msg += `${i++}/ ${nameBox}(${idbox})\n`;
        pushID.push(nameBox);
    }
    return message.reply(pushID.length != 0 ? message.reply(
        `🧭Đang có ${pushID.length} nhóm được phép sử dụng bot\n\n${msg}`
    ) : `» Hiện tại ko nhóm nào được duyệt!`);
}