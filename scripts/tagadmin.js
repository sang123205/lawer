'use strict';
module.exports = {
    config: {
        name: 'tagadmin',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Tag admin.',
        location: __filename,
        timestamps: 5
    },
    onEvent: onEvent,
    onMessage: out
};
async function onEvent({ event, api, Config, message, Threads, Users }) {
    const { senderID, threadID, messageID, mentions } = event;
    try {
        if (!global.allThreadData[threadID]) return;
        const data = (await Threads.getData(threadID)).data;
        if (data.tagadmin == false) return;
    } catch (err) { return err }
    if (mentions == undefined) return;
    const mention = Object.keys(mentions)[0];
    let idAD = Config.admin[0];
    if (idAD == undefined) return;
    if (mention == idAD) {
        var msg = ["Tag lần nữa bố ban khỏi dùng", "Lần nữa tao đấm cho đấy", "Đã bảo đừng tag mà, thích ăn đấm hả😠", "Có chuyện gì thì ib trực tiếp", "Hello! Bạn gọi tôi có việc gì thế?", "Tiền không phải là tất cả. Vì đời này còn vàng và kim cương.", "Ế là vì quá tử tế. Ế là vì không đủ kinh tế để khống chế tình yêu.", "“Có làm thì mới có ăn”", "Hãy sống đẹp như những con thiên nga của Tchaikovsky", "Tại sao mình phải trả lời bạn?", "Cần cù bù siêng năng, không làm mà muốn có ăn thì chỉ có ăn cứt"];
        return api.sendMessage({ body: msg[Math.floor(Math.random() * msg.length)] }, threadID, messageID);
    }
};
async function out({ event, api, Config, message, Threads, Users, args }) {
    const { threadID } = event;
    const data = (await Threads.getData(threadID)).data;
    if (!data.tagadmin) {
        data.tagadmin = true;
        await Threads.setData(threadID, { data: data })
    }
    if (args[0] == "on") data.tagadmin = true;
    else if (args[0] == "off") data.tagadmin = false;
    else return message.reply(`HD:\n1. tagadmin on -> Bật tagadmin\n2. tagadmin off -> Tắt tagadmin`);
    await Threads.setData(threadID, {
        data
    }, (err, info) => {
        if (err) return message.reply(`Đã xảy ra lỗi, vui lòng thử lại sau`);
        message.reply(`Đã ${data.tagadmin ? "bật" : "tắt"} tagadmin`);
    });
}