// Comando para replicar o reenviar un mensaje
module.exports = {
    name: 'replicar',
    description: 'Replique o reenvíe un mensaje',
    aliases: ['repl', 'enviar'],

    execute(sock, m, args) {
        if (!args || args.length === 0) {
            v.reply('Por favor, proporciona un mensaje para replicar o reenviar.');
            return;
        }

        const replyMsg = args.join(' ');

        // Envía el mensaje de vuelta al mismo chat
        sock.sendMessage(m.chat, { text:replyMsg }, { quoted: m });
    }
};
