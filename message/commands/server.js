const os = require('os');
const util = require('util');
const { exec } = require('child_process');

module.exports = {
    name: 'serverinfo',
    description: 'Muestra información del servidor y estado del bot',
    aliases: ['server', 'botinfo'],

    async execute(sock, m) {
        try {
            // Información del servidor
            const serverInfo = {
                'Operador': os.type(),
                'Sistema Operativo': os.platform(),
                'Arquitectura': os.arch()
            };

            // Información del almacenamiento en %
            exec('df -h --output=pcent /', (error, stdout) => {
                if (!error) {
                    const storagePercent = stdout.trim().split('\n')[1] || 'No disponible';
                    serverInfo['Almacenamiento en %'] = storagePercent;
                }

                // Información del uso de RAM
                const totalMemory = os.totalmem();
                const freeMemory = os.freemem();
                const usedMemory = totalMemory - freeMemory;
                const usedMemoryPercent = (usedMemory / totalMemory * 100).toFixed(2) + '%';
                serverInfo['RAM Usado'] = usedMemoryPercent;

                // Construir y enviar el mensaje de información
                const infoMessage = `🤖 **Información del Servidor y Estado del Bot** 🖥️\n\n` +
                    `**Información del Servidor**:\n${formatInfo(serverInfo)}`;

                sock.sendMessage(m.chat, { text: infoMessage }, { quoted: m });
            });
        } catch (error) {
            console.log('Error en la ejecución del comando serverinfo:', error);
        }
    }
};

// Función para formatear la información en un objeto
function formatInfo(infoObj) {
    return Object.entries(infoObj)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join('\n');
}
