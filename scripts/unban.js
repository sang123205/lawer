'use strict';
module.exports = {
    config: {
        name: 'unban',
        ver: '1.0.0',
        role: 3,
        author: ['Lawer Team'],
        description: 'Unban 1 cách thần tốc.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    var { threadID, messageID, senderID } = event;
    var prefix = await Threads.getData(event.threadID).prefix || Config['PREFIX'];
    let data = (await Users.getData(event.senderID)).banned;
    data.status = false,
        data.reason = null,
        data.time = null;
    switch (args[0]) {
        case 'admin':
        case 'ad':
            {
                const listAdmin = Config.admin;
                for (var idad of listAdmin) {
                    await Users.setData(idad, { banned: data });
                }
                api.sendMessage("» Unban all admin bots successfully!", threadID, messageID)
                break;
            }

        case 'allbox':
        case 'allthread':
            {
                const threadData = await Threads.getKey(["id", "banned"])
                for (let id of threadData) {
                    if (id.banned.status == true) {
                        var idThread = id.threadID;
                        await Users.setData(idThread, { banned: data });
                    }
                }
                api.sendMessage("» Remove ban for the entire group on the server successfully", threadID, messageID)
                break;
            }

        case 'box':
        case 'thread':
            {
                var idbox = event.threadID;
                await Users.setData(idbox, { banned: data });
                api.sendMessage("» This group has been unbanned!", threadID, messageID)
                break;
            }

        case 'allmember':
        case 'alluser':
            {
                const userData = await Users.getKey(["id", "banned"]);
                for (let id of userData) {
                    if (id.banned.status == true) {
                        var idUser = id.id;
						//console.log(idUser);
                        await Users.setData(idUser, { banned: data });
                    }
                }
                api.sendMessage("» Remove ban from all users on server successfully!", threadID, messageID)
                break;
            }

        case 'qtv':
        case 'Qtv':
        case 'allqtv':
            {
                var threadInfo = await api.getThreadInfo(event.threadID);
                var listQTV = threadInfo.adminIDs;
                for (let i = 0; i < listQTV.length; i++) {
                    const idQtv = listQTV[i].id;
                    await Users.setData(idQtv, { banned: data });
                }
                api.sendMessage("» Successfully unblocking all box admins!", threadID, messageID)
                break;
            }

        case 'member':
        case 'mb':
        case 'user':
            {
                if (!args[1]) {
                    var listMember = event.participantIDs;
                    for (let i = 0; i < listMember.length; i++) {
                        const idMember = listMember[i];
                        await Users.setData(idMember, { banned: data });
                    }
                    return api.sendMessage("» Unban all members of this group!", threadID, messageID);
                }
                if (args.join().indexOf('@') !== -1) {
                    var mention = Object.keys(event.mentions)
                    var nameUser = event.mentions[mention];
                    await Users.setData(mention, { banned: data });
                    return api.sendMessage(`${nameUser} unban success!`, threadID, messageID)
                }
                break;
            }

        default:
            api.sendMessage(`» You can use:\n\n1. ${prefix}unban admin => unban all admin bot\n\n2. ${prefix}unban allbox => unban all groups on sever\n\n3. ${prefix}unban box => unban current group [1 group ]\n\n4. ${prefix}unban alluser => unban all users on sever!\n\n5. ${prefix}unban qtv/allqtv => unban all QTV Box [1 box ]\n\n6. ${prefix}unban member => unban all group members [1 group ]\n\n7. ${prefix}unban member @[tag] => remove ban for the person tagged`, threadID, messageID);
            break;
    }
}