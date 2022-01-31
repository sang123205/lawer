'use strict';
module.exports = {
  config: {
    name: 'antiout',
    ver: '1.0.0',
    role: 1,
    author: ['Lawer Team'],
    description: 'Tự động thêm lại thành viên ra khỏi chùa | Không chắc liệu bạn có thể thêm tất cả chúng hay không.',
    location: __filename,
    timestamps: 5
  }
}
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'antiout.json');
    if (!existsSync(path)) {
        const obj = {
            antiout: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('antiout')) data.antiout = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
module.exports.onMessage = async function({ api, event }) {
    const { writeFileSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'antiout.json');
    const { threadID, messageID } = event;
    const database = require(path);
    const { antiout } = database;
    var { adminIDs } = await api.getThreadInfo(event.threadID);    
        adminIDs = adminIDs.map(e => e.id).some(e => e == api.getCurrentUserID());
        if (!adminIDs) {return api.sendMessage("» Vui lòng cấp các quyền quản trị viên cho bot trên nhóm này.", threadID)}
    if (antiout[threadID] == true) {
        antiout[threadID] = false;
        api.sendMessage("» Đã tắt chế độ chống out chùa.", threadID, messageID);
    } else {
        antiout[threadID] = true;
        api.sendMessage("» Chế độ chống out chùa được bật.\nNghiêm cấm hành vi quấy rối.", threadID, messageID);
    }
    writeFileSync(path, JSON.stringify(database, null, 4));
}