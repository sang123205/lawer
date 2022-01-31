'use strict';
module.exports = {
  config: {
    name: 'fbuser',
    ver: '1.0.0',
    role: 1,
    author: ['Lawer Team'],
    description: 'Xóa thành viên người dùng Facebook.',
    location: __filename,
    timestamps: 0
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  var { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);
  var success = 0, fail = 0;
  var arr = [];
  for (const e of userInfo) {
    if (e.gender == undefined) {
      arr.push(e.id);
    }
  };

  adminIDs = adminIDs.map(e => e.id).some(e => e == api.getCurrentUserID());
  if (arr.length == 0) {
    return api.sendMessage("Trong nhóm bạn không tồn tại 'Người dùng Facebook'.", event.threadID);
  }
  else {
    api.sendMessage("Nhóm bạn hiện có " + arr.length + " 'Người dùng Facebook'.", event.threadID, function() {
      if (!adminIDs) {
        return api.sendMessage("Nhưng bot không phải là quản trị viên nên không thể lọc được.", event.threadID);
      } else {
        api.sendMessage("Bắt đầu lọc..", event.threadID, async function() {
          for (const e of arr) {
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              await api.removeUserFromGroup(parseInt(e), event.threadID);
              success++;
            }
            catch {
              fail++;
            }
          }
          return api.sendMessage("Đã lọc thành công " + success + " người.", event.threadID, function() {
            if (fail != 0) return api.sendMessage("Lọc thất bại " + fail + " người.", event.threadID);
          });
        })
      }
    })
  }
}
