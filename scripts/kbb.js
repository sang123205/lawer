
'use strict';
module.exports = {
  config: {
    name: 'kbb',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Game kéo búa bao.',
    location: __filename,
    timestamps: 5
  }
}
module.exports.onMessage = async function({ event, api, args }) {
  function outMsg(data) {
    api.sendMessage(data, event.threadID, event.messageID);
  }

  var turnbot = ["✌️", "👊", "✋"]
  var botturn = turnbot[Math.floor(Math.random() * turnbot.length)]
  var userturn = args.join(" ")
  if (userturn == "✌️" || userturn == "👊" || userturn == "✋") {
    if (userturn == turnbot) {
      return outMsg(`Hòa\nUser : ${userturn}\nBot : ${botturn} `)
    } else if (userturn == "✌️") {
      if (botturn == "👊") {
        return outMsg(`Bot win\nUser : ${userturn}\nBot : ${botturn} `)
      } else if (botturn == "✋") {
        return outMsg(`User win\nUser : ${userturn}\nBot : ${botturn} `)
      }
    } else if (userturn == "👊") {
      if (botturn == "✋") {
        return outMsg(`Bot win\nUser : ${userturn}\nBot : ${botturn} `)
      } else if (botturn == "✌️") {
        return outMsg(`User win\nUser : ${userturn}\nBot : ${botturn} `)
      }
    } else if (userturn == "✋") {
      if (botturn == "✌️") {
        return outMsg(`Bot win\nUser : ${userturn}\nBot : ${botturn} `)
      } else if (botturn == "👊") {
        return outMsg(`User win\nUser : ${userturn}\nBot : ${botturn} `)
      }
    }
  } else {
    return outMsg("Vui lòng nhập ✌️ hoặc 👊 hoặc ✋")
  }
}