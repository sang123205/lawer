"use strict";function index({event:e,api:n}){return{send:function(s,t){return t&&"function"==typeof t?n.sendMessage(s,t):n.sendMessage(s,e.threadID)},reply:function(s,t){return t&&"function"==typeof t?n.sendMessage(s,e.threadID,t,e.messageID):n.sendMessage(s,e.threadID,e.messageID)},unsend:function(e,s){return s&&"function"==typeof s?n.unsendMessage(e,s):n.unsendMessage(e)},reaction:function(e,s){return n.setMessageReaction(e,(function(){}),!0)}}}module.exports={index:index};