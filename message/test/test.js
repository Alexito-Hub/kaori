const fs = require('fs');
const path = require('path');

module.exports = {

    test: async (sock, m, args) => {
        try {
            if (args.length === 0) {
                const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
                const fileList = commandFiles.join(', ');

                await v.reply(`Archivos en commands: ${fileList}`);
            } else {
                const commandName = args[0].toLowerCase();
                const commandFile = path.join(__dirname, 'commands', `${commandName}.js`);

                try {
                    const command = require(commandFile);
                    await command.execute(sock, m, args.slice(1));
                } catch (error) {
                    console.error(error);
                    await v.reply(`Error ${commandName}.`);
                }
            }
        } catch (e) {
            console.error(e);
        }
    },
};
