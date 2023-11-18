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
            const defaultVersionData = { versions: { new: [], ancient: [] } };

            if (!fs.existsSync(versionFilePath)) {
                // Si el archivo no existe, crea uno con datos predeterminados
                fs.writeFileSync(versionFilePath, JSON.stringify(defaultVersionData, null, 2), 'utf-8');
            }

            const versionData = require('../version.json');

            if (args[0] === 'list') {
                const versionList = versionData.versions.new.concat(versionData.versions.ancient)
                    .map(version => `${version.version} - ${version.date}`)
                    .join('\n');
                await sock.sendMessage(m.chat, { text: `Lista de versiones:\n${versionList}` }, { quoted : m });
            } else {
                const latestVersion = versionData.versions.new.slice(-1)[0];
                await sock.sendMessage(m.chat, { text: `Versión actual: ${latestVersion.version} - ${latestVersion.date}` }, { quoted : m });
            }
        } catch (error) {
            console.error(`Error al leer o escribir en el archivo de versiones: ${error}`);
            await sock.sendMessage(m.chat, { text: 'Ocurrió un error al obtener la información de la versión.' }, { quoted : m });
        }
    },
};
