'use strict';
module.exports = {
    config: {
        name: 'csgo',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Câu hỏi dành cho người chơi csgo.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out,
    onReply: reply
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    const axios = require('axios')
    const fs = require("fs-extra");
    const res = await axios.get(`https://ginxkin-api.herokuapp.com/api/csgo_quiz/random`);
    const linkGun = res.data.link;
    const bodyy = res.data.body;
    const imgthumnail = [];
    const getIMG = (await axios.get(`${linkGun}`, {
        responseType: "arraybuffer"
    })).data;
    fs.writeFileSync(__dirname + `/cache/${event.senderID}-csgo.png`, Buffer.from(getIMG, "utf-8"));
    imgthumnail.push(fs.createReadStream(__dirname + `/cache/${event.senderID}-csgo.png`));
    return api.sendMessage({
            attachment: imgthumnail,
            body: bodyy
        }, event.threadID, (error, info) => {
            global.reply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                answer: res.data.answer
            })
        },
        event.messageID);
}
async function reply({ event, api, global, Config, logger, Threads, Users, reply, is }) {
    const fs = require("fs-extra");
    const { answer, messageID } = reply;
    const answerUser = (event.body).toUpperCase()
    if (answerUser != "A" && answerUser != "B" && answerUser != "C") return
    if (answerUser == answer) {
        api.unsendMessage(messageID)
        return api.sendMessage(`Congratulations, you got the answer right, the answer is: ${answer}`, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${event.senderID}-csgo.png`), event.messageID);
    } else
        api.unsendMessage(messageID)
    return api.sendMessage(`Sorry, your answer is wrong, the answer is: ${answer}`, event.threadID, event.messageID)
}