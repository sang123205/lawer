'use strict';
module.exports = {
    config: {
        name: 'mausac',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Game đoán màu sắc.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, Users, args }) {
    const moneyUser = (await Users.getData(event.senderID)).money;
    if (100 > moneyUser) return api.sendMessage("đéo đủ tiền cút alo!", event.threadID, event.messageID);
    var color = args.join("")
    var check = (num) => (num == 0) ? '💙' : (num % 2 == 0 && num % 6 != 0 && num % 10 != 0) ? '♥️' : (num % 3 == 0 && num % 6 != 0) ? '💚' : (num % 5 == 0 && num % 10 != 0) ? '💛' : (num % 10 == 0) ? '💜' : '🖤️';
    let random = Math.floor(Math.random() * 50);
    if (color == "e" || color == "blue") color = 0;
    else if (color == "r" || color == "red") color = 1;
    else if (color == "g" || color == "green") color = 2;
    else if (color == "y" || color == "yellow") color = 3;
    else if (color == "v" || color == "violet") color = 4;
    else if (color == "b" || color == "black") color = 5;
    else return api.sendMessage("Bạn chưa nhập thông tin cá cược!, black [100] , red [200] , green [70] , yellow [50] , violet [150], blue [180],", event.threadID, event.messageID);

    if (color == 0 && check(random) == '💙') api.sendMessage(`Bạn đã chọn màu 💙, bạn đã thắng và được + 180$\nSố tiền hiện tại của bạn là: ${moneyUser + 180}$`, event.threadID, () => Users.setData(event.senderID, { money: moneyUser + 180 }), event.messageID);
    else if (color == 1 && check(random) == '♥️') api.sendMessage(`Bạn đã chọn màu ♥️, bạn đã thắng và được + 200$\nSố tiền hiện tại của bạn là: ${moneyUser + 200}$`, event.threadID, () => Users.setData(event.senderID, { money: moneyUser + 200 }), event.messageID);
    else if (color == 2 && check(random) == '💚') api.sendMessage(`Bạn đã chọn màu 💚, bạn đã thắng và được + 70$\nSố tiền hiện tại của bạn là: ${moneyUser + 70}$`, event.threadID, () => Users.setData(event.senderID, { money: moneyUser + 70 }), event.messageID);
    else if (color == 3 && check(random) == '💛') api.sendMessage(`Bạn đã chọn màu 💛, bạn đã thắng và được + 50$\nSố tiền hiện tại của bạn là: ${moneyUser + 50}$`, event.threadID, () => Users.setData(event.senderID, { money: moneyUser + 50 }), event.messageID);
    else if (color == 4 && check(random) == '💜') api.sendMessage(`Bạn đã chọn màu 💜, bạn đã thắng và được + 150$\nSố tiền hiện tại của bạn là: ${moneyUser + 150}$`, event.threadID, () => Users.setData(event.senderID, { money: moneyUser + 150 }), event.messageID);
    else if (color == 5 && check(random) == '🖤️') api.sendMessage(`Bạn đã chọn màu 🖤️, bạn đã thắng và được + 100$\nSố tiền hiện tại của bạn là: ${moneyUser + 100}$`, event.threadID, () => Users.setData(event.senderID, { money: moneyUser + 100 }), event.messageID);
    else api.sendMessage(`Màu ${check(random)}\nBạn đã ra đê ở :'(\nvà bị trừ đi 100$\nSố tiền còn lại của bạn là: ${moneyUser - 100}$`, event.threadID, () => Users.setData(event.senderID, { money: moneyUser - 100 }), event.messageID);
}