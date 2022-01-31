'use strict';
module.exports = {
    config: {
        name: 'ghep',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Ghép đôi ngẫu nhiên với 1 thành viên trong nhóm.',
        location: __filename,
        timestamps: 10
    },
    onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args }) {
    const axios = require('axios')
    const fs = require("fs-extra");
    const request = require("request");
    var tle = Math.floor(Math.random() * 50) + 50
    var dataUsernamee = await Users.getData(event.senderID),
        namee = dataUsernamee.name,
        gender = dataUsernamee.gender;
    const botID = api.getCurrentUserID();
    const listUserID = event.participantIDs.filter(ID => ID != botID && ID != event.senderID);
    var id = listUserID[Math.floor(Math.random() * listUserID.length)];
    var dataUser2, name, gender2;
    dataUser2 = await Users.getData(id);
    name = dataUser2.name;
    gender2 = dataUser2.gender;
    if (gender == gender2 || gender2 == undefined) return api.sendMessage("» Không thể tìm thấy tình yêu của bạn", event.threadID, event.messageID);
    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    try {
        var Avatar = (await axios.get(`https://manhict.tech/facebook/avatar?uid=${event.senderID}&apikey=KeyTest`)).data;
        await new Promise(resolve => setTimeout(resolve, 3000))
        var Avatar2 = (await axios.get(`https://manhict.tech/facebook/avatar?uid=${id}&apikey=KeyTest`)).data;
    } catch (e) {
        console.log(e.stack)
    }
    if (!Avatar) return api.sendMessage("Bạn Ế đi ", event.threadID, event.messageID)
    if (!Avatar2) return api.sendMessage("Bạn vẫn còn Ế dài dài nhé ", event.threadID, event.messageID)
    const getms = (await axios.get(Avatar.result.avatar, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/1.png", Buffer.from(getms, "utf-8"));

    const getms2 = (await axios.get(Avatar2.result.avatar, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + "/cache/2.png", Buffer.from(getms2, "utf-8"));
    var imglove = [];
    imglove.push(fs.createReadStream(__dirname + "/cache/1.png"));
    imglove.push(fs.createReadStream(__dirname + "/cache/2.png"));
    var msg = { body: `Ghép đôi thành công!\nTỷ lệ hợp nhau: ${tle}%\n` + namee + " " + "💓" + " " + name, attachment: imglove }
    return api.sendMessage(msg, event.threadID, event.messageID)
}