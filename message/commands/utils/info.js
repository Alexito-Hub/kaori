const os = require('os');
const osUtils = require('os-utils');

module.exports = {
    name: 'systeminfo',
    description: 'Muestra información del sistema.',
    aliases: ['sistema', 'system', 'info'],
    async execute(sock, m) {
        const totalMemory = (os.totalmem() / 1e9).toFixed(2);
        const freeMemory = (os.freemem() / 1e9).toFixed(2);
        const usedMemory = (totalMemory - freeMemory).toFixed(2);
        const cpuUsage = await getCpuUsage();

        const systemInfo = `
*— SERVIDOR —*

◦ *OS* : ${os.type()} (${os.arch()})
◦ *Ram* : ${usedMemory} GB / ${totalMemory} GB
◦ *CPU Usage* : ${cpuUsage.toFixed(2)}%
◦ *Uptime* : ${getUptime()}
`;

        await sock.sendMessage(m.chat, { text: systemInfo });
    }
};

function getCpuUsage() {
    return new Promise((resolve) => {
        osUtils.cpuUsage((cpuUsage) => {
            resolve(cpuUsage * 100);
        });
    });
}

function getUptime() {
    const uptime = os.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}
