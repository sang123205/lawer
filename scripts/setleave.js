'use strict';
module.exports = {
    config: {
        name: 'setleave',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Chỉnh sửa nội dung tin nhắn tạm biệt thành viên rời khỏi nhóm chat của bạn.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, global, Config, message, Threads, Users, args}) {
    const fs = require("fs-extra");
    const { threadID } = event;
    const data = (await Threads.getData(threadID)).data;

    if (args[0] == "text") {
        if (!args[1]) return message.reply("Vui lùng nhập nội dung tin nhắn");
        else if (args[1] == "reset") data.leaveMessage = null;
        else data.leaveMessage = args.slice(1).join(" ");
    } else if (args[0] == "file") {
        if (args[1] == "reset") {
            try {
                fs.unlinkSync(__dirname + "/../events/src/mediaLeave/" + data.leaveAttachment);
            } catch (e) {}
            data.leaveAttachment = null;
        } else if (!event.messageReply || event.messageReply.attachments.length == 0) return message.reply("Vui lòng reply (phản hồi) một tin nhắn có chứa file ảnh/video/audio");
        else {
            const attachments = event.messageReply.attachments;
            const typeFile = attachments[0].type;
            const ext = typeFile == "audio" ? ".mp3" :
                typeFile == "video" ? ".mp4" :
                typeFile == "photo" ? ".png" :
                typeFile == "animated_image" ? ".gif" : "";
            const fileName = "leave" + threadID + ext;
            await download(attachments[0].url, __dirname + "/../events/src/mediaLeave/" + fileName);
            data.leaveAttachment = fileName;
        }
    } else return message.reply(`Sai cú pháp!`);

    await Threads.saveData(threadID, {
        data
    }, (err, info) => {
        if (err) return message.reply(`Đã xảy ra lỗi, vui lòng thử lại sau!`);
        message.reply(`Đã lưu thay đổi của bạn`);
    });

}