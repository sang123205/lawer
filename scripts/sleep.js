'use strict';
module.exports = {
    config: {
        name: 'sleep',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Tính toán thời gian thức dậy hoàn hảo cho bạn.',
        location: __filename,
        timestamps: 5
    }
}

module.exports.onMessage = async function({ api, event, args, global, Config }) {
    let { senderID, threadID, messageID } = event;
    var getPrefix = (await Threads.getData(threadID)).prefix || Config.prefix;
    const moment = require("moment-timezone");
    var sleepTime = [];
    let content = args.join(" ");
    var contentHour = content.split(":")[0];
    var contentMinute = content.split(":")[1];
    if (isNaN(contentHour) || isNaN(contentMinute) || contentHour > 23 || contentMinute > 59 || contentHour < 0 || contentMinute < 0 || contentHour.length != 2 || contentMinute.length != 2) return api.sendMessage(`Không đúng format, hãy xem trong ${getPrefix}help`, threadID, messageID);
    var getTime = moment().utcOffset("+07:00").format();
    var time = getTime.slice(getTime.indexOf("T") + 1, getTime.indexOf("+"));
    var wakeTime = getTime.replace(time.split(":")[0] + ":", contentHour + ":").replace(time.split(":")[1] + ":", contentMinute + ":");
    for (var i = 6; i > 0; i--) sleepTime.push(moment(wakeTime).utcOffset("+07:00").subtract(90 * i + 15, 'm').format("HH:mm"));
    return api.sendMessage("Nếu bạn muốn thức dậy vào lúc " + content + ", những thời gian hoàn hảo nhất để đi ngủ là:\n" + sleepTime.join(', ') + "\nFact: Thời gian để bạn vào giấc ngủ từ lúc nhắm mắt là 15-20 phút", threadID, messageID);
}