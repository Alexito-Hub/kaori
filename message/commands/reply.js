// Comando para replicar o reenviar un mensaje
module.exports = {
    name: 'replicar',
    description: 'Replique o reenvíe un mensaje',
    aliases: ['repl', 'enviar'],

    execute(sock, m, args) {

        const replyMsg = args.join(' ');

        // Envía el mensaje de vuelta al mismo chat
        sock.sendMessage(m.chat, { text:replyMsg }, { quoted: m });
    }
};
