'use strict';

module.exports = {
    config: {
        name: 'dhbc',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Đuổi hình bắt chữ',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onReply: reply
};
async function out({ event, api, global, Users, is }) {
    const axios = require('axios')
    const fs = require("fs-extra");
    const request = require("request");
    const { data } = await axios.get(`https://manhict.tech/game/dhbcv1`);
    const answer = data.tukhoa;
    const suggestions = data.suggestions;
    const questionIMG = data.link;

    let DownquestionIMG = (await axios.get(questionIMG, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/cache/${event.senderID}.png`, Buffer.from(DownquestionIMG, "utf-8"));
    var imgPush = [];
    imgPush.push(fs.createReadStream(__dirname + `/cache/${event.senderID}.png`));
    var name = (await Users.getData(event.senderID)).name
    return api.sendMessage({
        attachment: imgPush,
        body: `» Câu hỏi dành cho: ${name}\n» Reply tin nhắn này để trả lời:\nGợi ý: ${answer.replace(/\S/g, "█ ")}`
    }, event.threadID, (error, info) => {
        global.reply.push({
            name: "dhbc",
            messageID: info.messageID,
            author: event.senderID,
            answer,
            suggestions
        })
    }, event.messageID)
}

async function reply({ event, api, reply }) {
    const { answer, author, suggestions } = reply
    const fs = require("fs-extra");
    if (event.senderID != author) return
    if ((event.body).toLowerCase() == `gợi ý`) { return api.sendMessage(suggestions, event.threadID, event.messageID) } else if ((event.body).toLowerCase() == answer) {
        api.unsendMessage(reply.messageID)
        var msg = { body: `» Chúc mừng, bạn đã trả lời đúng\n» Đáp án: ${answer}` }
        return api.sendMessage(msg, event.threadID, event.messageID)
    } else
        api.unsendMessage(reply.messageID)
    var msg = { body: `» Bạn trả lời sai rồi\n» Đán án: ${answer}` }
    return api.sendMessage(msg, event.threadID, event.messageID)
}