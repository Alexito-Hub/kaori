const fs = require('fs');
const path = require('path');

const configFile = path.join(__dirname, '../config.json');
let config;

function loadConfig() {
    try {
        const configContent = fs.readFileSync(configFile, 'utf-8');
        return JSON.parse(configContent);
    } catch (error) {
        console.error('Error al cargar el archivo de configuración:', error);
        return {};
    }
}

function saveConfig() {
    try {
        const configString = JSON.stringify(config, null, 2);
        fs.writeFileSync(configFile, configString, 'utf-8');
    } catch (error) {
        console.error('Error al guardar el archivo de configuración:', error);
    }
}

module.exports = async(sock, m, store) => {
    try {

        if (!config) {
            config = loadConfig();
        }

        const body = m.body.toLowerCase();
        const sender = m.sender.split('@')[0];

        if (body.startsWith('saff')) {
            if (sender === isOwner) {
                const [_, state] = body.split(' ');
                if (state === 'on' || state === 'off') {
                    const isEnabled = state === 'on';
                    if (config.areCommandsEnabled === isEnabled) {
                        await sock.sendMessage(m.chat, { text: `Los comandos ya están ${isEnabled ? 'habilitados' : 'deshabilitados'}.` }, { quoted: m });
                    } else {
                        config.areCommandsEnabled = isEnabled;
                        saveConfig();

                        if (isEnabled) {
                            await sock.sendMessage(m.chat, { text: 'Los comandos han sido habilitados.' }, { quoted: m });
                        } else {
                            await sock.sendMessage(m.chat, { text: 'Los comandos han sido deshabilitados.' }, { quoted: m });
                        }
                    }
                } else {
                    await sock.sendMessage(m.chat, { text: 'Comando no válido. Usa "on" o "off" para habilitar o deshabilitar comandos.' }, { quoted: m });
                }
            } else {
                await sock.sendMessage(m.chat, { text: 'No tienes permisos para ejecutar este comando.' }, { quoted: m });
            }
            return;
        }

        // Resto del código para procesar otros comandos
    } catch (error) {
        console.error('Error al procesar comandos:', error);
    }
}
