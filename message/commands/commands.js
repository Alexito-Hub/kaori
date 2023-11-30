const fs = require('fs');
const path = require('path');
const db = require('../../database')
const commands = [];

function readCommands(folderPath) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(folderPath, file));
        commands.push(command);
    }
}

readCommands(path.join(__dirname, 'admin'));
readCommands(path.join(__dirname, 'user'));
readCommands(path.join(__dirname, 'utils'));

module.exports = commands;
