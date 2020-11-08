const fetch = require('node-fetch');
const irc = require('irc');
const Emmiter = require('events');
const emmiter = new Emmiter();
const WebSocket = require('ws');
const _ = require('./tools');

class client {
    constructor(options) {
        this.clientID = options.clientID;
        this.authorization = options.auth;
        this.nickname = options.nickname;
        this.channel = options.channel;

        this.updateTime = 500;
        this.event = emmiter;

        this.connect = () => {
            const auth = this.authorization;
            const nickname = this.nickname;
            const channel = this.channel;
            const emitter = this.event;

            const ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');

            ws.on('open', function open() {
                ws.send(`PASS ${auth}`);
                ws.send(`NICK ${nickname}`)
                ws.send(`JOIN ${channel}`);
            });
            ws.on('message', function incoming(data) {
                const username = _.getUsernameFromData(data);
                const text = _.getTextFromData(data);
                if (username == null) return;
                emitter.emit('message', username, text);
            });
        };
    }
}

//

module.exports = client;