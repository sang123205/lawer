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
    \n★★ Donate Admin ★★
    \n👉Biệt Danh: MạnhG
    \n🔰 STK: 1. ACB: 1819957
    \n🔰 STK: 2. MOMO: 0865983826
    \n🔰 STK: 3. ZALOPAY: 0865983826
    \n🔰 STK: 4. [VISA] CIMB: 00336502180597
    \n🔷 NAME STK: NGUYEN KHAC MANH
    \nHave fun using chat bots <3
    \n❤💖🧡💙🤎💗💕💝💚`,
        event.threadID, event.messageID);
}