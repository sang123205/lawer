'use strict';
module.exports = {
    config: {
        name: 'selflisten',
        ver: '1.0.0',
        role: 2,
        author: ['Lawer Team'],
        description: 'Enable/Disabled selfListen.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ api, event, global, Config, args }) {
    const { writeFileSync, readFileSync } = require("fs-extra");
    const { threadID, senderID, messageID } = event;
    if (senderID != Config.ADMIN.find(item => item == senderID)) return api.sendMessage(`» [Admin] You have no permission to use "selflisten".`, threadID);
    const configPath = global.dirConfig;
    const config = require(configPath);
    const { selfListen } = Config;
    //---> CODE <---//
    if (config.fca_otption.selfListen == false) {
        config.fca_otption.selfListen = true;
        api.sendMessage("» Enable selfListen.", threadID, messageID);
    } else {
        config.fca_otption.selfListen = false;
        api.sendMessage("» Disabled selfListen.", threadID, messageID);
    }
    writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
    return;
}