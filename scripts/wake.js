'use strict';
module.exports = {
    config: {
        name: 'wake',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Tính toán giờ đi ngủ hoàn hảo cho bạn.',
        location: __filename,
        timestamps: 5
    }
}
module.exports.onMessage = async function({ api, event, args, global, Config,Threads }) {
    let { threadID, messageID } = event;
    const moment = require("moment-timezone");
    var prefix = (await Threads.getData(threadID)).prefix || Config['PREFIX'];
    var wakeTime = [];
    let content = args.join(" ")
    if (!content) {
        for (var i = 1; i < 7; i++) wakeTime.push(moment().utcOffset("+07:00").add(90 * i + 15, 'm').format("HH:mm"));
        return api.sendMessage("Nếu bạn đi ngủ bây giờ, những thời gian hoàn hảo nhất để thức dậy là:\n" + wakeTime.join(', '), threadID, messageID);
    } else {
        if (content.indexOf(":") == -1) return api.sendMessage(`Không đúng format, hãy xem trong ${prefix}help sleep`, threadID, messageID);
        var contentHour = content.split(":")[0];
        var contentMinute = content.split(":")[1];
        if (isNaN(contentHour) || isNaN(contentMinute) || contentHour > 23 || contentMinute > 59 || contentHour < 0 || contentMinute < 0 || contentHour.length != 2 || contentMinute.length != 2) return api.sendMessage(`Không đúng format, hãy xem trong ${prefix}help`, threadID, messageID);
        var getTime = moment().utcOffset("+07:00").format();
        var time = getTime.slice(getTime.indexOf("T") + 1, getTime.indexOf("+"));
        var hour = time.split(":")[0];
        var minute = time.split(":")[1];
        var sleepTime = getTime.replace(hour + ":", contentHour + ":").replace(minute + ":", contentMinute + ":");
        for (var i = 1; i < 7; i++) wakeTime.push(moment(sleepTime).utcOffset("+07:00").add(90 * i + 15, 'm').format("HH:mm"));
        return api.sendMessage("Nếu bạn đi ngủ vào lúc " + content + ", những thời gian hoàn hảo nhất để thức dậy là:\n" + wakeTime.join(', '), threadID, messageID);
    }
}