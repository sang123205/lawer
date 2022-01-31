'use strict';
module.exports = {
    config: {
        name: 'goibot',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Call bots.',
        location: __filename,
        timestamps: 5
    },
    onEvent: onEvent
};
async function onEvent({ event, api, Config, global, Threads, Users, is }) {
    var { threadID, messageID, body, senderID, isGroup } = event;
    if (senderID == api.getCurrentUserID() && isGroup && isNaN(senderID) && isNaN(threadID)) return;

    function out(data) {
        api.sendMessage(data, threadID, messageID)
    }
    try {
        if (global.allUserID.find(e => e == senderID)) {
            let name = (await Users.getData(senderID)).name;
            if (!name) return;
            var tl = [
                "Love you <3", "You are the cutest bot <3", "Hi, hello baby wife :3", "What's wrong with the wife calling?",
                "Yes, I'm here, call me if I love you <3. hmm...",
                `${name}` + ", use callad to contact admin!",
                `${name}` + ", What's wrong with calling me?",
                `${name}` + ", love you don't call",
                `${name}` + ", i love you ❤",
                `${name}` + ", love each other?",
                `${name}` + ", do you love me ❤",
                `${name}` + ", yes I'm here :3",
                `${name}` + ", love admin bot then call",
                `${name}` + ", love you ❤",
                `${name}` + ", Can you donate to me?",
                `${name}` + ", I'm here"
            ];
            var rand = tl[Math.floor(Math.random() * tl.length)];
            // Gọi bot
            var arr = ["bot", "bot ơi", "bot oi", "yêu bot", "bot đâu"];
            arr.forEach(value => {
                let str = value[0].toUpperCase() + value.slice(1);
                if (body === value.toUpperCase() | body === value | str === body) {
                    return out(rand)
                }
            });
        }
    } catch (err) {
        return;
    }
}