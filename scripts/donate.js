'use strict';
module.exports = {
    config: {
        name: 'donate',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Donate cho admin!',
        location: __filename,
        timestamps: 5
    }
}
module.exports.onMessage = async({ event, api }) => {
    return api.sendMessage(`
    \nββ Donate Admin ββ
    \nπBiα»t Danh: MαΊ‘nhG
    \nπ° STK: 1. ACB: 1819957
    \nπ° STK: 2. MOMO: 0865983826
    \nπ° STK: 3. ZALOPAY: 0865983826
    \nπ° STK: 4. [VISA] CIMB: 00336502180597
    \nπ· NAME STK: NGUYEN KHAC MANH
    \nHave fun using chat bots <3
    \nβ€ππ§‘ππ€ππππ`,
        event.threadID, event.messageID);
}