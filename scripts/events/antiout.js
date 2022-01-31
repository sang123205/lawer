'use strict';
module.exports = {
    config: {
        name: 'antiout',
        ver: '1.0.0',
        author: ['LawerTeam'],
        description: 'Listen events',
        location: __filename
    },
    onMessage: out
}
async function out({ event, api, Users }) {
    if (event.logMessageType == 'log:unsubscribe') {
        const { resolve } = require("path");
        const path = resolve(__dirname, '../', 'cache', 'antiout.json');
        const { antiout } = require(path);
        const { logMessageData, author, threadID } = event;
        const id = logMessageData.leftParticipantFbId;
        if (id == api.getCurrentUserID()) return;
        if (author == id) {
            const name = await Users.getData(id).name || "Facebook users";
            if (antiout.hasOwnProperty(threadID) && antiout[threadID] == true) {
                try {
                    await api.addUserToGroup(id, threadID);
                    return api.sendMessage(` ${name} Cố gắng trốn thoát khỏi nhóm nhưng không thành công và bị bắt lại.`);
                } catch (e) {
                    return api.sendMessage(`Không thể thêm lại ${name} vào nhóm.`, threadID);
                }
            }
        }
        return;
    }
}