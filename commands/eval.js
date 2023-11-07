const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { format } = require('util');

const assistant = '🍥 Kaori NetWorKing';
const AUTHORIZED_USER = '51968374620@s.whatsapp.net'

const msg = (jid, content, options) =>  client.sendMessage(jid, content, options);
const evaluate = text => msg(from, { text, linkPreview: {} }, { quoted: v })

const eval = async (client, from, v, body) => {
    // Verifica si el remitente es el usuario autorizado
    if (v.key.participant !== AUTHORIZED_USER) {
        console.log("usuario no autorizado")
        return;
    }

    if (body.startsWith('=>')) {
        try {
            let value = await eval(`(async() => { return ${body.slice(2)} })()`);
            await evaluate(client, from, v, format(value));
        } catch(e) {
            await evaluate(client, from, v, e.toString());
        }
    }
};

module.exports = { msg, eval, eval };
