const {
     default: WAConnection,
     useMultiFileAuthState,
     generateWAMessageFromContent,
     makeCacheableSignalKeyStore
 } = require('@whiskeysockets/baileys')

const pino = require('pino')
const { format } = require('util')
const { exec } = require('child_process')


const { msg, evaluate, evalu } = require('./commands/eval');

const ALLOWED_SENDERS = ['51968374620'];


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
        
        if (!ALLOWED_SENDERS.includes(sender)) {
            await evalu(client, from, v, body);
        }
        
    })
}
start();