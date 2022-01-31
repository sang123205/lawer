'use strict';
module.exports = {
    config: {
        name: 'work',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Nếu bạn làm việc, bạn sẽ có tiền :))',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, args, Users, global }) {
    if (!global.working) global.working = new Map();
    const cooldown = 1200000;
    var data = global.working.get(event.senderID);
    if (global.working.has(event.senderID)) {
        var s = data.time;
        if (cooldown - (Date.now() - s) > 0) {
            var time = cooldown - (Date.now() - data.time),
                minutes = Math.floor(time / 60000),
                seconds = ((time % 60000) / 1000).toFixed(0);
            if (minutes < 10) var minutes = '0' + minutes;
            if (seconds < 10) var seconds = '0' + seconds;
            return api.sendMessage('Please wait ' + minutes + ' minutes ' + seconds + ' seconds...', event.threadID, event.messageID);
        }
    } else {
        global.working.set(event.senderID, { time: Date.now() });
        const amount = Math.floor(Math.random() * 1000);
        const money = (await Users.getData(event.senderID)).money;
        return api.sendMessage('- Làm được ' + amount + '$\n- Số tiền hiện tại: ' + (money + amount) + '$', event.threadID, (err, info) => {
            Users.setData(event.senderID, { money: money + amount })
        }, event.messageID);
    }
}