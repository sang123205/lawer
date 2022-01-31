'use strict';
module.exports = {
    config: {
        name: 'out',
        ver: '1.0.0',
        role: 1,
        author: ['Lawer Team'],
        description: 'Out nhóm chat.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    if (event.senderID != Config.ADMIN[0]) return api.sendMessage("No right!", event.threadID, event.messageID);
    let idbox = args[0];
    let reason = args.slice(1);
    var msg = '',
        i = 1,
        listthread = [],
        groupid = [],
        groupName = [];

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    //if (await Threads.getStatus(event.threadID) != "online") return api.sendMessage('Đã rời khỏi nhóm trước đó', event.threadID);
    if (args[0] == "all") {
        api.sendMessage(`Đang out all nhóm. Vui lòng đợi...`, event.threadID, event.messageID);
        let inbox = await api.getThreadList(100, null, ['INBOX']);
        let list = [...inbox].filter(group => group.isSubscribed && group.isGroup && group.threadID != event.threadID);
        if (!list) return api.sendMessage(`Có lỗi xảy ra`, event.threadID);

        for (var groupInfo of list) {
            listthread.push({
                id: groupInfo.threadID
            });
        }
        var listbox = listthread.sort((a, b) => {
            if (a.sotv > b.sotv) return -1;
            if (a.sotv < b.sotv) return 1;
        });
        for (var group of listbox) {
            msg += await api.removeUserFromGroup(api.getCurrentUserID(), `${group.id}`)
        }
        return api.sendMessage(`Rời ${msg.length} nhóm thành công `, event.threadID);
    }
    if (!args[0]) {
        api.sendMessage(`
        $ { api.getCurrentUserID() }
        `, () =>
            api.sendMessage(`★★
        Tạm Biệt Nhé★★\ n\ n Tớ out box đây😢 `, event.threadID, () =>
                api.removeUserFromGroup(`
        $ { api.getCurrentUserID() }
        `, event.threadID)));
        //await Threads.setStatus(event.threadID, false);
        return;
    } else {
        api.sendMessage("Bot đã rời khỏi nhóm này, lý do: " + reason.join(" "), idbox, () =>
            api.removeUserFromGroup(`
        $ { api.getCurrentUserID() }
        `, idbox, () =>
                api.sendMessage("Đã out box có id: " + idbox + " với lý do: " + reason.join(" "), event.threadID)));
        //await Threads.setStatus(event.threadID, false);
        return;
    }
}