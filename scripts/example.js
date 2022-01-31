"use strict";

const config = {
    name: 'example',
    role: 0,
    version: '1.0.0',
    author: 'MạnhG',
    description: 'Hướng dẫn cơ bản.',
    timestamps: 5
};

function onLoad({ api, event, global, Config, Threads, Users }) {
    // Enter what you want
}

function onMessage({ global, api, event, message, Config, logger, Threads, Users }) {
    // Enter what you want
}

function onEvent({ global, api, event, message, Config, logger, Threads, Users }) {
    // Enter what you want
}

function onReply({ global, api, event, message, Config, logger, Threads, Users }) {
    // Enter what you want
}

function onReaction({ global, api, event, message, Config, logger, Threads, Users }) {
    // Enter what you want
}

module.exports = {
    config,
    onLoad,
    onMessage,
    onEvent,
    onReply,
    onReaction
}