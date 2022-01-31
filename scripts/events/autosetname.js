'use strict';
module.exports = {
  config: {
    name: 'autosetname',
    ver: '1.0.0',
    author: ['LawerTeam'],
    description: 'Notice of leaving the group',
    location: __filename
  },
  onMessage: out
};
async function out({ event, api, Config, logger, Threads, Users, is }) {
  const { threadID } = event;
  if (event.logMessageType == 'log:subscribe') {
    var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId)
    for (let idUser of memJoin) {
      const { readFileSync, writeFileSync } = require("fs-extra")
      const { join } = require("path")
      const pathData = join("./scripts", "cache", "autosetname.json");
      var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
      var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
      if (thisThread.nameUser.length == 0) return;
      if (thisThread.nameUser.length != 0) {
        var setName = thisThread.nameUser[0]
        await new Promise(resolve => setTimeout(resolve, 1000));
        var namee1 = await api.getUserInfo(idUser)
        var namee = namee1[idUser].name
        api.changeNickname(`${setName} ${namee}`, threadID, idUser);
        api.sendMessage(`Đã set biệt danh tạm thời cho ${namee}`, threadID, event.messageID)
      }
    }
  }
  else return;
}