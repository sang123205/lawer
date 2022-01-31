"use strict";

const config = {
    name: 'run',
    role: 2,
    version: '1.0.0',
    author: 'MạnhG',
    description: 'run code.'
};

async function onMessage({ event, api, global, Config, logger, Threads, Users, args }) {
    if (event.senderID != Config.ADMIN[0]) return api.sendMessage("» [Admin] You are not allowed to use this command", event.threadID, event.messageID);
    const { threadID, senderID, messageID } = event;
    const out = function(a) {
        if (typeof a === "object" || typeof a === "array") {
            if (Object.keys(a).length != 0) a = JSON.stringify(a, null, 4);
            else a = "done";
        }

        if (typeof a === "number") a = a.toString();
        return api.sendMessage(a, threadID, messageID);
    }
    try {
        const botID = api.getCurrentUserID();
        const response = await eval(args.join(" "), { event, api, global, Config, logger, Threads, Users, botID, args, threadID }, true);
        return out(response);
    } catch (e) { return out(e) };
}

module.exports = {
    config,
    onMessage
}