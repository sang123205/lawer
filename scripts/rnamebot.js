'use strict';
module.exports = {
    config: {
        name: 'rnamebot',
        ver: '1.0.0',
        role: 2,
        author: ['Lawer Team'],
        description: 'Đổi biệt danh của bot ở toàn bộ bot!',
        location: __filename,
        timestamps: 5
    }
}
module.exports.onMessage = async({ event, api, args, Threads, Config }) => {
    const custom = args.join(" "),
        allThread = await Threads.getKey(["id", "status"]),
        idBot = api.getCurrentUserID();
    var threadError = [],
        count = 0;
    api.sendMessage("Đang xử lý yêu cầu của bạn!", event.threadID, (err, info) =>
        setTimeout(() => { api.unsendMessage(info.messageID) }, 10000));
    if (custom.length != 0) {
        for (const idThread of allThread) {
            if (idThread.status == true) {
                api.changeNickname(custom, idThread.threadID, idBot, (err) => (err) ? threadError.push(idThread.threadID) : '');
                count += 1;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        return api.sendMessage(`Đã đổi tên thành công cho ${count} nhóm`, event.threadID, () => {
            if (threadError != 0) return api.sendMessage("[!] Không thể đổi tên tại" + threadError.lenght + " Nhóm", event.threadID, event.messageID)
        }, event.messageID);
    } else {
        for (const idThread of allThread) {
            if (idThread.status == true) {
                const prefix = (await Threads.getaData(idThread)).prefix || Config.PREFIX;
                api.changeNickname(`[ ${prefix} ] • ${(!Config.NAME) ? "LawerBot" : Config.NAME}`, idThread.threadID, idBot, (err) => (err) ? threadError.push(idThread.threadID) : '');
                count += 1;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        return api.sendMessage(`Đã đổi tên thành công cho ${count} nhóm`, event.threadID, () => {
            if (threadError != 0) return api.sendMessage("[!] Không thể đổi tên tại " + threadError.length + " Nhóm", event.threadID, event.messageID)
        }, event.messageID);
    }
}