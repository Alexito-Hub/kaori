module.exports = {
    name: 'add',
    description: 'Agrega a un usuario al grupo o envía una invitación de grupo',
    
    async execute(sock, m, args) {
        try {
            const groupInfo = await sock.groupMetadata(m.chat);
            const isAdmin = groupInfo && groupInfo.participants.some(p => p.id == m.sender && ['admin', 'superadmin'].includes(p.admin));
            const m 
            if (isAdmin) {
                if (args.length === 0) {
                    sock.sendMessage(m.chat, { text: '*add <número>*' }, { quoted: m });
                    return;
                }

                const targetNumber = args[0];

                // Agregar al usuario al grupo o enviar invitación
                await sock.groupParticipantsUpdate(m.chat, [targetNumber + '@s.whatsapp.net'], 'add');

                sock.sendMessage(m.chat, { text: `Usuario ${targetNumber} agregado al grupo o invitación enviada.` }, { quoted: m });
            } else {
                sock.sendMessage(m.chat, { text: 'Solo los administradores pueden agregar usuarios al grupo o enviar invitaciones.' }, { quoted: m });
            }
        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando' }, { quoted: m });
        }
    },
};
