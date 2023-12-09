require('../../config');

module.exports = {
    name: 'tagall',
    description: 'Etiqueta a todos los miembros de los grupos en los que participa el bot',
    aliases: ['tag', 'todos', 'all'],

    async execute(sock, m, args) {
        try {
            const senderNumber = m.sender.split('@')[0];
            const isOwner = owner.includes(senderNumber)
            if (isOwner) {
                return await sock.sendMessage(m.chat, { text: 'Solo el creador puede usar este comando.' }, { quoted: m });
            }

            const groups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);

            const message = args.join(' ');
            if (!message) return await sock.sendMessage(m.chat, { text: '¿Falta de ideas para un mensaje?' }, { quoted: m });

            for (const groupId of groupIds) {
                await sock.sendMessage(groupId, { 
                    text: message, 
                    contextInfo: { remoteJid: groupId },
                });
            }

            await sock.sendMessage(m.chat, { text: 'Envío de mensaje correcto.' }, { quoted: m });
        } catch (error) {
            console.error(error);
            await sock.sendMessage(m.chat, { text: 'Error al realizar el envío de mensajes' }, { quoted: m });
        }
    },
};
