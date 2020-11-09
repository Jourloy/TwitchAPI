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
        this.ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
        this.send = (message) => {
            const ws = this.ws;
            const channel = this.channel;
            ws.send(`PRIVMSG ${channel} :${message}`);
        }

        this.connect = () => {
            const auth = this.authorization;
            const nickname = this.nickname;
            const channel = this.channel;
            const emitter = this.event;

            const ws = this.ws;

            ws.on('open', function open() {
                ws.send(`PASS ${auth}`);
                ws.send(`NICK ${nickname}`)
                ws.send(`JOIN ${channel}`);
            });
            ws.on('message', function incoming(data) {
                const username = _.getUsernameFromData(data);
                const text = _.getTextFromData(data);
                events(text, username, emitter);
            });
        };
    }
}

function events(message, username, emitter) {
    if (username == null) {
    
    } else {
        const splitedMessage = message.split(' ');
        if (splitedMessage[0] == '\x01ACTION') {
            let newMessage = []
            for (i in splitedMessage) if (splitedMessage[i] != '\x01ACTION') newMessage.push(splitedMessage[i]);
            newMessage = newMessage.join(' ');
            emitter.emit('action', username, newMessage) 
        }
    }
}

module.exports = client;