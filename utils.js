const stripHtml = require('string-strip-html');
const dayjs = require('dayjs');
const { readFile, writeFile } = require('./file-sync');

const toStrip = (string) => {
    return stripHtml(string).result.trim();
}

const getTime = () => {
    return dayjs().format('HH:mm:ss');
}

const addMessage = (from, to, text, type) => {
    const data = readFile();
    data.messages.push({from, to, text, type, time: getTime()});
    writeFile(data);
}

const notAParticipant = (participant) => {
    const { users } = readFile();
    return users.every(user => user.name !== participant);
}

const addUsers = (name) => {
    const data = readFile();
    data.users.push({name, lastStatus: Date.now()});
    writeFile(data);
}

const showMessages = () => {
    const { messages } = readFile();
    const limit = 100;
    if (messages.length < limit) {
        return messages;
    } else {
        return messages.slice(messages.length - 100);
    }
}

const isInvalid = (from, to, text, type) => {
    const notParticipant = notAParticipant(from);

    if (!(from && to && text)) {
        return true;
    }
    if (type !== 'message' && type !== 'private_message') {
        return true;
    }
    if (notParticipant) {
        return true;
    }
    return false;
}

const setUserStatus = (name) => {
    const data = readFile();
    const newUserStatus = data.users.map(user => (
        (user.name === name) ? {...user, lastStatus: Date.now()}: user
    ));
    writeFile({...data, users: newUserStatus});
}

const filterOnlineUsers = (now) => {
    const data = readFile();
    const onlineUsers = data.users.filter(user => now - user.lastStatus < 10000);
    console.log('ONLINEUSERS', onlineUsers);
    writeFile({...data, users: onlineUsers});
}

const filterUsersLeft = (now) => {
    const data = readFile();
    const usersLeft = data.users.filter(user => now - user.lastStatus > 10000);
    usersLeft.forEach(user => addMessage(user.name, 'Todos', 'sai da sala...', 'status'));
}

module.exports = { 
    toStrip, addMessage, notAParticipant, filterUsersLeft, isInvalid
    , filterOnlineUsers, setUserStatus, addUsers, showMessages
};