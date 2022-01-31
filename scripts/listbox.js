'use strict';
module.exports = {
    config: {
        name: 'listbox',
        ver: '1.0.0',
        role: 3,
        author: ['MạnhG'],
        description: 'Xem danh sách các nhóm bot đã tham gia.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onReply: reply
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    var prefix = (await Threads.getData(event.threadID)).prefix || Config.prefix;
    //---> Data
    var list = await Threads.getKey(["id", "name", "members", "status"]);
    //let list = [...inbox].filter(group => group.status == true);
    var listthread = [];
    for (var groupInfo of list) {
        if (groupInfo.status == true) {
            listthread.push({
                id: groupInfo.id,
                name: groupInfo.name || "Chưa đặt tên",
                sotv: Object.keys(groupInfo.members).length
            });
        }
    }
    var listbox = listthread.sort((a, b) => {
        if (a.sotv > b.sotv) return -1;
        if (a.sotv < b.sotv) return 1;
    });
    var msg = '',
        i = 1,
        groupid = [],
        groupName = [];

    switch (args[0]) {
        case "all":
            for (var group of listbox) {
                msg += `${i++}. ${group.name}\n🧩TID: ${group.id}\n🧏‍♂️Member: ${group.sotv}\n\n`;
                groupid.push(group.id);
                groupName.push(group.name);
            }
            api.sendMessage('🎭DS GROUP TO JOIN🎭\n\n' + msg + '🎭Reply Out, Ban, Unban + số thứ tự, phân tách bằng dấu cách!', event.threadID, (e, data) =>
                global.reply.push({
                    name: "listbox",
                    messageID: data.messageID,
                    author: event.senderID,
                    groupid,
                    groupName,
                    type: "reply"
                }), event.messageID
            );
            break;

        case "get":
            var inbox = await api.getThreadList(100, null, ['INBOX']);
            let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
            var listthread = [];
            api.sendMessage(`Loading. Please wait...`, event.threadID, event.messageID);
            for (var groupInfo of list) {
                let data = await api.getThreadInfo(groupInfo.threadID);
                listthread.push({
                    id: groupInfo.threadID,
                    name: groupInfo.name || "Chưa đặt tên",
                    sotv: data.userInfo.length
                });
            }
            var listbox = listthread.sort((a, b) => {
                if (a.sotv > b.sotv) return -1;
                if (a.sotv < b.sotv) return 1;
            });
            for (var group of listbox) {
                msg += `${i++}. ${group.name}\n🧩TID: ${group.id}\n🧏‍♂️Member: ${group.sotv}\n\n`;
                groupid.push(group.id);
                groupName.push(group.name);
            }
            api.sendMessage('🎭DS GROUP TO JOIN🎭\n\n' + msg + '🎭Reply Out, Ban, Unban + số thứ tự, phân tách bằng dấu cách!', event.threadID, (e, data) =>
                global.reply.push({
                    name: "listbox",
                    messageID: data.messageID,
                    author: event.senderID,
                    groupid,
                    groupName,
                    type: "reply"
                }), event.messageID
            );
            break;

        default:
            {
                var page = 1;
                page = parseInt(args[0]) || 1;
                page < -1 ? page = 1 : "";
                var limit = 10;
                var msg = "🎭GROUP TO JOIN🎭\n\n";
                var numPage = Math.ceil(listbox.length / limit);

                for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                    if (i >= listbox.length) break;
                    let group = listbox[i];
                    if (!group) return;
                    msg += `${i + 1}. ${group.name}\n🔰TID: ${group.id}\n🙇‍♂️Member: ${group.sotv}\n\n`;
                    groupid.push(group.id);
                    groupName.push(group.name);
                }
                msg += `--Trang ${page}/${numPage}--\nUse ${prefix}listbox + page number/all\n\n`

                api.sendMessage(msg + '🎭Reply Out, Ban, Unban + số thứ tự, phân tách bằng dấu cách!', event.threadID, (e, data) =>
                    global.reply.push({
                        name: "listbox",
                        author: event.senderID,
                        messageID: data.messageID,
                        groupid,
                        groupName,
                        type: 'reply'
                    })
                )
            }
            break;
    }
}
async function reply({ event, api, global, Config, logger, Threads, Users, reply, is }) {
    const { threadID, messageID } = event;
    if (parseInt(event.senderID) !== parseInt(reply.author)) return;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss DD/MM/YYYY");
    var arg = event.body.split(" ");
    var botID = api.getCurrentUserID();
    //var idgr = reply.groupid[arg[1] - 1];
    //var groupName = reply.groupName[arg[1] - 1];
    switch (reply.type) {
        case "reply":
            {
                /*
      if (arg[0] == "ban" || arg[0] == "Ban") {
        var arrnum = event.body.split(" ");
        var msg = "";
        var nums = arrnum.map(n => parseInt(n));
        nums.shift();
        for (let num of nums) {
          var idgr = reply.groupid[num - 1];
          var groupName = reply.groupName[num - 1];

          const data = (await Threads.getData(idgr)).banned || {};
          data.status = true;
          data.dateAdded = time;
          var typef = await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { time: data.dateAdded });
          msg += typef + ' ' + groupName + '\n🔰TID: ' + idgr + "\n";
          //logger.log(msg,'Thực thi Ban')
        }
        api.sendMessage(`» Notice from Admin «\n\n Your Group Has Been Banned, Banned From Using Bots.`, idgr, () =>
          api.sendMessage(`${botID}`, () =>
            api.sendMessage(`★★Thực thi Ban★★\n\n${msg}`, threadID, () =>
              api.unsendMessage(reply.messageID))));
        break;
      }

      if (arg[0] == "unban" || arg[0] == "Unban" || arg[0] == "ub" || arg[0] == "Ub") {
        var arrnum = event.body.split(" ");
        var msg = "";
        var nums = arrnum.map(n => parseInt(n));
        nums.shift();
        for (let num of nums) {
          var idgr = reply.groupid[num - 1];
          var groupName = reply.groupName[num - 1];
          const data = (await Threads.getData(idgr)).banned || {};
          data.status = false;
          data.dateAdded = null;
          var typef = await Threads.setData(idgr, { data });
          msg += typef + ' ' + groupName + '\n🔰TID: ' + idgr + "\n";
          //logger.log(msg,'Thực thi Unban')
        }
        api.sendMessage(`» Notice from Admin «\n\nYour Group Has Been Unbanned`, idgr, () =>
          api.sendMessage(`${botID}`, () =>
            api.sendMessage(`★★ Thực thi Unban ★★\n\n${msg}`, threadID, () =>
              api.unsendMessage(reply.messageID))));
        break;
      }
      */
                if (arg[0] == "out" || arg[0] == "Out") {
                    var arrnum = event.body.split(" ");
                    var msg = "",
                        i = 1;
                    var nums = arrnum.map(n => parseInt(n));
                    nums.shift();
                    for (let num of nums) {
                        var idgr = reply.groupid[num - 1];
                        var groupName = reply.groupName[num - 1];
                        setTimeout(function() { api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr); }, 10000);
                        msg += `${i++}. ${groupName}\n🔰TID: ${idgr}\n`;
                    }
                    api.sendMessage(`» Notice from Admin «\n\nBye bye\nI'm off`, idgr, () =>
                        api.sendMessage(`${botID}`, () =>
                            api.sendMessage(`★★Execute Out★★\n\n${msg} `, threadID, () =>
                                api.unsendMessage(reply.messageID))));
                    await Threads.setStatus(event.threadID, "offline");
                    break;
                }
            }
    }
}