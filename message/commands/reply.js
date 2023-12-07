const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'broadcast',
    description: 'Envía un mensaje a todos los grupos en los que el bot está participando',
    aliases: ['bcgc', 'bcgroup'],

    async execute(sock, m, args) {
        try {

            const isOwner = global.owner.includes(m.sender.split('@')[0]);

            if (!isOwner) return v.reply(`Este comando solo puede ser utilizado por el propietario.`);

            const text = args.join(' ');
            if (!text) return v.reply(`¿Qué mensaje deseas enviar a todos los grupos?`);

            const groups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);


            v.reply(`Enviando mensaje a ${groupIds.length} Grupos. Tiempo Estimado: ${groupIds.length * 1.5} segundos.`);

            for (const groupId of groupIds) {
                await sleep(1500);
                // Envia el mensaje a cada grupo
                sock.sendMessage(groupId, { text });
            }

            v.reply(`Mensaje enviado correctamente a ${groupIds.length} grupos.`);
        } catch (error) {
            console.log('Error en la ejecución del comando broadcast:', error);
        }
    }
};
