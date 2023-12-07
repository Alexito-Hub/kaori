// Este código asume que estás utilizando la biblioteca adecuada y que ya tienes las funciones necesarias disponibles.

module.exports = {
    name: 'replicar',
    description: 'Replica un mensaje con contenido multimedia',
    aliases: ['reply'],

    async execute(sock, m) {
        try {
            // Verifica si el mensaje tiene contenido multimedia
            if (m.hasMedia) {
                // Obtiene el contenido multimedia del mensaje
                const media = await sock.downloadMediaMessage(m);
                
                // Envía el contenido multimedia replicado
                await sock.sendMessage(m.chat, media, m.type, { quoted: m });
            } else {
                // Si no hay contenido multimedia, replica el mensaje sin el contenido
                await sock.sendMessage(m.chat, m.body, { quoted: m });
            }
        } catch (error) {
            console.error('Error en la ejecución del comando replicar:', error);
        }
    }
};
