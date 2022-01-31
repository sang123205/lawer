'use strict';
module.exports = {
    config: {
        name: 'github',
        ver: '1.0.0',
        role: 0,
        author: ['MạnhG'],
        description: 'Get thông tin username github.',
        location: __filename,
        timestamps: 5
    }
};

module.exports.onMessage = async({ api, event, args }) => {
    if (!args[0]) return api.sendMessage(`Tên người dùng Github không được để trống!`, event.threadID, event.messageID);
    const moment = require("moment");
    const axios = require("axios");
    const fs = require("fs-extra");

    await axios.get(`https://manhict.tech/info/github?username=${args[0]}&apikey=KeyTest`)
        .then(async body => {
            if (body.message) return api.sendMessage(`User Not Found | Please Give Me A Valid Username!`, event.threadID, event.messageID);
            let { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = body.data.result;
            const info =
                `» ${login} Information!\n\nUsername: ${login}\nID: ${id}\nUrl: github.com/${login}\nBio: ${bio || "No Bio"}\nPublic Repositories: ${public_repos || "None"}\nFollowers: ${followers}\nFollowing: ${following}\nLocation: ${location || "No Location"}\nAccount Created: ${moment.utc(created_at).format("dddd, MMMM, Do YYYY")}`;

            let getimg = (await axios.get(`${avatar_url}`, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(__dirname + "/cache/avatargithub.png", Buffer.from(getimg, "utf-8"));

            return api.sendMessage({
                attachment: fs.createReadStream(__dirname + "/cache/avatargithub.png"),
                body: info
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/avatargithub.png"), event.messageID);
        });
};