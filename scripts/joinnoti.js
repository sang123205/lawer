'use strict';
module.exports = {
    config: {
        name: 'joinnoti',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Bật hoặc tắt gửi nhắn chào mừng khi có thành viên mới tham gia nhóm chat của bạn.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, global, Config, message, Threads, Users, args }) {
    const { threadID } = event;
    const data = (await Threads.getData(threadID)).data;

    if (!data.sendWelcomeMessage) {
        data.sendWelcomeMessage = true;
        Threads.setData(threadID, { data: data })
    }

    if (args[0] == "on") data.sendWelcomeMessage = true;
    else if (args[0] == "off") data.sendWelcomeMessage = false;
    else return message.reply(`HD:\n 1. joinnoti on -> Bật chào mừng thành viên mới\n2. joinnoti off -> Tắt chào mừng thành viên mới`);

    Threads.setData(threadID, {
        data
    }, (err, info) => {
        if (err) return message.reply(`Đã xảy ra lỗi, vui lòng thử lại sau`);
        message.reply(`Đã ${data.sendWelcomeMessage ? "bật" : "tắt"} gửi tin nhắn chào mừng khi có thành viên mới tham gia nhóm chat của bạn`);
    });
}