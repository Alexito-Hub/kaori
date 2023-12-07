// Comando Tag mejorado para reenviar mensajes con o sin contenido multimedia
module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {
            const message = m.body.slice(m.body.indexOf(' ') + 1);
            
            if (m.hasMedia) {
                const media = m.message;
                
                if (media.type === 'videoMessage') {
                    sock.sendMessage(m.chat, {
                        video: { url: media.videoMessage.url },
                        mimetype: 'video/mp4',
                        caption: `${message}`
                    }, { quoted: m });
                } 
                else if (media.type === 'imageMessage') {
                    sock.sendMessage(m.chat, {
                        image: { url: media.imageMessage.url, mimetype: 'image/jpeg' },
                        caption: `${message}`
                    }, { quoted: m });
                }
            } 
            else {
                sock.sendMessage(m.chat, { text: message }, m);
            }
        } catch (error) {
            console.error('Error en la ejecución del comando tag:', error);
            v.reply(`Se produjo un error al ejecutar el comando tag.`);
        }
    }
};
