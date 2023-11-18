const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../version.json');

module.exports = {
    name: 'version',
    description: 'Muestra la versión actual o la lista de versiones',
    aliases: ['version', 'v'],

    async execute(sock, m, args) {
        try {
            const rawdata = fs.readFileSync(versionFile);
            const versions = JSON.parse(rawdata);

            if (args[0] === 'list') {
                const versionList = Object.entries(versions.versions).map(([key, value]) => ({ type: key, data: value }));
                let response = 'Lista de versiones:\n';
                
                for (const entry of versionList) {
                    response += `\n${entry.type}:\n`;
                    for (const version of entry.data) {
                        response += `- ${version.version} (${version.date})\n`;
                    }
                }

                await sock.sendMessage(m.chat, { text: response },  { quoted: m });
            } else {
                const currentVersions = versions.versions.newdate;
                const latestVersion = currentVersions[currentVersions.length - 1];

                await sock.sendMessage(m.chat, { text: `Versión actual: ${latestVersion.version} (${latestVersion.date})` },  { quoted: m });
            }
        } catch (error) {
            console.error('Error al leer o escribir en el archivo de versiones:', error);
            const errorMessage = 'Ocurrió un error al procesar la solicitud.';
            await sock.sendMessage(m.chat, { text: errorMessage },  { quoted: m });
        }
    }
};
