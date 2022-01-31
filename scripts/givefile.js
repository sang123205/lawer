'use strict';
module.exports = {
    config: {
        name: 'givefile',
        ver: '1.0.0',
        role: 3,
        author: ['Lawer Team'],
        description: 'Gửi txt file.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    const fs = require("fs-extra");
    var path = [],
        pathrn = [],
        pathrntxt = [];
    var msg = '';
    var notfound = "";
    if (event.senderID != Config.ADMIN[0]) return api.sendMessage("» You are not allowed to use this command", event.threadID, event.messageID);
    if (args.length == 0) return api.sendMessage("» Missing data!", event.threadID, event.messageID);
    for (let file of args) {
        if (!fs.existsSync(__dirname + "/" + file)) {
            notfound += '» File not found: ' + file;
            continue;
        };
        if (file.endsWith('.js')) {
            fs.copyFile(__dirname + '/' + file, __dirname + '/' + file.replace(".js", ".txt"));
            pathrn.push(
                fs.createReadStream(__dirname + '/' + file.replace('.js', '.txt'))
            );
            pathrntxt.push(file.replace('.js', '.txt'));
        } else if (file.endsWith('.txt')) {
            path.push(fs.createReadStream(__dirname + '/' + file));
        } else return;
    }
    var mainpath = [...path, ...pathrn];
    if (pathrn.length != 0)
        msg += `» Previews: ${args[0]}`;
    api.sendMessage({ body: msg + "\n" + notfound, attachment: mainpath }, event.threadID);
    if (pathrntxt) {
        pathrntxt.forEach(file => {
            setTimeout(() => { fs.unlinkSync(__dirname + '/' + file); }, 3000)
        });
    } else return;
}