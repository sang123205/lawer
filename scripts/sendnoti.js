'use strict';
module.exports = {
    config: {
        name: 'sendnoti',
        ver: '1.0.0',
        role: 2,
        author: ['Lawer Team'],
        description: 'Gửi thông báo đến tất cả các nhóm',
        location: __filename,
        timestamps: 0
    },
    onMessage: out
};

async function out({ event, api, global, Config, args, body, is }) {
    if (event.senderID != Config.ADMIN[0]) return api.sendMessage(`Quyền lồn biên giới!`, event.threadID, event.messageID)
    const request = require("request")
    const fs = require('fs')
    const axios = require('axios')
    if (event.type == "message_reply") {
        var linkDownload = event.messageReply.attachments[0].url;
        if (linkDownload.indexOf(".png") !== -1) var ext = ".png"
        if (linkDownload.indexOf(".mp4") !== -1) var ext = ".mp4"
        if (linkDownload.indexOf(".jpg") !== -1) var ext = ".jpg"
        if (linkDownload.indexOf(".gif") !== -1) var ext = ".gif"
        var pathIMG = (__dirname + `/cache/${event.senderID}.${ext}`);
        let getdata = await axios.get(linkDownload, { responseType: 'arraybuffer' });
        fs.writeFileSync(pathIMG, Buffer.from(getdata.data, 'utf-8'));


        var inbox = await api.getThreadList(100, null, ['INBOX']);
        let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
        var count = 1,
            cantSend = [];
        for (var groupInfo of list) {
            var msg = args.join(` `)
            var linedown = "\n"
            msg = msg.replace(/\\n/g, linedown);
            api.sendMessage({ body: `》 𝙁𝙧𝙤𝙢 𝘼𝙙𝙢𝙞𝙣 《\n\n${msg}`, attachment: fs.createReadStream(pathIMG) }, groupInfo.threadID, (error, info) => {
                if (error) cantSend.push(groupInfo.threadID);
            });
            count++;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return api.sendMessage(`Đã gửi thông báo thành công đến ${count} nhóm`, event.threadID, () =>
            (cantSend.length > 0) ? api.sendMessage(`Gửi thông báo thất bại đến ${cantSend.length} nhóm`,
                event.threadID, event.messageID) : "", event.messageID);
    } else {
        var inbox = await api.getThreadList(100, null, ['INBOX']);
        let list = [...inbox].filter(group => group.isSubscribed && group.isGroup);
        var count = 1,
            cantSend = [];
        for (var groupInfo of list) {
            var msg = args.join(` `)
            var linedown = "\n"
            msg = msg.replace(/\\n/g, linedown);
            api.sendMessage({ body: `》 𝙁𝙧𝙤𝙢 𝘼𝙙𝙢𝙞𝙣 《\n\n${msg}` }, groupInfo.threadID, (error, info) => {
                if (error) cantSend.push(groupInfo.threadID);
            });
            count++;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return api.sendMessage(`Đã gửi thông báo thành công đến ${count} nhóm`, event.threadID, () =>
            (cantSend.length > 0) ? api.sendMessage(`Gửi thông báo thất bại đến ${cantSend.length} nhóm`,
                event.threadID, event.messageID) : "", event.messageID);
    }
}