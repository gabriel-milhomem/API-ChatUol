const { readFile, writeFile } = require('./file-sync');

const { addMessage } = require('./messages');

// functions that use data.users

const addUsers = (name) => {
    const data = readFile();

    data.users.push({name, lastStatus: Date.now()});
    writeFile(data);
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

    writeFile({...data, users: onlineUsers});
}

const filterUsersLeft = (now) => {
    const data = readFile();
    const usersLeft = data.users.filter(user => now - user.lastStatus > 10000);

    usersLeft.forEach(user => addMessage(user.name, 'Todos', 'sai da sala...', 'status'));
}

module.exports = { filterUsersLeft, filterOnlineUsers, setUserStatus, addUsers };