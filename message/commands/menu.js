// commands/menu.js

module.exports = {
    name: 'menu',
    description: 'Muestra un menú de comandos',
    aliases: ['menu', 'commands'],

    async execute(sock, m, formattedTime, user) {
        try {
            const prefixList = global.prefix.map(p => `[ ${p} ]`).join(' ');

            await sock.sendMessage(m.chat, {
                text: `    *Hola @${user} 🍥*
᳃ "Es momento de levantarse y dar pasos largos para lograr nuestros objetivos"

  *Prefijo:* ${prefixList} 
  *Modo:* Público
  *Actividad:* ${formattedTime}

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
