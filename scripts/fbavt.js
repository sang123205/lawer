'use strict';
module.exports = {
    config: {
        name: 'fbavt',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Xem hình ảnh avt của người dùng.',
        location: __filename,
        timestamps: 5
    }
};
module.exports.onMessage = async function({ api, event, args, is, Users, Threads, Config }) {
    const request = require("request")
    const fs = require("fs-extra")
    var prefix = (await Threads.getData(event.threadID)).prefix || Config.prefix;
    if (args.length == 0) return api.sendMessage(`» User manual:\n\n1. ${prefix}${is.config.name} user => nó sẽ nhận được avt của riêng bạn.\n2. ${prefix}${is.config.name} user @ [Tag] => nó sẽ lấy avt của người bạn gắn thẻ.\n3. ${prefix}${is.config.name} box => nó sẽ nhận được hộp avt của bạn\n4. ${prefix}${is.config.name} user box tid] nó sẽ nhận được trung bình của tid`, event.threadID, event.messageID);
    if ((args[0] == "box") || (args[0] == "-t")) {
        if (args[1]) {
            let threadInfo = await Threads.getData(args[1]);
            let imgg = threadInfo.avatarbox;
            if (!imgg) api.sendMessage(`The box's avatar ${threadInfo.name} is here`, event.threadID, event.messageID);
            else var callback = () => api.sendMessage({ body: `» Avatar box ${threadInfo.threadName} here`, attachment: fs.createReadStream(__dirname + "/cache/fbavt.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/fbavt.png"), event.messageID);
            return request(encodeURI(`${threadInfo.avatarbox}`)).pipe(fs.createWriteStream(__dirname + '/cache/fbavt.png')).on('close', () => callback());
        }

        let threadInfo = await Threads.getData(event.threadID);
        let img = threadInfo.avatarbox;
        if (!img) api.sendMessage(`The box's avatar ${threadInfo.name} is here`, event.threadID, event.messageID)
        else var callback = () => api.sendMessage({ body: `» Avatar box ${threadInfo.name} here`, attachment: fs.createReadStream(__dirname + "/cache/fbavt.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/fbavt.png"), event.messageID);
        return request(encodeURI(`${threadInfo.avatarbox}`)).pipe(fs.createWriteStream(__dirname + '/cache/fbavt.png')).on('close', () => callback());
    };

    if ((args[0] == "user") || (args[0] == "-u")) {
        if (!args[1]) {
            var id;
            if (event.type == "message_reply") id = event.messageReply.senderID
            else id = event.senderID;
            var callback = () => api.sendMessage({ body: `» Here's your avatar`, attachment: fs.createReadStream(__dirname + "/cache/fbavt.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/fbavt.png"), event.messageID);
            return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`)).pipe(fs.createWriteStream(__dirname + '/cache/fbavt.png')).on('close', () => callback());
        } else {
            if (args.join().indexOf('@') !== -1) {
                var mention = Object.keys(event.mentions)
                let name = await event.mentions[mention].replace(/@/g, "");
                var callback = () => api.sendMessage({ body: `» Here's ${name} avatar`, attachment: fs.createReadStream(__dirname + "/cache/fbavt.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/fbavt.png"), event.messageID);
                return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`)).pipe(fs.createWriteStream(__dirname + '/cache/fbavt.png')).on('close', () => callback());
            } else {
                let name = (await Users.getData(args[1])).name;
                var callback = () => api.sendMessage({ body: `» Here's ${name} avatar`, attachment: fs.createReadStream(__dirname + "/cache/fbavt.png") }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/fbavt.png"), event.messageID);
                return request(encodeURI(`https://graph.facebook.com/${args[1]}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`)).pipe(fs.createWriteStream(__dirname + '/cache/fbavt.png')).on('close', () => callback());
            }
        }
    }
}