'use strict';
module.exports = {
    config: {
        name: 'fast',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Xem tốc độ mạng.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out
};

async function out({ event, api }) {
    try {
        const fast = require("fast-speedtest-api");
        const speedTest = new fast({
            token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
            verbose: false,
            timeout: 10000,
            https: true,
            urlCount: 5,
            bufferSize: 8,
            unit: fast.UNITS.Mbps
        });
        const resault = await speedTest.getSpeed();
        return api.sendMessage(
            "=== Result ===" +
            "\n- Speed: " + resault + " Mbps",
            event.threadID, event.messageID
        );
    } catch {
        return api.sendMessage("Không thể speedtest ngay lúc này, hãy thử lại sau!", event.threadID, event.messageID);
    }
}