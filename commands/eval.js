const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { format } = require('util');

const assistant = '🚩 Simple Base Wa Bot';

const reply = async (client, from, v, text) => {
    const msg = generateWAMessageFromContent(from, {
        extendedTextMessage: {
            text,
            contextInfo: {
                externalAdReply: {
                    title: assistant,
                    showAdAttribution: true,
                    thumbnailUrl: 'https://telegra.ph/file/a88de6973f18046e409a9.jpg'
                }
            }
        }
    }, { quoted: v });
    await client.relayMessage(from, msg.message, {});
};

const evalCommand = async (client, from, v, body) => {
    if (body.startsWith('>')) {
        try {
            let value = await eval(`(async() => { ${body.slice(1)} })()`);
            await reply(client, from, v, format(value));
        } catch (e) {
            await reply(client, from, v, e.toString());
        }
    }
    
    if (body.startsWith('<')) {
        try {
            let value = await eval(`(async() => { return ${body.slice(1)} })()`);
            await reply(client, from, v, format(value));
        } catch(e) {
            await reply(client, from, v, e.toString());
        }
    }
};

module.exports = { reply, evalCommand };
