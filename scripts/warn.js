'use strict';
module.exports = {
    config: {
        name: 'warn',
        ver: '1.0.0',
        role: 1,
        author: ['MạnhG'],
        description: 'Cảnh báo người dùng!.',
        location: __filename,
        timestamps: 0
    }
};

module.exports.onLoad = function() {
    const { existsSync, writeFileSync } = require("fs-extra");
    const { resolve } = require("path")

    const path = resolve(__dirname, "cache", "listwarning.json");

    if (!existsSync(path)) writeFileSync(path, JSON.stringify({}), 'utf-8');
    return;
}

module.exports.onMessage = async function({ event, api, args, role, Users }) {
        const { existsSync, writeFileSync, readFileSync } = require("fs-extra");
        const { resolve } = require("path")
        const moment = require("moment-timezone");
        const { threadID, messageID, mentions, senderID } = event;
        const mention = Object.keys(mentions);

        const path = resolve(__dirname, "cache", "listwarning.json");
        const dataFile = readFileSync(path, "utf-8");
        var warningData = JSON.parse(dataFile);

        switch (args[0]) {
            case "all":
            case "list":
                {
                    if (role != 2) return api.sendMessage(`Bạn không đủ quyền hạn để có thể sử dụng lệnh này!`, threadID, messageID);
                    var listUser = "";

                    for (const IDUser in warningData) {
                        const name = (await Users.getData(IDUser)).name;
                        listUser += `- ${name}: còn ${warningData[IDUser].warningLeft} lần cảnh báo\n`;
                    }
                    if (listUser.length == 0) listUser = "Hiện tại chưa có người dùng nào bị cảnh cáo";
                    return api.sendMessage(listUser, threadID, messageID);
                }
            case "reset":
                {
                    writeFileSync(path, JSON.stringify({}), 'utf-8');
                    return api.sendMessage("Đã reset lại toàn bộ list warn!", threadID, messageID);
                }
            default:
                {
                    if (role != 2) {
                        const data = warningData[args[0] || mention[0] || senderID];
                        console.log(data);
                        const name = (await Users.getData(args[0] || mention[0] || senderID)).name;
                        if (!data) return api.sendMessage(`Hiện tại ${name} không có bất cứ lời cảnh báo nào!`, threadID, messageID);
                        else {
                            var reason = "";
                            for (const n of data.warningReason) reason += `- ${n}\n`;
                            return api.sendMessage(`Hiện tại ${name} còn lại ${data.warningLeft} lần cảnh cáo:\n\n${reason}`, threadID, messageID);
                        }
                    } else {
                        try {
                            if (event.type != "message_reply") return api.sendMessage("Bạn chưa reply tin nhắn cần cảnh báo.", threadID, messageID);
                            if (event.messageReply.senderID == api.getCurrentUserID()) return api.sendMessage('Không thể cảnh báo tới tài khoản bot.', threadID, messageID);
                            if (args.length == 0) return api.sendMessage("Bạn chưa nhập lý do cảnh báo!", threadID, messageID);
                            var data = warningData[event.messageReply.senderID] || { "warningLeft": 3, "warningReason": [], "banned": false };
                            if (data.banned) return api.sendMessage("Tài khoản trên đã bị ban do đã bị cảnh cáo 3 lần!", threadID, messageID);
                            const name = (await Users.getData(event.messageReply.senderID)).name;
                            data.warningLeft -= 1;
                            data.warningReason.push(args.join(" "));
                            if (data.warningLeft == 0) data.banned = true;
                            warningData[event.messageReply.senderID] = data;
                            writeFileSync(path, JSON.stringify(warningData, null, 4), "utf-8");
                            if (data.banned) {
                                const data = (await Users.getData(event.messageReply.senderID)).banned || {};
                                data.status = true;
                                data.reason = `${args.join(" ")}`;
                                data.time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss | DD/MM/YYYY")
                                await Users.setData(event.messageReply.senderID, { banned: data });
                            }
                            return api.sendMessage(`Đã cảnh báo ${name} với lý do: ${args.join(" ")}, ${(data.banned) ? `bởi vì đã bị cảnh báo 3 lần nên tài khoản trên đã bị ban` : `tài khoản trên còn ${data.warningLeft} lượt cảnh báo!`}`, threadID, messageID);
                } catch (e) { return console.log(e) };
            }
        }
    }
}