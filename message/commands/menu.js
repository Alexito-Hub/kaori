const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
        return { greeting: '¡Buenos días!', dailyMessage: 'Es un nuevo día para alcanzar tus metas. ¡Vamos!' };
    } else if (currentHour >= 12 && currentHour < 18) {
        return { greeting: '¡Buenas tardes!', dailyMessage: 'La tarde es perfecta para seguir progresando. ¡No te detengas!' };
    } else if (currentHour >= 18 && currentHour < 24) {
        return { greeting: '¡Buenas noches!', dailyMessage: 'Descansa y recarga energías para un nuevo día de logros.' };
    } else {
        return { greeting: '¡Buenas madrugadas!', dailyMessage: 'Aunque sea temprano, cada hora cuenta. ¡Sigue adelante!' };
    }
};

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

            const { greeting, dailyMessage } = getGreeting();

            // Utiliza m.reply en lugar de sock.reply
            await sock.sendMessage(m.chat, {
                text: `    ${greeting} *@${user} 🍥*
᳃ *"${dailyMessage}"*

  *Prefijo:* ${prefixList} 
  *Modo:* Público
  *Actividad:* ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s
  *Creator:* ziooo_zip

Para obtener información de algún comando usa "Help <command>"

Comandos disponibles:
- tiktok *<url>*
- facebook *<url>* defectuoso
- youtube *<url>* defectuoso`,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `Lista de Menu`,
                        body: `bandidaje@bot`,
                        sourceUrl: `https://whatsapp.com/channel/0029VaBQgoGLdQehR6vmiY42`,
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
