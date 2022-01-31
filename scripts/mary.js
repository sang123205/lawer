'use strict';
module.exports = {
  config: {
    name: 'mary',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Kết hôn.',
    location: __filename,
    timestamps: 5
  }
};
module.exports.onLoad = async function ({ global, Config, logger, is, utils }) {
    const { resolve } = require("path");
    const { existsSync, mkdirSync } = require("fs-extra");
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'marrywi.png');
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/4ATHG80.png", path);
}

async function makeImage({ one, two }) {
    const fs = require("fs-extra");
    const path = require("path");
    const axios = require("axios");
    const jimp = require("jimp");
    const __root = path.resolve(__dirname, "cache", "canvas");

    let batgiam_img = await jimp.read(__root + "/marrywi.png");
    let pathImg = __root + `/batman${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;

    try {
        let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

        let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    } catch (error) {
       return;
    }

    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    batgiam_img.resize(432, 280).composite(circleOne.resize(60, 60), 200, 23).composite(circleTwo.resize(60, 60), 136, 40);

    let raw = await batgiam_img.getBufferAsync("image/png");

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}
async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.onMessage = async function({ event, api, args }) {
    const fs = require("fs-extra");
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    if (!mention[0]) return api.sendMessage("» Please tag 1 person.", threadID, messageID);
    else {
        const one = senderID,
            two = mention[0];
        return makeImage({ one, two }).then(path => api.sendMessage({ body: "» Dog rice is so delicious: 0. Wish you two happiness😡", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
    }
}