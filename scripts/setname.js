'use strict';
module.exports = {
  config: {
    name: 'setname',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Set biệt danh cho thành viên.',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {

  switch (args[0]) {
    case "all":
      {
        var idtv = event.participantIDs;
        if (idtv != api.getCurrentUserID()) {
          const name = args.slice(1).join(" ");
          function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
          };
          for (let setname of idtv) {
            await delay(3000)
            api.changeNickname(`${name}`, event.threadID, setname);
          }
        }
      }
      break;

    default:
      {
        const name = args.join(" ")
        const mention = Object.keys(event.mentions)[0];
        if (event.type == "message_reply") { return api.changeNickname(`${name}`, event.threadID, event.messageReply.senderID) }
        if (!mention && event.type != "message_reply") return api.changeNickname(`${name}`, event.threadID, event.senderID);
        if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
      }
      break;
  }
}