'use strict';
module.exports = {
    config: {
        name: 'listban',
        ver: '1.0.0',
        role: 3,
        author: ['Lawer Team'],
        description: 'List banned.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onReply: reply
};

async function out({ event, api, global, Config, Users, Threads, args, is }) {
    const { threadID, messageID, senderID } = event;
    var prefix = (await Threads.getData(event.threadID)).prefix || Config.prefix;
    switch (args[0]) {
        case "box":
        case "thread":
        case "-t":
        case "t":
            {
                var threadData = await Threads.getKey(["id", "name", "banned"]);
                var msg = [],
                    idBanned = [],
                    nameThreadID = [],
                    listBanned = [],
                    listBan = [],
                    i = 1;
                for (let groupInfo of threadData) {
                    if (groupInfo.banned.status == true) {
                        listBanned.push({
                            idThread: groupInfo.id,
                            nameThread: groupInfo.name || "Chưa đặt tên",
                            reason: groupInfo.banned.reason,
                            time: groupInfo.banned.time
                        });
                    }
                }

                var listBan = listBanned.sort((a, b) => {
                    if (a.time > b.time) return -1;
                    if (a.time < b.time) return 1;
                });

                for (var thread of listBan) {
                    msg += `${i++}/ ${thread.nameUser}\n» ID: ${thread.idUser}\n» Lý do: ${thread.reason}\n» Time: ${thread.time}\n\n`;
                    idBanned.push(thread.idThread);
                    nameThreadID.push(thread.nameThread);
                }

                return api.sendMessage(idBanned.length != 0 ? api.sendMessage(`❎Hiện tại có ${idBanned.length} nhóm bị ban\n\n${msg}` + "» Reply số số thứ tự, cách nhau bằng dấu cách để bỏ cấm chuỗi tương ứng", threadID, (error, info) => {
                    global.reply.push({
                        name: "listban",
                        messageID: info.messageID,
                        author: event.senderID,
                        TID: idBanned,
                        nameBanned: nameThreadID,
                        type: 'unbanthread'
                    })
                }, messageID) : "» Hiện tại không có nhóm nào bị cấm!", threadID, messageID);
            }

        case "user":
        case "-u":
        case "u":
            {
                var userData = await Users.getKey(["id", "name", "banned"]);
                var msg = [],
                    idBanned = [],
                    nameUserID = [],
                    listBanned = [],
                    listBan = [],
                    i = 1;
                for (let UserInfo of userData) {
                    if (UserInfo.banned.status == true) {
                        listBanned.push({
                            idUser: UserInfo.id,
                            nameUser: UserInfo.name || "Chưa đặt tên",
                            reason: UserInfo.banned.reason,
                            time: UserInfo.banned.time
                        });
                    }
                }
                var listBan = listBanned.sort((a, b) => {
                    if (a.time > b.time) return -1;
                    if (a.time < b.time) return 1;
                });

                for (var user of listBan) {
                    msg += `${i++}/ ${user.nameUser}\n» ID: ${user.idUser}\n» Lý do: ${user.reason}\n» Time: ${user.time}\n\n`;
                    idBanned.push(user.idUser);
                    nameUserID.push(user.nameUser);
                }

                return api.sendMessage(idBanned.length != 0 ? api.sendMessage(`❎Hiện tại có ${idBanned.length} người dùng bị cấm\n\n${msg}` + "» Reply số thứ tự, được phân tách bằng dấu cách để bỏ cấm người dùng tương ứng", threadID, (error, info) => {
                    global.reply.push({
                        name: "listban",
                        messageID: info.messageID,
                        author: event.senderID,
                        ID: idBanned,
                        nameBanned: nameUserID,
                        type: 'unbanuser'
                    })
                }, messageID) : "» Hiện không có người dùng bị cấm", threadID, messageID);
            }

        default:
            api.sendMessage(`» Use: ${prefix}listban thread/user`, event.threadID, event.messageID)
            break;
    }
}
async function reply({ event, api, global, reply, Users, Threads }) {
    const { threadID, messageID, senderID } = event;
    if (parseInt(senderID) !== parseInt(reply.author)) return;
    switch (reply.type) {
        case 'unbanthread':
            {
                var arrnum = event.body.split(" ");
                var msg = "",
                    i = 1;
                var nums = arrnum.map(n => parseInt(n));

                for (let num of nums) {
                    var idThread = reply.TID[num - 1];
                    var nameThread = reply.nameBanned[num - 1];
                    let banned = (await Users.getData(event.senderID)).banned;
                    banned.status = false,
                        banned.reason = null,
                        banned.time = null;
                    await Threads.setData(idThread, { banned: banned });
                    msg += `${i++}/ ${nameThread}\nID: ${idThread}\n\n`;
                }
                api.sendMessage(`» Notice from Admin «\n\n- Group ${nameThread} your ban has been removed\n\n- The bot can be used now`, idThread, () =>
                    api.sendMessage(`${api.getCurrentUserID()}`, () =>
                        api.sendMessage(`★★Execute Unban★★\n\n${msg}`, threadID, () =>
                            api.unsendMessage(reply.messageID))));
            }
            break;

        case 'unbanuser':
            {
                var arrnum = event.body.split(" ");
                var msg = "",
                    i = 1;
                var nums = arrnum.map(n => parseInt(n));

                for (let num of nums) {
                    var uidUSer = reply.ID[num - 1];
                    var nameUser = reply.nameBanned[num - 1];
                    let banned = (await Users.getData(event.senderID)).banned;
                    banned.status = false,
                        banned.reason = null,
                        banned.time = null;
                    await Users.setData(uidUSer, { banned: banned });
                    const arr = global.userBanned;
                    arr.splice(arr.indexOf(uidUSer), 1)
                    msg += `${i++}/ ${nameUser}\nID: ${uidUSer}\n\n`;
                }
                api.sendMessage(`★★Execute Unban★★\n\n${msg}`, threadID, () =>
                    api.unsendMessage(reply.messageID));
            }
            break;
    }
}