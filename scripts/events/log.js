'use strict';
module.exports = {
    config: {
        name: 'log',
        ver: '1.0.0',
        author: ['LawerTeam'],
        description: 'Ghi lại thông báo các hoạt đông của bot!',
        location: __filename
    },
    onMessage: out
};
async function out({ event, api, Config, logger, Threads, Users, is }) {
    if (Config.logs != true) return;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss | DD/MM/YYYY");
    try {
        let botID = api.getCurrentUserID();
        const nameThread = (await Threads.getData(event.threadID)).name || "Chưa đặt tên";
        const nameUser = (await Users.getData(event.author)).name;

        var formReport = "=== Bot Notification ===" +
            "\n\n» Box: " + nameThread +
            "\n» Thread ID: " + event.threadID +
            "\n» Tên người dùng: " + nameUser +
            "\n» UserID: " + event.author +
            "\n\n🤷‍♀️Hành động: {task}" +

            "\n\n⏰Time: " + time + "",
            task = "";
        switch (event.logMessageType) {
            case "log:thread-name":
                {
                    const newName = event.logMessageData.name || "Chưa đặt tên";
                    //task = "Người dùng thay đổi tên nhóm thành " + newName + "";
                    await Threads.setData(event.threadID, { name: newName });
                    break;
                }
            case "log:subscribe":
                {
                    if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) {
                        task = "Người dùng đã thêm bot vào một nhóm mới!";
                        await Threads.setData(event.threadID, { status: true });
                    }
                    break;
                }
            case "log:unsubscribe":
                {
                    if (event.logMessageData.leftParticipantFbId == botID) {
                        task = "Người dùng đã kick bot ra khỏi nhóm!";
                        await Threads.setData(event.threadID, { status: false });
                    }
                    break;
                }
            default:
                break;
        }

        if (task.length == 0) return;
        formReport = formReport
            .replace(/\{task}/g, task);

        return api.sendMessage(formReport, Config.admin[0], (error, info) => {
            if (error) return logger.log(formReport, "[ Logging Event ]");
        });
    } catch (e) {}
}