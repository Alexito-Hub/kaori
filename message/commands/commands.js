const fs = require('fs');
const path = require('path');

const commands = [];

function readCommands(folderPath) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(folderPath, file));
        commands.push(command);
    }
}

readCommands(path.join(__dirname, 'commands', 'admin'));
readCommands(path.join(__dirname, 'commands', 'user'));
readCommands(path.join(__dirname, 'commands', 'utils'));

module.exports = commands;
