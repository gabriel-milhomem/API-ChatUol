const express = require('express');
const cors = require('cors');

const { readFile, createJSON } = require('./utils/file-sync');
const { toStrip, addMessage, showMessages, isInvalid, notAParticipant } = require('./utils/messages');
const { filterUsersLeft, filterOnlineUsers, setUserStatus, addUsers } = require('./utils/users');

// Configs

createJSON();
const server = express();
server.use(cors());
server.use(express.json());
server.listen(3000);

// Status

setInterval(() => {
    const now = Date.now();
    filterUsersLeft(now);
    filterOnlineUsers(now);
}, 15000);

server.post("/status", (req, res) => {
    const { name } = req.body;
    const notParticipant = notAParticipant(name);

    if (notParticipant) {
        return res.sendStatus(400);
    }
    setUserStatus(name);
    res.sendStatus(200);
});

// Messages

server.get("/messages", (req, res) => {
    const name = req.headers['user-name'];
    const messages = showMessages(name);

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

// Participants

server.get("/participants", (req, res) => {
    const { users } = readFile();

    res.send(users.map(user => ({name: user.name})));
});

server.post('/participants', (req, res) => {
    let { name } = req.body;

    name = toStrip(name);
    if (!name) {
        return res.sendStatus(404);
    }
    addUsers(name);
    addMessage(name, 'Todos', 'entra na sala...', 'status');
    res.sendStatus(200);
});