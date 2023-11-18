// version.js

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'version',
    description: 'Muestra la versión actual o la lista de versiones',
    aliases: ['version', 'ver', 'v-'],

    async execute(sock, m, args) {
        try {
            if (args[0] === 'list') {
                const versions = require('../version.json');
                const versionList = versions.map(version => `${version.number} - ${version.date}`).join('\n');
                await sock.sendMessage({ text: `Lista de versiones:\n${versionList}` }, { quoted: m });
            } else {
                const latestVersion = require('../version.json').slice(-1)[0];
                await sock.sendMessage({ text: `Versión actual: ${latestVersion.number} - ${latestVersion.date}` }, { quoted: m });
            }
        } catch (error) {
            console.error(`Error al leer o escribir en el archivo de versiones: ${error}`);
            await sock.sendMessage({ text: 'Ocurrió un error al obtener la información de la versión.' }, { quoted: m });
        }
    },
};
