// version.js

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'version',
    description: 'Muestra la versión actual o la lista de versiones',
    aliases: ['version'],

    async execute(sock, m, args) {
        try {
            const versionFilePath = path.join(__dirname, '../version.json');

            if (!fs.existsSync(versionFilePath)) {
                // Si el archivo no existe, crea uno con un arreglo vacío
                fs.writeFileSync(versionFilePath, '[]', 'utf-8');
            }

            if (args[0] === 'list') {
                const versions = require('../version.json');
                const versionList = versions.map(version => `${version.number} - ${version.date}`).join('\n');
                await sock.sendMessage(m.chat, { text: `Lista de versiones:\n${versionList}` }, {quoted:m});
            } else {
                const latestVersion = require('../version.json').slice(-1)[0];
                await sock.sendMessage(m.chat, { text: `Versión actual: ${latestVersion.number} - ${latestVersion.date}` }, {quoted:m});
            }
        } catch (error) {
            console.error(`Error al leer o escribir en el archivo de versiones: ${error}`);
            await sock.sendMessage(m.chat, { text: 'Sin Versiones por aqui.' }, {quoted: m});
        }
    },
};
