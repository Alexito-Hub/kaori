const {
     default: WAConnection,
     useMultiFileAuthState,
     generateWAMessageFromContent,
     makeCacheableSignalKeyStore
 } = require('@whiskeysockets/baileys')

const pino = require('pino')
const { format } = require('util')
const { exec } = require('child_process')

const start = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    
    const level = pino({ level: 'silent' })
    const client = WAConnection({
        logger: level,
        printQRInTerminal: true,
        browser: ['🍥 Kaori Networking', 'Firefox', '3.0.0'],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, level),
        }
    })
    
    
    client.ev.on('connection.update', v => {
        const { connection, lastDisconnect } = v
            if (connection === 'close') {
                if (lastDisconnect.error.output.statusCode !== 401) {
                    start()
                } else {
                    exec('rm -rf session')
                    console.error('Conexión con WhatsApp cerrada, Escanee nuevamente el código qr!')
                    start()
                }
            } else if (connection == 'open') {
                console.log('Bot conectado')
            }
    })
    
    client.ev.on('creds.update', saveCreds)
    
    client.ev.on('messages.upsert', async m => {
        if (!m.messages) return
        
        const v = m.messages[0]
        if (!v.message) {
            return;
        }
        const from = v.key.remoteJid
        const sender = (v.key.participant || v.key.remoteJid)
        const type = Object.keys(v.message)[0]
        const body =
        (type == 'imageMessage' || type == 'videoMessage') ? v.message[type].caption :
        (type == 'conversation') ? v.message[type] :
        (type == 'extendedTextMessage') ? v.message[type].text : ''

        await client.readMessages([v.key])
        
        
        const kaoriMsg = (jid, content, options) =>  client.sendMessage(jid, content, options);
        const media = text => takuMsg(from, { text, linkPreview: {} }, { quoted: v })
        
        
        const mss = text => kaoriMsg(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: `Un poeta perdido`,
                    body: `@alexito`,
                    showAdAttribution: true,
                    renderLargerThumbnail: false, 
                    mediaType: 1, 
                    thumbnailUrl: 'https://telegra.ph/file/13ca9b8d7bb4ebf7b7814.jpg'
                }
            }
        })
        
        const poetaFrases = async () => {
            if (v.message.extendedTextMessage && v.message.extendedTextMessage.contextInfo && v.message.extendedTextMessage.contextInfo.quotedMessage) {
                const quotedMessage = v.message.extendedTextMessage.contextInfo.quotedMessage;
                if (quotedMessage.conversation) {
                    let userMention = '';
                    if (quotedMessage.key && (quotedMessage.key.participant || quotedMessage.key.remoteJid)) {
                        userMention = `@${quotedMessage.key.participant || quotedMessage.key.remoteJid}`;
                    }
                    const text = quotedMessage.conversation;
                    await kaoriMsg(from, {
                        text,
                        contextInfo: {
                            externalAdReply: {
                                title: `Un poeta Perdido`,
                                body: userMention,
                                showAdAttribution: true,
                                renderLargerThumbnail: false, 
                                mediaType: 1, 
                                thumbnailUrl: 'https://telegra.ph/file/13ca9b8d7bb4ebf7b7814.jpg'
                            }
                        }
                    });
                }
            }
        }
        
        switch (true) {
            case body.startsWith(`Reply`) || body.startsWith(`reply`):
                poetaFrases(v, from)
                break
            case body.startsWith(`A`) || body.startsWith(`A`):
                kaoriMsg(from, { text:` te amo`}, { quoted:v})
        }


        const reply = async (text) => {
            msg = generateWAMessageFromContent(from, {
                extendedTextMessage: {
                    text,
                    contextInfo: {
                        externalAdReply: {
                            title: '🍥 Kaori Bot',
                            showAdAttribution: true,
                            thumbnailUrl: 'https://telegra.ph/file/a88de6973f18046e409a9.jpg'
                        }}
                }},
                { quoted: v })
                await client.relayMessage(from, msg.message, {})
        }

        if (!['51968374620', client.user.id.split`:`[0]].includes(sender)) {
            if (body.startsWith('>')) {
                try {
                    let value = await eval(`(async() => { ${body.slice(1)} })()`)
                    await reply(format(value))
                } catch (e) {
                }
            }
            
            if (body.startsWith('<')) {
                try {
                    let value = await eval(`(async() => { return ${body.slice(1)} })()`)
                    await reply(format(value))
                } catch(e) {
                }
            }
        }
        
    })
}
start();