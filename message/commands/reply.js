const { isOwner} = require('../../message/upsert')
module.exports = {
    name: 'tagall',
    description: 'Etiqueta a todos los miembros de los grupos en los que participa el bot',
    aliases: ['tag', 'todos', 'all'],

    async execute(sock, m) {
        try {
            if (isOwner) {

                const groups = await sock.groupFetchAllParticipating();
                const groupIds = Object.keys(groups);
                
                const message = args.join(' ');
                if (!message) return v.reply('¿Falta de ideas para un mensaje?');
    
                for (const groupId of groupIds) {
                    await sock.sendMessage(groupId, { 
                        text: message, 
                        contextInfo: { remoteJid: groupId },
                    });
                }
                await sock.sendMessage(m.chat, { text:'Envio de mensaje correcto.'}, { quoted: m });
            }
        } catch (error) {
            console.log(error);
            await sock.sendMessage(m.chat, {text:'Error al realizar el envio de mensajes'}, { quoted: m });
        }
    },
};
