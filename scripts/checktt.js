'use strict';
module.exports = {
    config: {
        name: 'checktt',
        ver: '1.0.0',
        role: 0,
        author: ['Lawer Team'],
        description: 'Kiểm tra lượng tương tác của bạn và nhóm bạn',
        location: __filename,
        timestamps: 5
    },
    onMessage: out,
    onEvent: congExp
};
async function congExp({ event, api, Threads, Users, global }) {
    if (event.type == 'message' || event.type == 'message_reply') {
        if (event.isGroup == true) {
            try {
                let exp = (await Users.getData(event.senderID)).exp;
                await Users.setData(event.senderID, { exp: parseInt(exp) + 1 });
            } catch (err) {
                console.log(err);
            }
        }
    }
}
async function out({ event, api, args, Threads, Users }) {
    const { threadID, messageID, senderID, participantIDs } = event;
    var mention = Object.keys(event.mentions);
    if (mention.length != 0) {
        var data = [];
        var msg = '';
        for (var id of mention) {
            var exp = await Users.getData(id).exp;
            if (!exp.error) {
                data.push({ senderID: id, exp });
            } else {
                await Users.createData(id, api);
                data.push({ senderID: id, exp: 0 });
            }
        }
        data.sort(function(a, b) { return b.exp - a.exp });
        for (var s of data) {
            var id = s.senderID;
            var exp = s.exp;
            var name = await Users.getData(id).name;
            msg += name + ': ' + exp + ' tin nhắn.\n';
        }
        return api.sendMessage(msg, threadID, messageID);
    }
    if (event.type != 'message_reply') {
        if (!args[0]) {
            var exp = (await Users.getData(senderID)).exp;
            if (exp.error) return api.sendMessage(exp.error, threadID, messageID);
            return api.sendMessage('Bạn đã nhắn được ' + exp + ' tin nhắn.', threadID, messageID);
        } else if (args[0] == 'all' || args[0] == 'list' || args[0] == '-l') {
            var data = [];
            var cc = 0;
            for (let tv of participantIDs) {
                let exp = (await Users.getData(tv)).exp;
                if (exp) {
                    data.push({ senderID: tv, exp });
                } else {
                    if (cc = 0) api.sendMessage('Vui lòng chờ đang lấy data...', threadID, messageID);
                    await Users.createData(tv, api);
                    data.push({ senderID: tv, exp: 0 });
                    cc++;
                }
            }
            data.sort(function(a, b) { return b.exp - a.exp });
            var page = 1;
            page = parseInt(args[1]) || 1;
            page < -1 ? page = 1 : "";
            var limit = 15;
            var msg = 'Danh sách tương tác của thành viên: \n';
            var numPage = Math.ceil(data.length / limit);
            if (page > numPage) return api.sendMessage('No data found!', threadID, messageID);
            for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
                if (i >= data.length) break;
                var id = data[i].senderID;
                var exp = data[i].exp;
                var name = (await Users.getData(id)).name;
                msg += (i + 1) + '. ' + name + ': ' + exp + ' tin nhắn\n';
            }
            msg += '\n(Trang ' + page + '/' + numPage + ')';
            return api.sendMessage(msg, threadID, messageID);
        } else if (args[0] == 'alllist') {
            var data = [];
            var cc = 0;
            var msg = '';
            for (let tv of participantIDs) {
                let exp = (await Users.getData(tv)).exp;
                if (exp) {
                    data.push({ senderID: tv, exp });
                } else {
                    if (cc = 0) api.sendMessage('Vui lòng chờ đang lấy data...', threadID, messageID);
                    await Users.createData(tv, api);
                    data.push({ senderID: tv, exp: 0 });
                    cc++;
                }
            }
            data.sort(function(a, b) { return b.exp - a.exp });
            for (var i = 0; i < data.length; i++) {
                var id = data[i].senderID;
                var exp = data[i].exp;
                var name = (await Users.getData(id)).name;
                msg += (i + 1) + '. ' + name + ': ' + exp + ' tin nhắn\n';
            }
            return api.sendMessage(msg, threadID, messageID);
        }
    } else {
        var name = (await Users.getData(event.messageReply.senderID)).name;
        var exp = (await Users.getData(event.messageReply.senderID)).exp;
        if (exp.error) return api.sendMessage(exp.error, threadID, messageID);
        return api.sendMessage(name + ': ' + exp + ' tin nhắn.', threadID, messageID);
    }
}