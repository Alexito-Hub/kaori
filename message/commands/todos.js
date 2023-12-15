const { Presence } = require('@adiwajshing/baileys');

module.exports = {
    name: 'tag',
    description: 'Menciona a todos los miembros del grupo.',
    aliases: ['@tag'],

    async execute(sock, m, args) {
        try {
            if (!m.isGroup) return sock.sendMessage(m.chat, { text: 'Este comando solo se puede usar en grupos.' });
            if (!m.isAdmin) return sock.sendMessage(m.chat, { text: 'Debes ser administrador para usar este comando.' });

            await sock.updatePresence(m.from, Presence.composing);

            const groupMembers = m.groupMembers.map(mem => ({ jid: mem.jid, name: mem.name }));

            let message = `*[ MIEBROS DEL GRUPO ]*\n\n`;
            for (const mem of groupMembers) {
                message += `╠ @${mem.jid.split('@')[0]}\n`;
            }

            const membersJids = groupMembers.map(mem => mem.jid);
            await sock.sendMessage(m.chat, { text: message }, { contextInfo: { mentionedJid: membersJids } });
        } catch (error) {
            console.error('Error en el comando @tag:', error);
            sock.sendMessage(m.chat, { text: 'Se produjo un error al ejecutar el comando @tag.' });
        }
    },
};
