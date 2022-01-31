'use strict';
module.exports = {
    config: {
        name: 'leavenoti',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Bật hoặc tắt gửi nhắn tạm biệt khi có thành viên out hoặc bị kick khỏi nhóm bạn.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, global, Config, message, Threads, Users, args, body, is }) {
    const { threadID } = event;
    const data = (await Threads.getData(threadID)).data;

    if (!data.sendLeaveMessage) {
        data.sendLeaveMessage = true;
        await Threads.setData(threadID, { data: data });
    }

    if (args[0] == "on") data.sendLeaveMessage = true;
    else if (args[0] == "off") data.sendLeaveMessage = false;
    else return message.reply(`HD:\n 1. leavenoti on -> Bật tạm biệt thành viên\n2. leavenoti off -> Tắt tạm biệt thành viên`);

    await Threads.setData(threadID, {
        data
    }, (err, info) => {
        if (err) return message.reply(`Đã xảy ra lỗi, vui lòng thử lại sau`);
        message.reply(`Đã ${data.sendWelcomeMessage ? "bật" : "tắt"} gửi tin nhắn tạm biệt khi có thành viên out hoặc bị kick khỏi nhóm bạn`);
    });
}