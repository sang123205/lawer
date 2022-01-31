"use strict";

const config = {
    name: 'reload',
    role: 3,
    version: '1.0.0',
    author: 'DuyVuong',
};

function LOAD({ global, Config, logger, getText, Threads, Users }) {
    try {
        const obj = {};
        obj.global = global;
        obj.config = Config;
        obj.logger = logger;
        obj.getText = getText;
        obj.Threads = Threads;
        obj.Users = Users;
        const { commands, events } = require('../loading.js');
        global.scripts = new Array();
        global.events = new Array();
        commands(obj);
        events(obj);
        logger.load('DONE SUCCESS RELOAD SCRIPTS AND EVENTS', 'reload');
        return { fail: false };
    } catch (err) {
        logger.error(err, 'reload');
        return { fail: true, error: err };
    }
}

function onMessage({ api, event, Config, logger, global, getText, Threads, Users }) {
    try {
        const obj = {};
        obj.global = global;
        obj.config = Config;
        obj.logger = logger;
        obj.getText = getText;
        obj.Threads = Threads;
        obj.Users = Users;
        let s = LOAD(obj);
        if (s.fail == false) {
            return api.sendMessage('Tải lại dữ liệu thành công!', event.threadID, event.messageID);
        }
    } catch (ex) {
        return api.sendMessage(ex.stack, event.threadID, event.messageID);
    }
}

module.exports = {
    config,
    onMessage
}