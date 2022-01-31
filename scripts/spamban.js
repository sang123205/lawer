'use strict';
module.exports = {
    config: {
        name: 'spamban',
        ver: '1.0.0',
        role: "0/1",
        author: ['Lawer Team'],
        description: 'Tự động cấm người dùng nếu spambot 7 lần/60 giây.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onEvent: onEvent
};
async function out({ event, api, args }) {
    return api.sendMessage(`Tự động cấm người dùng nếu spambot 7 lần / 60 giây.`, event.threadID, event.messageID);
}
async function onEvent({ global, event, api, Config, logger, Threads, Users }) {
    const { senderID, messageID, threadID } = event;
    const idad = Config['ADMIN'];
    if (senderID == api.getCurrentUserID()) return;
    if (!global.autoban) global.autoban = {};
    if (!global.autoban[senderID]) {
        global.autoban[senderID] = {
            timeStart: Date.now(),
            number: 0
        }
    };
    const prefix = (await Threads.getData(threadID)).prefix || Config['PREFIX'];
    const idbox = event.threadID;
    if (!event.body || event.body.indexOf(prefix) != 0) return;
    if ((global.autoban[senderID].timeStart + 60000) <= Date.now()) {
        global.autoban[senderID] = {
            timeStart: Date.now(),
            number: 0
        }
    } else {
        const numberSp = 7;
        global.autoban[senderID].number++;
        if (global.autoban[senderID].number >= numberSp) {
            const moment = require("moment-timezone");
            const timeDate = moment.tz("Asia/Ho_Chi_minh").format("HH:mm:ss | DD/MM/YYYY");
            const dataUser = await Users.getData(senderID);
            const namethread = (await Threads.getData(threadID)).name || "Chưa đặt tên";
            const banned = dataUser.banned;
            if (banned.status == true) return;
            var reason = `spambot ${numberSp} lần/60s.`
            var timeNow = Date.now();
            banned.status = true;
            banned.reason = reason;
            banned.time = timeDate;
            await Users.setData(senderID, { banned: banned });
            global.autoban[senderID] = {
                timeStart: timeNow,
                number: 0
            };
            global.userBanned.push(senderID);
            try {
                api.sendMessage(`=== Bot Notification ===\n\n- ${dataUser.name}, Bạn đã bị ban, vui lòng đợi sau 2 giờ để có thể tiếp tục sử dụng bot.\n\n- Lý do: ${reason}`, threadID);
                for (let ad of idad) {
                    api.sendMessage(`=== Bot Notification ===\n\n» Người vi phạm: ${dataUser.name}\n» ID: ${senderID}\n» Box: ${namethread}\n» ID box: ${idbox}\n» Lý do: ${reason}\n\nĐã bị ban khỏi hệ thống`, ad, (error, info) => {
                        if (error) return logger.log(`Có lỗi sảy ra`, "[ Spamban ]");
                    });
                }
            } catch (error) {
                return api.sendMessage(error.stack, threadID, messageID)
            }
        }
    }
}