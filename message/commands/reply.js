// Comando Tag para reenviar mensajes
module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {
            // Verifica si el mensaje tiene contenido multimedia (audio o video)
            if (m.hasMedia) {
                const mediaData = await sock.downloadMediaMessage(m);
                // Reenvía el contenido multimedia
                await sock.sendMessage(m.chat, { media: mediaData }, m);
            } else {
                // Reenvía el mensaje de texto si no hay contenido multimedia
                await sock.sendMessage(m.chat, { text: m.text }, m);
            }
        } catch (error) {
            console.error('Error en la ejecución del comando tag:', error);
            sock.reply(`Se produjo un error al ejecutar el comando tag.`);
        }
    }
};
