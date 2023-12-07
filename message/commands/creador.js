module.exports = {
    name: 'creador',
    description: 'Muestra información sobre el creador',
    aliases: ['creator', 'owner', 'bot'],

    async execute(sock, m) {
        try {
            const user = m.sender.split('@')[0];

            // Utiliza m.reply en lugar de sock.reply
            await sock.sendMessage(m.chat, {
                text: `*Información del Creador*
- Nombre: ziooo_zip
- GitHub: [ziooo_zip en GitHub](https://github.com/Alexito-Hub)
- Telegram: [ziooo_zip en Telegram](https://t.me/ziooo_zip)`,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        title: `Información del Creador`,
                        body: `bandidaje@bot`,
                        renderLargerThumbnail: false,
                        mediaType: 1,
                        thumbnailUrl: 'https://telegra.ph/file/ae78c6675b0f413a5c635.jpg'
                    }
                }
            }, { quoted: m });
        } catch (error) {
            console.error('Error en la ejecución del comando creador:', error);
        }
    }
};
