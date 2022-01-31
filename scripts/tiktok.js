'use strict';
module.exports = {
    config: {
        name: 'tiktok',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Tải video tiktok no watermark.',
        location: __filename,
        timestamps: 5
    }
};
let API_KEY = "KeyTest"; //Nhập API_Key của bạn ở đây
let timeVD = "0"; //Lọc theo ngày bạn muốn áp dụng cho kết quả. 
//Các giá trị có thể có (mặc định là 0): 0 - mọi lúc; 1 - ngày hôm qua; 7 - tuần này; 30 - tháng; 90 - 3 tháng; 180-6 tháng
let rdus = Math.floor(Math.random() * 99999999999999);
module.exports.onMessage = async function({ event, api, args, global }) {
    const { threadID, messageID } = event;
    const { createReadStream, existsSync, writeFileSync, readdirSync, unlinkSync } = require('fs-extra');
    const axios = require('axios');
    if (args.length == 0 || !args) return api.sendMessage('[Tiktok] Nhập ký tự cần tìm kiếm!', threadID, messageID);
    if (args.join(" ").indexOf("https://") == 0) {
        const linkurl = (args.join(" ")).trim();
        api.sendMessage(`Đang tải, vui lòng đợi...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 20000));
        try {
            var { data } = await axios.get(`https://manhict.tech/v2/tiktokdl?url=${linkurl}&apikey=${API_KEY}`);
            if (data.error) return api.sendMessage(data.error, threadID);
        } catch (e) {
            console.log(e);
            return api.sendMessage('Có lỗi xảy ra!', threadID, messageID);
        }
        let desc = "Video của bạn đây"
        let link = data.nowm;
        var path = __dirname + `/cache/${rdus}.mp4`;
        const getms = await axios.get(link, { responseType: "arraybuffer" });
        writeFileSync(path, Buffer.from(getms.data, "utf-8"))
        await api.sendMessage({ body: desc, attachment: createReadStream(path) }, threadID, () => unlinkSync(path), messageID);
        return;
    } else {
        let results,
            link = [],
            title = [],
            msg = "",
            num = 0,
            time;
        const keywordSearch = encodeURIComponent(args.join(" "));
        try {
            var { data } = (await axios.get(`https://manhict.tech/tiktok/search?query=${keywordSearch}&time=${timeVD}&apikey=${API_KEY}`));
            if (data.error) return api.sendMessage(data.error, threadID);
        } catch (error) {
            return api.sendMessage(error, threadID, messageID);
        }
        results = data.results;
        for (let key of results) {
            link.push(key.video);
            title.push(key.desc);
            var ms = `${key.time}`,
                min = Math.floor((ms / 1000 / 60) < 0),
                sec = Math.floor((ms / 1000) % 60);
            time = min + ':' + sec;
            num = num += 1
            if (num == 1) var num1 = "⓵"
            if (num == 2) var num1 = "⓶"
            if (num == 3) var num1 = "⓷"
            if (num == 4) var num1 = "⓸"
            if (num == 5) var num1 = "⓹"
            if (num == 6) var num1 = "⓺"
            if (num == 7) var num1 = "⓻"
            if (num == 8) var num1 = "⓼"
            if (num == 9) var num1 = "⓽"
            if (num == 10) var num1 = "⓾"
            msg += (`${num1}.《${time}》${key.desc}\n\n`);
        }
        var body = `»🔎 There are ${link.length} results matching your search keyword:\n\n${msg}» Please reply (feedback) choose one of the above searches.`;
        return api.sendMessage({
                body: body
            }, threadID, (error, info) => {
                global.reply.push({
                    name: this.config.name,
                    messageID: info.messageID,
                    author: event.senderID,
                    tikTitle: title,
                    tikLink: link
                })
            },
            messageID);
    }
}
module.exports.onReply = async function({ event, api, reply }) {
    const axios = require('axios')
    const { createReadStream, statSync, existsSync, writeFileSync, readdirSync, unlinkSync } = require('fs-extra')
    const { threadID, body, messageID } = event;

    function number(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 1 || x > 10);
    }
    if (number(body)) return api.sendMessage('Chọn từ 1 -> 10, baby. love uwu ❤️', threadID, messageID);
    api.unsendMessage(reply.messageID);
    api.sendMessage(`Đang tải, vui lòng đợi...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 20000));
    try {
        const title = reply.tikTitle[body - 1];
        const link = reply.tikLink[body - 1];
        var path = __dirname + `/cache/${rdus}.mp4`;
        const getms = await axios.get(link, { responseType: "arraybuffer" });
        writeFileSync(path, Buffer.from(getms.data, "utf-8"))
        const msg = await api.sendMessage({ body: title, attachment: createReadStream(path) }, threadID, () => unlinkSync(path), messageID);
        return msg;
    } catch (e) {
        console.log(e);
        return api.sendMessage(e, threadID, messageID);
    }
}