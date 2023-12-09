// Comando Tag mejorado para reenviar mensajes con o sin contenido multimedia
module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m, args) {
        try {
            const message = args.join(' ');
            if (!message) return v.reply('¿Falta de palabras?');

            // Verifica si el mensaje tiene contenido multimedia
            if (m.hasMedia) {
                const media = m.quotedMsgObj;

                // Maneja mensajes de video
                if (media.isVideo) {
                    sock.sendMessage(m.chat, {
                        video: { url: media.body },
                        mimetype: 'video/mp4',
                        caption: `${message}`
                    }, { quoted: m });
                } 
                // Maneja mensajes de imagen
                else if (media.isImage) {
                    sock.sendMessage(m.chat, {
                        image: { url: media.body },
                        caption: `${message}`
                    }, { quoted: m });
                }
            } 
            // Si no hay contenido multimedia, reenvía solo el mensaje de texto
            else {
                sock.sendMessage(m.chat, { text: message, contextInfo: m.chat});
            }
        } catch (error) {
            console.log('Error en la ejecución del comando tag:', error);
            v.reply('Se produjo un error al ejecutar el comando tag.');
        }
    }
};
