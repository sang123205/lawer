'use strict';
module.exports = {
    config: {
        name: 'adminUpdate',
        ver: '1.0.0',
        author: ['LawerTeam'],
        description: 'Thông báo cập nhật nhóm',
    },
    onMessage: out
};
async function out({ event, api, Config, message, Threads, Users, is }) {

    const { threadID, logMessageType, logMessageData } = event;
    try {
        let dataThread = await Threads.getData(threadID);
        switch (logMessageType) {
            case "log:thread-admins":
                {
                    if (logMessageData.ADMIN_EVENT == "add_admin") {
                        dataThread.adminIDs.push({ id: logMessageData.TARGET_ID })
                        const name = await Users.getName(logMessageData.TARGET_ID)
                        console.log(name)
                            /*
                            api.sendMessage(`[ THÔNG BÁO ] Đã cập nhật ${name} trở thành quản trị viên nhóm`, threadID, (error, info) => {
                            setTimeout(function(){ 
                                    return api.unsendMessage(info.messageID)
                                    }, 10*1000);
                                }) 
                            */
                    } else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                        dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                        const name = await Users.getName(logMessageData.TARGET_ID)
                        console.log(name)
                            /*
         api.sendMessage(`[ THÔNG BÁO ] Đã cập nhật ${name} trở thành người dùng`, threadID, (error, info) => {
         setTimeout(function(){ 
                 return api.unsendMessage(info.messageID)
                 }, 10*1000);
             })
           */
                    }
                    break;
                }
            case "log:thread-name":
                {
                    dataThread.name = event.logMessageData.name || "Không tên";
                    console.log(dataThread.name)
                    /*
       api.sendMessage(`[ THÔNG BÁO ] Đã cập nhật tên nhóm thành ${dataThread.name}`, threadID, (error, info) => {
           setTimeout(function(){ 
                   return api.unsendMessage(info.messageID)
                   }, 10*1000);
               })
       */
                    break;
                }
        }

    } catch (e) { return };
}