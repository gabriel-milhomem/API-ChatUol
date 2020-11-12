const express = require('express');
const cors = require('cors');
const stripHtml = require('string-strip-html');
const dayjs = require('dayjs');

server.use(cors());
server.use(express.json());
server.listen(3000);

const server = express();
let user;
let messages = [];

const toStrip = (string) => {
    return stripHtml(string).result.trim();
}

server.post('/participants', (req, res) => {
    let { name } = req.body;
    name = toStrip(name);
    if (name.length === 0) {
        return res.sendStatus(400);
    }
    const time = dayjs().format('HH:mm:ss');
    user = {name, lastStatus: Date.now()};
    messages.push({
        from: name, 
        to: 'Todos',
        text: 'entra na sala...', 
        type: 'status',
        time
    });
    return res.sendStatus(200);
});

server.get("/messages", (req, res) => {
    res.send(messages);
});