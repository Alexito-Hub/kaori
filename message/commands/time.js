module.exports = {
    name: 'time',
    description: 'Muestra el tiempo de actividad',
    aliases: ['time', 'run'],
    
    async execute(sock, m) {
        const uptimeSeconds = Math.floor(process.uptime());
        const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
        const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
        const seconds = uptimeSeconds % 60;

        const formattedTime = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        await v.reply(`*[ ${formattedTime} ]*`, { quoted: m });
    }
}