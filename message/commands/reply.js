const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'broadcast',
    description: 'Envía un mensaje a todos los grupos en los que el bot es administrador',
    aliases: ['bcgc', 'bcgroup'],

    async execute(sock, m, args) {
        try {
            const isOwner = global.owner.includes(m.sender.split('@')[0]);

            if (!isOwner) return v.reply(`Este comando solo puede ser utilizado por el propietario.`, {quoted: m});

            const text = args.join(' ');
            if (!text) return v.reply(`¿Qué mensaje deseas enviar a los grupos?`, {quoted: m});

            const adminGroups = await sock.getGroupAdmins();
            
            if (!adminGroups || adminGroups.length === 0) {
                return v.reply(`El bot no es administrador en ningún grupo actualmente.`, {quoted:m});
            }

            v.reply(`Enviando mensaje a ${adminGroups.length} Grupos. Tiempo Estimado: ${adminGroups.length * 1.5} segundos.`, {quoted:m});

            for (const groupId of adminGroups) {
                try {
                    await sleep(1500);
                    
                    if (m.hasMedia) {
                        const mediaData = await sock.downloadMediaMessage(m);
                        await sock.sendMessage(groupId, { text, media: mediaData }, m);
                    } else {
                        await sock.sendMessage(groupId, { text });
                    }
                } catch (sendError) {
                    console.log(`Error al enviar mensaje al grupo ${groupId}:`, sendError);
                }
            }

            v.reply(`Mensaje enviado correctamente a ${adminGroups.length} grupos.`, {quoted:m});
        } catch (error) {
            console.error('Error en la ejecución del comando broadcast:', error);
            v.reply(`Se produjo un error al ejecutar el comando broadcast.`, {quoted:m});
        }
    }
};
