// Comando Tag mejorado para reenviar mensajes con o sin contenido multimedia
module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {
            const message = args.join(' ');
            if (!message) return v.reply('¿falta de palabras?')

            // Verifica si el mensaje tiene contenido multimedia
            if (m.hasMedia) {
                const media = m.message;

                // Maneja mensajes de video
                if (media.type === 'videoMessage') {
                    sock.sendMessage(m.chat, {
                        video: { url: media.videoMessage.url },
                        mimetype: 'video/mp4',
                        caption: `${message}`
                    }, { quoted: m });
                } 
                // Maneja mensajes de imagen
                else if (media.type === 'imageMessage') {
                    sock.sendMessage(m.chat, {
                        image: { url: media.imageMessage.url, mimetype: 'image/jpeg' },
                        caption: `${message}`
                    }, { quoted: m });
                }
            } 
            // Si no hay contenido multimedia, reenvía solo el mensaje de texto
            else {
                sock.sendMessage(m.chat, { text: message }, { quoted: m });
            }
        } catch (error) {
            console.log('Error en la ejecución del comando tag:', error);
            v.reply(`Se produjo un error al ejecutar el comando tag.`);
        }
    }
};
