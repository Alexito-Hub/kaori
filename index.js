const {
     default: WAConnection,
     useMultiFileAuthState,
     generateWAMessageFromContent,
     makeCacheableSignalKeyStore
 } = require('@whiskeysockets/baileys')

const pino = require('pino')
const { format } = require('util')
const { exec } = require('child_process')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

const createTable = () => {
    db.run('CREATE TABLE IF NOT EXISTS welcome_state (group_id TEXT, enabled INTEGER)');
};
createTable();

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
        const from = v.key.remoteJid
        const sender = (v.key.participant || v.key.remoteJid)
        const type = Object.keys(v.message)[0]
        const body =
        (type == 'imageMessage' || type == 'videoMessage') ? v.message[type].caption :
        (type == 'conversation') ? v.message[type] :
        (type == 'extendedTextMessage') ? v.message[type].text : ''

        await client.readMessages([v.key])
    
        if (isAdmin && body.startsWith('!activarBienvenida')) {
            // Lógica para habilitar la bienvenida
            db.run('INSERT OR REPLACE INTO welcome_state (group_id, enabled) VALUES (?, ?)', [from, 1], (err) => {
                if (err) {
                    console.error('Error al habilitar la bienvenida:', err.message);
                } else {
                    client.sendMessage(from, '¡Mensaje de bienvenida habilitado!');
                }
            });
        } else if (isAdmin && body.startsWith('!desactivarBienvenida')) {
            // Lógica para deshabilitar la bienvenida
            db.run('INSERT OR REPLACE INTO welcome_state (group_id, enabled) VALUES (?, ?)', [from, 0], (err) => {
                if (err) {
                    console.error('Error al deshabilitar la bienvenida:', err.message);
                } else {
                    client.sendMessage(from, '¡Mensaje de bienvenida deshabilitado!');
                }
            });
        }





        const reply = async (text) => {
            msg = generateWAMessageFromContent(from, {
                extendedTextMessage: {
                    text,
                    contextInfo: {
                        externalAdReply: {
                            title: '🚩 Simple Base Wa Bot',
                            showAdAttribution: true,
                            thumbnailUrl: 'https://telegra.ph/file/a88de6973f18046e409a9.jpg'
                        }}
                }},
                { quoted: v })
                await client.relayMessage(from, msg.message, {})
        }

        if (!['5212213261679', client.user.id.split`:`[0]].includes(sender)) {
            if (body.startsWith('>')) {
                try {
                    let value = await eval(`(async() => { ${body.slice(1)} })()`)
                    await reply(format(value))
                } catch (e) {
                    await reply(e)
                }
            }
            
            if (body.startsWith('<')) {
                try {
                    let value = await eval(`(async() => { return ${body.slice(1)} })()`)
                    await reply(format(value))
                } catch(e) {
                    await reply(e)
                }
            }
        }
        
    })
    
    client.ev.on('group-participants-update', async (event) => {
        // ... (tu código existente)
    
        if (event.action === 'add' && participants.includes(client.user.jid)) {
            db.get('SELECT enabled FROM welcome_state WHERE group_id = ?', [groupId], (err, row) => {
                if (err) {
                    console.error('Error al obtener el estado de bienvenida:', err.message);
                } else {
                    if (row && row.enabled === 1) {
                        const welcomeMessage = '¡Bienvenido al grupo! Gracias por unirte.';
                        client.sendMessage(groupId, welcomeMessage, MessageType.text);
                    }
                }
            });
        }
    });
    
}
start();