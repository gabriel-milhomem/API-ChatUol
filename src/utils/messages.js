const stripHtml = require('string-strip-html');
const dayjs = require('dayjs');

const { readFile, writeFile } = require('./file-sync');

// universal functions

const toStrip = (string) => {
    if (!string) {
        return;
    }
    return stripHtml(string).result.trim();
}

const checkIfNotAParticipant = (participant) => {
    const { users } = readFile();

    return users.every(user => user.name !== participant);
}

// functions that use data.messages

const getTime = () => {
    return dayjs().format('HH:mm:ss');
}

const addMessage = (from, to, text, type) => {
    const data = readFile();

    data.messages.push({from, to, text, type, time: getTime()});
    writeFile(data);
}

const getFilteredMessages = (name) => {
    const { messages } = readFile();

    return messages.filter(msg => (
        (msg.type !== 'private_message') || 
            (msg.to === name || msg.to === 'Todos' || msg.from === name)
    ));
}

const showMessages = (name) => {
    const limit = 100;
    const messages = getFilteredMessages(name);
    return messages.slice(-limit);
}

const validateMessagesValues = (from, to, text, type) => {
    const notParticipant = checkIfNotAParticipant(from);

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

module.exports = { toStrip, addMessage, validateMessagesValues, showMessages, checkIfNotAParticipant };