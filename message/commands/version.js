const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '..', 'version.json');

module.exports = {
    name: 'version',
    description: 'Muestra la versión actual del bot o la lista de todas las versiones',
    aliases: ['ver', 'about'],
    
    async execute(sock, m, args) {
        try {
            let versionData = {};
            
            if (fs.existsSync(versionFilePath)) {
                versionData = JSON.parse(fs.readFileSync(versionFilePath, 'utf8'));
            }

            if (args[0] === 'list') {
                // Mostrar lista de todas las versiones
                const versionList = versionData.versions || [];
                const versionText = versionList.map(version => `${version.number} - ${version.date}`).join('\n');
                await sock.sendMessage(m.chat, { text: `🤖 **Lista de Versiones:**\n${versionText}` }, { quoted: m });
            } else {
                // Obtén la última versión
                const latestVersion = versionData.versions ? versionData.versions[versionData.versions.length - 1] : null;

                if (latestVersion) {
                    const { number, date } = latestVersion;
                    await sock.sendMessage(m.chat, { text: `🤖 **Versión:** ${number}\n📅 **Fecha de lanzamiento:** ${date}` }, { quoted: m });
                } else {
                    await v.reply(m, 'No se encontraron versiones en el archivo.');
                }
            }
        } catch (error) {
            console.error('Error al leer o escribir en el archivo de versiones:', error);
            await v.reply(m, 'Ocurrió un error al obtener la versión del bot.');
        }
    }
}