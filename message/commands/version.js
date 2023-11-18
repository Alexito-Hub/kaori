const fs = require('fs');
const path = require('path');

// ... (tu código anterior)

module.exports = {
    name: 'version',
    description: 'Muestra la versión actual del bot o la lista de todas las versiones',
    aliases: ['ver', 'about'],
    
    async execute(sock, m, args) {
        try {
            const configPath = path.join(__dirname, '..', 'config.json');
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            if (args[0] === 'list') {
                // Mostrar lista de todas las versiones
                const versionList = config.versions.map(version => `${version.number} - ${version.date}`);
                const versionText = versionList.join('\n');
                await sock.sendMessage(m.chat, { text: `🤖 **Lista de Versiones:**\n${versionText}` }, { quoted: m });
            } else {
                // Obtén la última versión
                const latestVersion = config.versions[config.versions.length - 1];

                if (latestVersion) {
                    const { number, date } = latestVersion;
                    await sock.sendMessage(m.chat, { text: `🤖 **Versión:** ${number}\n📅 **Fecha de lanzamiento:** ${date}` }, { quoted: m });
                } else {
                    await v.reply(m, 'No se encontraron versiones en el archivo de configuración.');
                }
            }
        } catch (error) {
           
        }
    }
}

// ... (tu código posterior)
