const fs = require('fs');
const path = require('path');

const dataPath = './data.json';

const writeFile = (content) => {
    const contentString = JSON.stringify(content);
    fs.writeFileSync(path.resolve(dataPath), contentString);
}

const readFile = () => {
    const file = fs.readFileSync(path.resolve(dataPath));
    return JSON.parse(file);
}

const createJSON = () => {
    if (!fs.existsSync(path.resolve(dataPath))) {
        writeFile({users: [], messages: []});
    };
}

module.exports = { writeFile, readFile, createJSON };