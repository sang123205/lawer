'use strict';
module.exports = {
    config: {
        name: 'pending',
        ver: '1.0.0',
        role: 2,
        author: ['Lawer Team'],
        description: 'Xem danh sách các nhóm/người dùng đang chờ.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onReply: reply
};

async function out({ event, api, global, args }) {
    const { threadID, messageID } = event;
    var msg = "",
        index = 1;
    if (args[0] == 'thread' || args[0] == "threads" || args[0] == "-t") {
        try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        } catch (e) {
            return api.sendMessage("» Không thể lấy danh sách các nhóm đang chờ!", threadID, messageID);
        }
        const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
        for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

        if (list.length != 0) return api.sendMessage(`» Chờ phê duyệt: ${list.length} group ❮\n\n${msg}`, threadID, (error, info) => {
            global.reply.push({
                name: "pending",
                messageID: info.messageID,
                author: event.senderID,
                pending: list
            })
        }, messageID);
        else return api.sendMessage("» Không tìm thấy nhóm đang chờ", threadID, messageID);
    }
    if (args[0] == 'users' || args[0] == "user" || args[0] == "-u") {
        try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        } catch (e) {
            return api.sendMessage("» Không thể lấy danh sách các nhóm đang chờ!", threadID, messageID);
        }
        const list = [...spam, ...pending].filter(group => group.isGroup == false);
        for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

        if (list.length != 0) return api.sendMessage(`» Chờ phê duyệt: ${list.length} people\n\n${msg}`, threadID, (error, info) => {
            global.reply.push({
                name: "pending",
                messageID: info.messageID,
                author: event.senderID,
                pending: list
            })
        }, messageID);
        else return api.sendMessage("» Không tìm thấy người dùng đang chờ nào", threadID, messageID);
    } else {
        try {
            var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
            var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
        } catch (e) {
            return api.sendMessage("» Không thể lấy danh sách các nhóm đang chờ!", threadID, messageID);
        }
        const listThread = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
        const listUser = [...spam, ...pending].filter(group => group.isGroup == false)
        const list = [...spam, ...pending].filter(group => group.isSubscribed);
        for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

        if (list.length != 0) return api.sendMessage(`» Chờ phê duyệt: ${listThread.length} nhóm và ${listUser.length} người dùng\n\n${msg}`, threadID, (error, info) => {
            global.reply.push({
                name: "pending",
                messageID: info.messageID,
                author: event.senderID,
                pending: list
            })
        }, messageID);
        else return api.sendMessage("» Không tìm thấy nhóm và những người dùng trong hàng đợi", threadID, messageID);
    }
}

async function reply({ event, api, global, logger, Config, Threads, Users, reply, is }) {
    if (String(event.senderID) !== String(reply.author)) return;
    const { threadID, messageID } = event;
    var count = 0;

    if (isNaN(event.body) && event.body.indexOf("c") == 0 || event.body.indexOf("cancel") == 0) {
        const index = (event.body.slice(1, event.body.length)).split(/\s+/);
        for (const singleIndex of index) {
            //console.log(singleIndex);
            if (isNaN(singleIndex) || singleIndex <= 0) return api.sendMessage(`${singleIndex}  tham số không hợp lệ`, threadID, messageID);
            api.removeUserFromGroup(api.getCurrentUserID(), reply.pending[singleIndex - 1].threadID);
            count += 1;
        }
        api.unsendMessage(reply.messageID);
        return api.sendMessage(`[ APPROVE ] » Từ chối thành công ${count} group/user!`, threadID, messageID);
    } else {
        const index = event.body.split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0) return api.sendMessage(`${singleIndex} tham số không hợp lệ`, threadID, messageID);
            api.sendMessage(`[ APPROVE ] » Kích hoạt Bot thành công`, reply.pending[singleIndex - 1].threadID);
            api.changeNickname(`[ ${Config.prefix} ] • ${Config.botname}`, reply.pending[singleIndex - 1].threadID, api.getCurrentUserID());
            count += 1;
        }
        api.unsendMessage(reply.messageID);
        return api.sendMessage(`[ APPROVE ] » Đã phê duyệt thành công ${count} group/user.`, threadID, messageID);
    }
}