const express = require('express');
const cors = require('cors');
const stripHtml = require('string-strip-html');
const dayjs = require('dayjs');

const server = express();
let users = [];
let messages = [];

server.use(cors());
server.use(express.json());
server.listen(3000);

const toStrip = (string) => {
    return stripHtml(string).result.trim();
}

const getTime = () => {
    return dayjs().format('HH:mm:ss');
}

const addMessage = (from, to, text, type) => {
    messages.push({from, to, text, type, time: getTime()});
}

const addUsers = (name) => {
    users.push({name, lastStatus: Date.now()});
}

const isInvalid = (from, to, text, type) => {
    const notAParticipant = users.every(user => user.name !== from);

    if (!(from && to && text)) {
        return true;
    }
    if (type !== 'message' && type !== 'private_message') {
        return true;
    }
    if (notAParticipant) {
        return true;
    }
    return false;
}

server.post('/participants', (req, res) => {
    let { name } = req.body;
    name = toStrip(name);
    if (name.length === 0) {
        return res.sendStatus(404);
    }
    addUsers(name);
    addMessage(name, 'Todos', 'entra na sala...', 'status');
    res.sendStatus(200);
});


server.get("/messages", (req, res) => {
    res.send(messages);
});

server.post("/messages", (req, res) => {
    let [ from, to, text, type ] = Object.values(req.body).map((input) => toStrip(input));
    if (isInvalid(from, to, text, type)) {
        return res.sendStatus(400);
    }
    addMessage(from, to, text, type);
    res.sendStatus(200);
});

server.get("/participants", (req, res) => {
    res.send(users.map(user => ({name: user.name})));
});

server.post("/status", (req, res) => {
    const { name } = req.body;
    const notAParticipant = users.every(u => u.name !== name);
    if (notAParticipant) {
        return res.sendStatus(400);
    }
    users = users.map(user => (user.name === name) ? {name, lastStatus: Date.now()}: user);
    res.sendStatus(200);
});

setInterval(() => {
    const now = Date.now();
    const usersLeft = users.filter(user => now - user.lastStatus > 10000);
    usersLeft.forEach(user => addMessage(user.name, 'Todos', 'sai da sala...', 'status'));
    users = users.filter(user => now - user.lastStatus < 10000);
}, 15000);