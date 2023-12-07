// Comando Tag mejorado para reenviar mensajes con o sin contenido multimedia
module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {
            // Extrae el mensaje del comando (sin el prefijo y nombre del comando)
            const commandBody = m.body.slice(m.body.indexOf(' ') + 1);

            // Verifica si el mensaje tiene contenido multimedia (audio, video o imagen)
            if (m.hasMedia) {
                // Descarga y obtiene el enlace del archivo multimedia
                const mediaData = await sock.downloadMediaMessage(m, 'buffer');
                // Reenvía el contenido multimedia junto con el mensaje
                await sock.sendMessage(m.chat, { text: commandBody, media: { url: mediaData } }, m);
            } else {
                // Reenvía el mensaje de texto si no hay contenido multimedia
                await sock.sendMessage(m.chat, { text: commandBody }, m);
            }
        } catch (error) {
            console.error('Error en la ejecución del comando tag:', error);
            sock.reply(`Se produjo un error al ejecutar el comando tag.`);
        }
    }
};
