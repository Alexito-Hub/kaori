const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '../version.json');

module.exports = {
    name: 'version',
    description: 'Muestra la versión actual o la lista de versiones',
    aliases: ['version', 'versions'],

    async execute(sock, m, args) {
        try {
            let versionData = {};
            if (fs.existsSync(versionFilePath)) {
                const rawData = fs.readFileSync(versionFilePath);
                versionData = JSON.parse(rawData);
            } else {
                versionData.versions = {};
            }

            if (args[0] && args[0].toLowerCase() === 'list') {
                let versionsMessage = 'Lista de versiones:\n';
                for (const category in versionData.versions) {
                    versionsMessage += `**${category}**:\n`;
                    for (const version of versionData.versions[category]) {
                        versionsMessage += `  - ${version.version} (${version.date})\n`;
                    }
                }
                sock.sendMessage(m.chat, { text: versionsMessage }, { quoted : m });
            } else {
                const currentVersions = versionData.versions.newdate || [];
                const latestVersion = currentVersions.length > 0 ? currentVersions[currentVersions.length - 1] : { version: 'N/A', date: 'N/A' };
                sock.sendMessage(m.chat, { text: `Versión actual: ${latestVersion.version} (${latestVersion.date})` }, { quoted : m });
            }
        } catch (error) {
            console.error(`Error al leer o escribir en el archivo de versiones: ${error}`);
            sock.sendMessage(m.chat, { text: 'Ocurrió un error al obtener la versión.' }, { quoted : m });
        }
    }
};
