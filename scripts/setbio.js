'use strict';
module.exports = {
  config: {
    name: 'setbio',
    ver: '1.0.0',
    role: 2,
    author: ['Lawer Team'],
    description: 'Thay đổi hồ sơ tiểu sử bot.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  api.changeBio(`${args.join(" ")}`);
	  return api.sendMessage(`Change bio bot profile to:\n${args.join(" ")}`, event.threadID);
}
