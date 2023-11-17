// commands/menu.js

module.exports = {
    name: 'menu',
    description: 'Muestra un menú de comandos',
    aliases: ['menu', 'commands'],

    async execute(sock, m) {
        try {
            const user = m.sender.split('@')[0];
            const prefixList = global.prefix.map(p => `[ ${p} ]`).join(' ');

            const uptimeSeconds = Math.floor(process.uptime());
            const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
            const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
            const seconds = uptimeSeconds % 60;

            // Utiliza m.reply en lugar de sock.reply
            await sock.sendMessage(m.chat, {
                text: `    *Hola @${user} 🍥*
᳃ "Es momento de levantarse y dar pasos largos para lograr nuestros objetivos"

  *Prefijo:* ${prefixList} 
  *Modo:* Público
  *Actividad:* ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s

Para obtener información de algún comando usa "Help <command>"

Comandos disponibles:
- Test
- Ping`,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `Kaori 🍥`,
                        body: `por @alexito`,
                        showAdAttribution: true,
                        renderLargerThumbnail: false,
                        mediaType: 1,
                        thumbnailUrl: 'https://telegra.ph/file/ae78c6675b0f413a5c635.jpg'
                    }
                }
            }, { quoted: m });
        } catch (error) {
            console.error('Error en la ejecución del comando menu:', error);
        }
    }
};
