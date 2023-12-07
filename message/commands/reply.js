// Comando para enviar un mensaje a todos los grupos
const sendMessageToAllGroups = async (sock, message) => {
    try {
        const groups = await sock.getAllGroups();
        for (const group of groups) {
            await sock.sendMessage(group.jid, { text: message });
            // Agrega un pequeño retraso para evitar posibles restricciones
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        sock.reply(sock.decodeJid(sock.user.jid), 'Mensaje enviado a todos los grupos.');
    } catch (error) {
        console.error('Error al enviar mensaje a todos los grupos:', error);
        sock.reply(sock.decodeJid(sock.user.jid), 'Error al enviar mensaje a todos los grupos.');
    }
};

module.exports = {
    name: 'sendallgroups',
    description: 'Envía un mensaje a todos los grupos',
    aliases: ['sendgroups', 'broadcast'],

    async execute(sock, m, args) {
        if (args.length !== 1) {
            v.reply('Uso incorrecto. Proporcione el mensaje que desea enviar a todos los grupos.');
            return;
        }

        const message = args[0];
        sendMessageToAllGroups(sock, message);
    }
};
