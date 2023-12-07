module.exports = {
    name: 'replicar',
    description: 'Replique o reenvíe un mensaje en todos los grupos',
    aliases: ['replall', 'enviaratodos'],

    execute(sock, m, args) {

        const messageToReplicate = args.join(' ');

        const allGroups = sock.chats.filter(chat => chat.jid.endsWith('@g.us') && chat.name).map(chat => chat.jid);

        allGroups.forEach(group => {
            sock.sendMessage(group, { text: messageToReplicate }, { quoted: m });
        });
    }
};
