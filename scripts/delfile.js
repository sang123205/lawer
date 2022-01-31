'use strict';
module.exports = {
    config: {
        name: 'delfile',
        ver: '1.0.0',
        role: 2,
        author: ['Lawer Team'],
        description: 'Xóa tệp scripts.',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onReply: reply
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
    const fs = require("fs-extra");
    var files = fs.readdirSync(__dirname + "/") || [];
    var msg = "",
        i = 1;
    if (args[0] == 'help') {
        //❎ko edit tên tác giả❎
        var msg = `
Cách dùng lệnh:
•Key: start <text>
•Tác dụng: Lọc ra file cần xóa có ký tự bắt đầu tùy chọn
•Ví dụ:  rank
•Key: ext <text>
•Tác dụng: Lọc ra file cần xóa có đuôi tùy chọn
•Ví dụ:  png
•Key: <text>
•Tác dụng: lọc ra các file trong tên có text tùy chỉnh
•Ví dụ:  a
•Key: để trống
•Tác dụng: lọc ra tất cả các file trong 
•Ví dụ: 
•Key: help
•Tác dụng: xem cách dùng lệnh
•Ví dụ:  help`;

        return api.sendMessage(msg, event.threadID, event.messageID);
    } else if (args[0] == "start" && args[1]) {
        var word = args.slice(1).join(" ");
        var files = files.filter(file => file.startsWith(word));

        if (files.length == 0) return api.sendMessage(`Không có file nào trong  có ký tự bắt đầu bằng: ${word}`, event.threadID, event.messageID);
        var key = `Có ${files.length} file có ký tự bắt đầu là: ${word}`;
    }

    //đuôi file là..... 
    else if (args[0] == "ext" && args[1]) {
        var ext = args[1];
        var files = files.filter(file => file.endsWith(ext));

        if (files.length == 0) return api.sendMessage(`Không có file nào trong  có ký tự kết thúc bằng: ${ext}`, event.threadID, event.messageID);
        var key = `Có ${files.length} file có đuôi là: ${ext}`;
    }
    //all file
    else if (!args[0]) {
        if (files.length == 0) return api.sendMessage(" của bạn không có file hoặc folder nào", event.threadID, event.messageID);
        var key = "Tất cả các file trong thư mục :";
    }
    //trong tên có ký tự.....
    else {
        var word = args.slice(0).join(" ");
        var files = files.filter(file => file.includes(word));
        if (files.length == 0) return api.sendMessage(`Không có file nào trong tên có ký tự: ${word}`, event.threadID, event.messageID);
        var key = `Có ${files.length} file trong tên có ký tự: ${word}`;
    }

    files.forEach(file => {
        var fileOrdir = fs.statSync(__dirname + '/' + file);
        if (fileOrdir.isDirectory() == true) var typef = "[Folder🗂️]";
        if (fileOrdir.isFile() == true) var typef = "[File📄]";
        msg += (i++) + '. ' + typef + ' ' + file + '\n';
    });

    api.sendMessage(`Reply tin nhắn bằng số để xóa file tương ứng, có thể rep nhiều số, cách nhau bằng dấu cách.\n${key}\n\n` + msg, event.threadID, (e, info) => global.reply.push({
        name: "delfile",
        messageID: info.messageID,
        author: event.senderID,
        files
    }))
}
async function reply({ event, api, global, Config, logger, Threads, Users, reply, is }) {
    var { messageID } = event;
    if (event.senderID != reply.author) return;
    const fs = require("fs-extra");
    var arrnum = event.body.split(" ");
    var msg = "";
    var nums = arrnum.map(n => parseInt(n));

    for (let num of nums) {
        var target = reply.files[num - 1];
        var fileOrdir = fs.statSync(__dirname + '/' + target);
        if (fileOrdir.isDirectory() == true) {
            var typef = "[Folder🗂️]";
            fs.rmdirSync(__dirname + '/' + target, { recursive: true });
        } else if (fileOrdir.isFile() == true) {
            var typef = "[File📄]";
            fs.unlinkSync(__dirname + '/' + target);
        }
        msg += typef + ' ' + reply.files[num - 1] + "\n";
    }
    api.unsendMessage(reply.messageID);
    return api.sendMessage("Đã xóa các file sau trong thư mục:\n\n" + msg, event.threadID, event.messageID);
}