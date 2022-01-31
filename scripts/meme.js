'use strict';
module.exports = {
  config: {
    name: 'meme',
    ver: '1.0.0',
    role: 0,
    author: ['ManhG'],
    description: 'Random ảnh chế :D.',
    location: __filename,
    timestamps: 5
  }
};
module.exports.onMessage = ({ event, api, global }) => {
    const { createReadStream, unlinkSync } = require("fs-extra");
    const request = require('request')
	const { join } = require('path')
    return request("https://meme-api.herokuapp.com/gimme/memes", async (err, response, body) => {
        if (err) throw err;
        var content = JSON.parse(body);
		const path = join(__dirname, "cache", `${event.threadID}-${event.senderID}-meme.jpg`);
		await global.utils.downloadFile(content.url, path);
		api.sendMessage({body: `${content.title}`, attachment: createReadStream(path)}, event.threadID, () => unlinkSync(path), event.messageID);
    });
}