'use strict';
module.exports = {
    config: {
        name: 'boctham',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Game bốc thăm câu hỏi.',
        location: __filename,
        timestamps: 5
    },
    onMessage: out
};
async function out({ event, api, global, Config, logger, Threads, Users, args }) {
    const prefix = (await Threads.getData(event.threadID)).prefix || Config['PREFIX'];
    const nameUser = (await Users.getData(event.senderID)).name;
    var emoji = ["nhắn vs Ny là I love you 3000 :3", "Thách đú trend vs 1 người bạn quen qua face", "Qua Lượt", "Để Avt đôi với 1 người lạ", "Nhắn Tin Yêu Với 1 người bất kỳ", "Tỏ tình cr hoặc 1 ng bất kỳ", "Nói 1 sự thật", "show ảnh của 1 người bạn đẹp nhất", "cà khịa 1 đứa trong gr", "Bốc phốt 1 đứa trong group", "Hôn 1 đứa trong group bằng lệnh kiss [ tag nó vô ]", "Hãy nói ra 1 câu nói khiến bạn buồn nhất", "Điều bây giờ bạn muốn nhất là gì", "Hãy nói xấu 1 đứa bạn", "hãy kể 1 việc bạn từng làm khiến mn kinh ngạc :c", "Thứ Khiến bạn vui nhất là gì", "Hãy kể 1 lần chơi ngu của em 😏", "Bạn thấy trong group này ai xinh nhất ", "bạn giỏi môn gì nhất", "Hãy tạo 1 câu thơ tỏ tình cả group 💁‍♂️", "hãy sử dụng tính chất môn bạn giỏi nhất để tỏ tình gr"]

    var random_emoji = emoji[Math.floor(Math.random() * emoji.length)];
    api.sendMessage(`Đây Là Thử Thách Của :` +
        " [ {name} ] "
        .replace(/\{name}/g, nameUser) +
        `: ${random_emoji}\n[ ! ] => Hãy Làm Theo Trước Khi Bấm Lại nhé !\n[ H ] Đóng góp thử thách thông qua \'${prefix}callad\' nhé !`, event.threadID, event.messageID);
}