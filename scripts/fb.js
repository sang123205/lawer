'use strict';
module.exports = {
    config: {
        name: 'fb',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Tải xuống video bằng liên kết Facebook.',
        location: __filename,
        timestamps: 5,
        envConfig: {
            API_KEY: "KeyTest" //Nhập API_Key của bạn ở đây hoặc file config.json
        }
    }
};
var getLink = "https://manhict.tech/fbvideo/v2?url=";
var numberSize = 52000000;
var sizeN = "50MB";
var rdPath = Math.floor(Math.random() * 99999999999);
module.exports.onMessage = async function({ event, api, args, global }) {
    const { threadID, messageID } = event;
    const axios = require("axios");
    const fs = require("fs-extra");
    const { API_KEY } = global.envConfig(this.config.name);
    if (!args.join(" ").indexOf("https://") == 0) { return api.sendMessage("Bạn phải nhập url video FB !", threadID, messageID); }
    api.sendMessage(`Đang tải, vui lòng đợi...`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 20000));
    const linkurl = (args.join(" ")).trim();
    try {
        let { data } = await axios.get(`${getLink}${linkurl}&apikey=${API_KEY}`);
        if (data.error) return api.sendMessage(data.error, threadID);
        let desc = data.data.title;
        let link = data.data.medias[1].url;
        let linkSD = data.data.medias[0].url;
        var shortLink = await require("tinyurl").shorten(link);
        var path = __dirname + `/cache/${rdPath}.mp4`;
        const getms = (await axios.get(link, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(path, Buffer.from(getms, "utf-8"));
        if (fs.statSync(path).size > numberSize) {
            api.sendMessage(`Link Tải Full HD: ${shortLink}\n\nKhông thể gửi video chất lượng HD vì dung lượng lớn hơn ${sizeN}\n\nTiến hành tải video có chất lượng SD...`, threadID, () => fs.unlinkSync(path), messageID);
            const getms = (await axios.get(linkSD, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(path, Buffer.from(getms, "utf-8"));
            const msg = await api.sendMessage({ body: desc, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
            return msg;
        } else {
            api.sendMessage(`Tiến hành gửi video Full HD...\n\nGửi được hay không tuỳ video vch:))`, threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 35000));
            const msg = await api.sendMessage({ body: `Link Tải Full HD: ${shortLink}`, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID);
            return msg;
        }
    } catch (e) {
        return api.sendMessage('Không thể xử lý yêu cầu của bạn!!!', threadID, messageID);
    }
}